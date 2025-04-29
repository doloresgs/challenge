import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './data.reducer';

export const selectDataState = createFeatureSelector<AppState>('data');

export const selectData = createSelector(
    selectDataState,
    (state: AppState) => state.data
);