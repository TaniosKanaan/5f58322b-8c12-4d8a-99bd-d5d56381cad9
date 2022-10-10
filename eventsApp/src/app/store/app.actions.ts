import { createAction, props } from "@ngrx/store";
import { Event } from "../models/event";


export const addItemToBasket = createAction(
  '[Basket] Add Item', props<Event>()
);

export const removeItemFromBasket = createAction(
  '[Basket] Remove Item', props<Event>()
)

