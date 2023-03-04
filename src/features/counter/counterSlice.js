import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count: 0,
};

/* eslint-disable no-param-reassign */
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    decrementBy: (state, amount) => {
      state.count -= amount;
    },
  },
});

export const { increment, decrement, decrementBy } = counterSlice.actions;

export default counterSlice.reducer;
