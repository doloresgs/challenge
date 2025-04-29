import { createReducer, on } from '@ngrx/store';
import { Product } from 'src/app/models/product';
import { createProductSuccess, deleteProductSuccess, loadProductSuccess } from './products.actions';
import { UtilityFunctions } from 'src/app/utility-functions';

export interface ProductState {
  product: Product;
  loading: boolean;
  error?: any;
}

export const initialState: ProductState = {
  product: {
    id: UtilityFunctions.newGUID(),
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categories: [], // Add any relevant default values
  },
  loading: false,
  error: null,
};

export const productsReducer = createReducer(
  initialState,
  on(loadProductSuccess, (state, { product }) => ({ ...state, product, loading: false })),
  on(createProductSuccess, (state, { product }) => ({ ...state, product, loading: false })),
  on(deleteProductSuccess, (state, { product }) => ({ ...state, product, loading: false })),
);