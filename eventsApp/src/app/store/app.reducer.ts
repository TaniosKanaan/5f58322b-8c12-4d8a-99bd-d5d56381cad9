import { Action, createReducer, on } from '@ngrx/store';
import { Event } from '../models/event';
import * as AppActions from './app.actions';
export interface AppState {
  basket: Event[];
}

const initialState: AppState = {
  basket: []
}

const appReducer = createReducer(
  initialState,
  on(AppActions.addItemToBasket, (state, event) => ({ ...state, basket: [event, ...state.basket] })),
  on(AppActions.removeItemFromBasket, (state, event) => {
    return { ...state, basket: state.basket.filter((item: Event) => item._id !== event._id) }
  })
);

export function reducer(state: AppState = initialState, action: Action) {
  console.log('state', state);
  console.log('action', action);
  return appReducer(state, action);
}
