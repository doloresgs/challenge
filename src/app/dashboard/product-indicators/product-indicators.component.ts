import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-indicators',
  templateUrl: './product-indicators.component.html',
  styleUrls: ['./product-indicators.component.css']
})
export class ProductIndicatorsComponent implements OnInit {
  @Input() filteredProducts: Product[] = [];
  totalProducts = 0;
  productsLessThanFive = 0;
  totalPrice = 0;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchTotalProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredProducts'] && this.filteredProducts) {
      this.updateIndicators();
    }
  }

  // Fetch total products 
  fetchTotalProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.productsLessThanFive = products.filter(product => product.quantity < 5).length;
        this.totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  refresh(): void {
    this.fetchTotalProducts();
  }

  updateIndicators(): void {
    this.totalProducts = this.filteredProducts.length;
    this.productsLessThanFive = this.filteredProducts.filter(product => product.quantity < 5).length;
    this.totalPrice = this.filteredProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  }

}