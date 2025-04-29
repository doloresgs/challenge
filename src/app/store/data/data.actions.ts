import { createAction, props } from "@ngrx/store";

export const setData = createAction('[Data] Set', props<{ data: string }>());
export const clearData = createAction('[Data] Clear');