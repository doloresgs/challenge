import { createAction, props } from '@ngrx/store';
import { Product } from 'src/app/models/product';

export const loadProduct = createAction('[Product Form] Load Product', props<{ productId: string }>());
export const loadProductSuccess = createAction('[Product Form] Load Product Success', props<{ product: Product }>());
export const loadProductFailure = createAction('[Product Form] Load Product Failure', props<{ error: any }>());

export const createProduct = createAction('[Product Form] Create Product', props<{ product: Product }>());
export const createProductSuccess = createAction('[Product Form] Create Product Success', props<{ product: Product }>());
export const createProductFailure = createAction('[Product Form] Create Product Failure', props<{ error: any }>());


export const deleteProduct = createAction('[Product List] Delete Product', props<{ product: Product }>());
export const deleteProductSuccess = createAction('[Product List] Delete Product Success', props<{ product: Product }>());
export const deleteProductFailure = createAction('[Product List] Delete Product Failure', props<{ error: any }>());