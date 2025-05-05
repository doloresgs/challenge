import { Component, Input, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() productId: string = '';
  product!: Product;
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  async ngOnInit(): Promise<void> {
    this.product = await lastValueFrom(this.productService.getProductById(this.productId));
    this.categories = await lastValueFrom(this.categoryService.getCategories());
  }

  // Helper method to get category names from IDs
  getCategoryNames(categoryIds: number[]): string[] {
    return categoryIds.map(id => {
      const category = this.categories.find(c => c.id === id);
      return category ? category.name : 'Unknown';
    });
  }

}