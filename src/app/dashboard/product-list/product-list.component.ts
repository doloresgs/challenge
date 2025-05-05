import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { ProductHistory } from 'src/app/models/product-history';
import { CategoryService } from 'src/app/services/category.service';
import { ProductHistoryService } from 'src/app/services/product-history.service';
import { ProductService } from 'src/app/services/product.service';
import { selectData } from 'src/app/store/data/data.selectors';
import { createProductFailure, deleteProductFailure, deleteProductSuccess, loadProductFailure, loadProductSuccess } from 'src/app/store/products/products.actions';
import { selectProduct } from 'src/app/store/products/products.selectors';
import { UtilityFunctions } from 'src/app/utility-functions';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @Output() productListUpdated = new EventEmitter<void>();
  @Output() filteredProductsList = new EventEmitter<Product[]>();

  categoriesFilter: FormGroup;
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  selectedCategories: number[] = [];

  totalRecords = 0;
  loading = true;
  rowsPerPage = 5; // Number of rows per page
  currentPage = 0;

  display = false;
  productForm: FormGroup;
  isEditMode = false;
  selectedCategoriesObject: Category[] = [];
  productId: number = 0;

  productHistory: ProductHistory | undefined;

  product$ = this.store.select(selectProduct);
  receivedData$: Observable<string>;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private productHistoryService: ProductHistoryService,
    private router: Router,
    private store: Store,
    private fb: FormBuilder
  ) {
    this.categoriesFilter = this.fb.group({
      selectedCategories: [[]] // Initialize with an empty array
    });

    this.productForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: [''],
      categories: [[]], // Multiple categories
      selectedCategories: [[]],
      price: [0, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      quantity: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]]
    });

    this.receivedData$ = this.store.select(selectData);
  }

  async ngOnInit(): Promise<void> {
    this.loadProducts();
    this.categories = await firstValueFrom(this.categoryService.getCategories());
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.totalRecords = products.length;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
    this.loading = false;
  }

  filterProducts(): void {
    const selectedCategories = this.categoriesFilter.get('selectedCategories')?.value || [];

    if (selectedCategories.length === 0) {
      this.filteredProducts = [...this.products]; // Show all products if no filter is selected
    } else {
      this.filteredProducts = this.products.filter(product =>
        (product.categories ?? []).some(catId => selectedCategories.includes(catId))
      );
    }
    this.totalRecords = this.filteredProducts.length;
    this.filteredProductsList.emit(this.filteredProducts); // Emit the filtered products
  }

  // Helper method to get category names from IDs
  getCategoryNames(categoryIds: number[]): string[] {
    return categoryIds.map(id => {
      const category = this.categories.find(c => c.id === id);
      return category ? category.name : 'Unknown';
    });
  }

  lookProduct(productId: number): void {
    this.router.navigate(['/product-general', productId]); // Navigate to product-general with product ID
  }

  addProduct(): void {
    //this.router.navigate(['/product-form/add']); // Navigate to add form
    this.display = true;
    const productId = ''; // Set the input product ID to 0 for adding a new product
    this.onInitPopUp(productId); // Initialize the pop-up
  }

  editProduct(productId: string): void {
    //this.router.navigate(['/product-form/edit', productId]); // Navigate to edit form with product ID
    //this.store.dispatch(setData({ data: productId.toString() }));
    this.display = true;
    this.onInitPopUp(productId); // Initialize the pop-up
  }

  deleteProduct(productId: string): void {
    // Call the service method to delete the product
    this.productService.deleteProduct(productId).subscribe({
      next: async (deletedProduct) => {
        // Dispatch the action after successful deletion
        // Dispatch the NgRx action to update the store
        this.store.dispatch(deleteProductSuccess({ product: deletedProduct }));
        this.loadProducts(); // Reload products
        this.onPageChange({ first: this.currentPage, rows: this.rowsPerPage }); // Reset pagination
        this.productListUpdated.emit(); // Emit event to notify parent component
        this.productHistory = {
          id: UtilityFunctions.newGUID(),
          productId: deletedProduct.id,
          type: 'OUT',
          quantity: deletedProduct.quantity,
          timestamp: new Date()
        };
        await lastValueFrom(this.productHistoryService.createProductHistory(this.productHistory));
      },
      error: (err) => {
        this.store.dispatch(deleteProductFailure({ error: err }));
        console.error('Error Deleteing Product:', err);
      },
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.first;
    this.rowsPerPage = event.rows;
  }


  //POP-UP

  async onInitPopUp(productId: string): Promise<void> {
    try {
      this.categories = await lastValueFrom(this.categoryService.getCategories());
      if (productId) {
        this.isEditMode = true;
        await this.loadEditProduct(productId); // Load product for editing
      } else {
        this.productForm.reset();
        this.isEditMode = false;
        console.log('No valid product ID provided. Form is in create mode.');
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  async loadEditProduct(productId: string): Promise<void> {
    try {
      const product = await lastValueFrom(this.productService.getProductById(productId));
      if (!product) {
        //this.store.dispatch(loadProductFailure({ error: `Product ID ${productId} not found.` }));
        this.display = false;
        return;
      }
      // Map product categories to selected categories
      this.selectedCategoriesObject = this.categories.filter(category =>
        (product.categories ?? []).includes(category.id)
      );
      console.log('Selected Categories Object:', this.selectedCategoriesObject);

      // Update the product's categories to use selected category IDs
      //product.categories = this.selectedCategoriesObject.map(c => c.id);
      this.selectedCategories = this.selectedCategoriesObject.map(c => c.id);
      // Patch the form with product values
      //this.productForm.patchValue(product);
      this.productForm.patchValue({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        selectedCategories: this.selectedCategoriesObject // Patch full objects
      });
      this.store.dispatch(loadProductSuccess({ product: product }));
    } catch (error) {
      this.store.dispatch(loadProductFailure({ error: error }));
      console.error('Error loading product:', error);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.selectedCategories = this.productForm.value.selectedCategories.map((category: Category) => category.id);
      this.productForm.patchValue({ categories: this.selectedCategories });
      if (!this.isEditMode) {
        // Assign new ID if creating a new product
        const newId = UtilityFunctions.newGUID();
        this.productForm.patchValue({ id: newId });
        delete this.productForm.value.selectedCategories;
        const product: Product = this.productForm.value;
        // Call the service method to create the product
        this.productService.createProduct(product).subscribe({
          next: async (createdProduct) => {
            this.loadProducts(); // Reload products
            this.onPageChange({ first: 0, rows: this.rowsPerPage }); // Reset pagination
            console.log('Product Created:', createdProduct);
            this.productHistory = {
              id: UtilityFunctions.newGUID(),
              productId: createdProduct.id,
              type: 'IN',
              quantity: createdProduct.quantity,
              timestamp: new Date()
            };
            await lastValueFrom(this.productHistoryService.createProductHistory(this.productHistory));
          },

          error: (err) => {
            this.store.dispatch(createProductFailure({ error: err }));
            console.error('Error Creating Product:', err);
          },
        });
        // Dispatch the NgRx action to update the store
        //this.store.dispatch(createProduct({ product: product }));
      } else {
        // Update the product
        const updatedProduct: Product = this.productForm.value;
        this.productService.updateProduct(updatedProduct).subscribe({
          next: async (updatedProduct) => {
            this.loadProducts(); // Reload products
            this.onPageChange({ first: this.currentPage, rows: this.rowsPerPage }); // Reset pagination
            if (updatedProduct.quantity !== this.productForm.value.quantity) {
              this.productHistory = {
                id: UtilityFunctions.newGUID(),
                productId: updatedProduct.id,
                type: updatedProduct.quantity > this.productForm.value.quantity ? 'IN' : 'OUT',
                quantity: updatedProduct.quantity,
                timestamp: new Date()
              };
              await lastValueFrom(this.productHistoryService.createProductHistory(this.productHistory));
            }
            // Dispatch the NgRx action to update the store
            //this.store.dispatch(loadProductSuccess({ product: updatedProduct }));
          },
          error: (err) => {
            this.store.dispatch(loadProductFailure({ error: err }));
            console.error('Error Updating Product:', err);
          },
        });
      }
      this.display = false;
    }
    this.productListUpdated.emit(); // Emit event to notify parent component
  }

  onCancel(): void {
    this.display = false;
  }

  // Close Icon in p-dialog
  onDialogClose(): void {
    this.display = false;
  }
}