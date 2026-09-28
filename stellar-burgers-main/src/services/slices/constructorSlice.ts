import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Простой интерфейс, чтобы TypeScript не ругался
export interface TConstructorIngredient {
  _id: string;
  id: string;
  name: string;
  type: string;
  price: number;
  [key: string]: any; // Разрешаем любые другие поля
}

interface IConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: any | null;
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
};

console.log('✅ constructorSlice загружен. initialState:', initialState);

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      console.log('🔥 Добавляем ингредиент:', action.payload);
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
      console.log('🔥 Устанавливаем булку:', action.payload);
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
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;