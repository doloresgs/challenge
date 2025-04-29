import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './products.reducer';

export const selectProductState = createFeatureSelector<ProductState>('product');

export const selectProduct = createSelector(
    selectProductState,
    (state: ProductState) => state.product
);

export const selectProductLoading = createSelector(
    selectProductState,
    (state: ProductState) => state.loading
);

/* export const selectProductHistory = (productId: string) => createSelector(
    selectProductHistoryState,
    (state) => state.productHistory.filter(ph => ph.productId === productId)
); */
