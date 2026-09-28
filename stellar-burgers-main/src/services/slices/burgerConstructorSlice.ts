import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TConstructorIngredient {
  _id: string;
  id: string;
  name: string;
  type: string;
  price: number;
  [key: string]: any;
}

interface IBurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: any | null;
}

const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      const item = state.ingredients.splice(from, 1)[0];
      state.ingredients.splice(to, 0, item);
    },
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderModalData = null;
      state.orderRequest = false;
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<any>) => {
      state.orderModalData = action.payload;
    },
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun,
  resetConstructor,
  setOrderRequest,
  setOrderModalData,
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;