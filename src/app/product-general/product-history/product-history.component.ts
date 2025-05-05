import { Component, Input, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { ProductHistory } from 'src/app/models/product-history';
import { CategoryService } from 'src/app/services/category.service';
import { ProductHistoryService } from 'src/app/services/product-history.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-history',
  templateUrl: './product-history.component.html',
  styleUrls: ['./product-history.component.css']
})
export class ProductHistoryComponent implements OnInit {
  @Input() productId: string = '';
  product!: Product;
  categories: Category[] = [];
  productHistory: ProductHistory[] = [];

  totalRecords = 0;
  loading = true;
  rowsPerPage = 5; // Number of rows per page
  currentPage = 0;

  constructor(
    private productService: ProductService,
    private productHistoryService: ProductHistoryService,
    private categoryService: CategoryService
  ) { }

  async ngOnInit(): Promise<void> {
    this.loadProductHistory();
    this.product = await lastValueFrom(this.productService.getProductById(this.productId));
    this.categories = await lastValueFrom(this.categoryService.getCategories());
  }

  loadProductHistory(): void {
    this.productHistoryService.getProductHistoryByProductId(this.productId).subscribe({
      next: (productHistory) => {
        this.productHistory = productHistory;
        this.totalRecords = productHistory.length;
      },
      error: (err) => {
        console.error('Error loading product history:', err);
      }
    });
    this.loading = false;
  }

  // Helper method to get category names from IDs
  getCategoryNames(categoryIds: number[]): string[] {
    return categoryIds.map(id => {
      const category = this.categories.find(c => c.id === id);
      return category ? category.name : 'Unknown';
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.first;
    this.rowsPerPage = event.rows;
  }

}