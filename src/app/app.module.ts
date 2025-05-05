import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TreeModule } from 'primeng/tree';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryTreeComponent } from './category-tree/category-tree.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductFormComponent } from './dashboard/product-form/product-form.component';
import { ProductIndicatorsComponent } from './dashboard/product-indicators/product-indicators.component';
import { ProductListComponent } from './dashboard/product-list/product-list.component';
import { DataGraphicsComponent } from './data-graphics/data-graphics.component';
import { ProductGeneralComponent } from './product-general/product-general.component';
import { ProductHistoryComponent } from './product-general/product-history/product-history.component';
import { ProductComponent } from './product-general/product/product.component';
import { CategoryService } from './services/category.service';
import { ProductHistoryService } from './services/product-history.service';
import { ProductService } from './services/product.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { dataReducer } from './store/data/data.reducer';
import { ProductsEffects } from './store/products/products.effects';
import { productsReducer } from './store/products/products.reducer';


@NgModule({
  declarations: [
    AppComponent,
    CategoryTreeComponent,
    DashboardComponent,
    DataGraphicsComponent,
    ProductComponent,
    ProductFormComponent,
    ProductGeneralComponent,
    ProductHistoryComponent,
    ProductIndicatorsComponent,
    ProductListComponent,
    SidebarComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    CardModule,
    ChartModule,
    ChipsModule,
    DialogModule,
    FormsModule,
    HttpClientModule,
    MultiSelectModule,
    PaginatorModule,
    PanelModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    SidebarModule,
    StoreModule.forRoot({ product: productsReducer }), // Register reducers
    StoreModule.forRoot({ data: dataReducer }),
    StoreModule.forFeature('product', productsReducer),
    EffectsModule.forRoot([ProductsEffects]),          // Register effects
    TableModule,
    TabViewModule,
    TreeModule
  ],
  providers: [
    ProductService,
    CategoryService,
    ProductHistoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
