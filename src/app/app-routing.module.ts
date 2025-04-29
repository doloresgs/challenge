import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryTreeComponent } from './category-tree/category-tree.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataGraphicsComponent } from './data-graphics/data-graphics.component';
import { ProductGeneralComponent } from './product-general/product-general.component';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'product-general/:id', component: ProductGeneralComponent },
    //{ path: 'product-form/add', component: ProductFormComponent }, // Add new product
    //{ path: 'product-form/edit/:id', component: ProductFormComponent }, // Edit product by ID
    { path: 'category-tree', component: CategoryTreeComponent },
    { path: 'data-graphics', component: DataGraphicsComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }