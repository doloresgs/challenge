import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from 'src/app/services/product.service';
import { loadProduct, loadProductSuccess, loadProductFailure, createProduct, createProductSuccess, createProductFailure } from './products.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ProductsEffects {
    constructor(private actions$: Actions, private productService: ProductService) { }

    loadProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadProduct),
            mergeMap(action =>
                this.productService.getProductById(action.productId).pipe(
                    map(product => loadProductSuccess({ product })),
                    catchError(error => of(loadProductFailure({ error })))
                )
            )
        )
    );

    createProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createProduct),
            mergeMap(action =>
                this.productService.createProduct(action.product).pipe(
                    map(product => createProductSuccess({ product })),
                    catchError(error => of(createProductFailure({ error })))
                )
            )
        )
    );
}