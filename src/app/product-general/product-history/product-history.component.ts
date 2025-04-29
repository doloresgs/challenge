import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-history',
  templateUrl: './product-history.component.html',
  styleUrls: ['./product-history.component.css']
})
export class ProductHistoryComponent implements OnInit {
  @Input() productId: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
