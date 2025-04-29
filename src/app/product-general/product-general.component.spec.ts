import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGeneralComponent } from './product-general.component';

describe('ProductGeneralComponent', () => {
  let component: ProductGeneralComponent;
  let fixture: ComponentFixture<ProductGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
