import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { Product } from '../models/product';
import { ProductIndicatorsComponent } from './product-indicators/product-indicators.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(ProductIndicatorsComponent) productIndicators!: ProductIndicatorsComponent;
  // This will be used to refresh the product-indicators component when the product list is updated
  @Output() filteredProducts: Product[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  onProductListUpdated(): void {
    // Notify the product-indicators component to refresh
    this.productIndicators.refresh();
  }
  
  onFilteredProductsList(filteredProducts: Product[]): void {
    // Update the filtered products and pass them to product-indicators
    this.filteredProducts = filteredProducts;
    console.log('Filtered Products:', this.filteredProducts);
  }

}