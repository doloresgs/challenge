import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-indicators',
  templateUrl: './product-indicators.component.html',
  styleUrls: ['./product-indicators.component.css']
})
export class ProductIndicatorsComponent implements OnInit {

  totalProducts = 0;
  productsLessThanFive = 0;
  totalPrice = 0;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchTotalProducts();
  }

  // Fetch total products dynamically 
  async fetchTotalProducts(): Promise<void> {
    const products = await firstValueFrom(this.productService.getProducts());
    this.totalProducts = products.length;
    this.productsLessThanFive = products.filter(product => product.quantity < 5).length;
    this.totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  }

}