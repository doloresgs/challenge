import { createReducer, on } from '@ngrx/store';
import { clearData, setData } from './data.actions';


export interface AppState {
    data: string;
}

export const initialState: AppState = { data: '' };

export const dataReducer = createReducer(
    initialState,
    on(setData, (state, { data }) => ({ ...state, data })),
    on(clearData, () => ({ ...initialState }))
);