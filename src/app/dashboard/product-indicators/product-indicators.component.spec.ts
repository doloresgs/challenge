import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTotalComponent } from './product-indicators.component';

describe('ProductTotalComponent', () => {
  let component: ProductTotalComponent;
  let fixture: ComponentFixture<ProductTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTotalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
