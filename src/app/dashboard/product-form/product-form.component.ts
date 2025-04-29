import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { selectData } from 'src/app/store/data/data.selectors';
import { createProduct, createProductFailure, loadProductFailure, loadProductSuccess } from 'src/app/store/products/products.actions';
import { selectProduct } from 'src/app/store/products/products.selectors';
import { UtilityFunctions } from 'src/app/utility-functions';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Input() display = false;
  @Input() inputProductId!: string;
  @Output() displayChange = new EventEmitter<boolean>();

  productForm: FormGroup;
  isEditMode = false;
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  productId: number = 0;

  product$ = this.store.select(selectProduct);
  receivedData$: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private store: Store
  ) {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      description: [''],
      selectedCategories: [[]], // Multiple categories
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(1)]]
    });

    this.receivedData$ = this.store.select(selectData);
  }

  async ngOnInit(): Promise<void> {
    try {
      this.categories = await lastValueFrom(this.categoryService.getCategories());
      if (this.inputProductId) {
        this.isEditMode = true;
        await this.loadProduct(this.inputProductId); // Load product for editing
      } else {
        console.log('No valid product ID provided. Form is in create mode.');
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    }
    /*       // Get the product ID from the store
          this.productId = await lastValueFrom(this.receivedData$);
          console.log('Product ID:', this.productId);
    
          this.categories = await lastValueFrom(this.categoryService.getCategories());
          if (this.productId) {
            this.isEditMode = true;
            await this.loadProduct(parseInt(this.productId, 10)); // Load product for editing
          } else {
            console.log('No valid product ID provided. Form is in create mode.');
          }
        } catch (error) {
          console.error('Error during initialization:', error);
        } */
  }

  async loadProduct(productId: string): Promise<void> {
    try {
      const product = await lastValueFrom(this.productService.getProductById(productId));
      if (!product) {
        console.warn(`Product ID ${productId} not found.`);
        return;
      }
      // Map product categories to selected categories
      this.selectedCategories = this.categories.filter(category =>
        (product.categories ?? []).includes(category.id)
      );

      // Update the product's categories to use selected category IDs
      product.categories = this.selectedCategories.map(c => c.id);

      // Debugging (can be removed in production)
      console.log('Selected Categories:', this.selectedCategories);
      console.log('Product Details:', product);

      // Patch the form with product values
      //this.productForm.patchValue(product);
      this.productForm.patchValue({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        selectedCategories: this.selectedCategories // Patch full objects
      });
      this.store.dispatch(loadProductSuccess({ product: product }));
    } catch (error) {
      this.store.dispatch(loadProductFailure({ error: error }));
      console.error('Error loading product:', error);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (!this.isEditMode) {
        // Assign new ID if creating a new product
        const newId = UtilityFunctions.newGUID()
        this.productForm.patchValue({ id: newId });

        const product: Product = this.productForm.value;
        // Call the service method to create the product
        this.productService.createProduct(product).subscribe({
          next: (createdProduct) => {
            console.log('Product Created:', createdProduct);

            // Dispatch the action after successful creation
            // Dispatch the NgRx action to update the store
            this.store.dispatch(createProduct({ product: createdProduct }));
          },
          error: (err) => {
            this.store.dispatch(createProductFailure({ error: err }));
            console.error('Error Creating Product:', err);
          },
        });
      } else {
        // Update the product
        const updatedProduct: Product = this.productForm.value;
        this.productService.updateProduct(updatedProduct).subscribe({
          next: (updatedProduct) => {
            console.log('Product Updated:', updatedProduct);
            // Dispatch the NgRx action to update the store
            this.store.dispatch(loadProductSuccess({ product: updatedProduct }));
          },
          error: (err) => {
            this.store.dispatch(loadProductFailure({ error: err }));
            console.error('Error Updating Product:', err);
          },
        });
      }
      this.displayChange.emit(false);
    }
  }

  onCancel(): void {
    this.displayChange.emit(false);
  }

  // Close Icon in p-dialog
  onDialogClose(): void {
    this.displayChange.emit(false);
  }

}