import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-data-graphics',
  templateUrl: './data-graphics.component.html',
  styleUrls: ['./data-graphics.component.css']
})
export class DataGraphicsComponent implements OnInit {

  chartProduct: any;
  productData: any;
  productOptions: any;
  products: Product[] = [];

  constructor(
    private productService: ProductService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.products = await firstValueFrom(this.productService.getProducts());

    this.chartProduct = {
      labels: this.products.map(p => p.name),
      datasets: [
        {
          label: 'Product Prices',
          data: this.products.map(p => p.price),
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
        }
      ]
    };

    this.productOptions = {
      plugins: {
        legend: {
          position: 'right'
        },
        tooltip: {
          enabled: true
        }
      },
      responsive: true
    };


    this.productData = {
      labels: this.products.map(p => p.name),
      datasets: [
        {
          data: this.products.map(p => p.quantity),
          backgroundColor: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'violet'], // Customizable colors
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    };


  }

}