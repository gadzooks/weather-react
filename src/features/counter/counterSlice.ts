import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => ({
      ...state,
      count: state.count + 1,
    }),
    decrement: (state) => ({
      ...state,
      count: state.count - 1,
    }),
    reset: (state) => ({
      ...state,
      count: 0,
    }),
    decrementBy: (state, action: PayloadAction<number>) => ({
      ...state,
      count: state.count - action.payload,
    }),
  },
});

export const { increment, decrement, decrementBy, reset } =
  counterSlice.actions;

export default counterSlice.reducer;
