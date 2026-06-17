import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) existing.qty += 1;
      else state.items.push({ ...action.payload, qty: 1 });
    },
    // NEW: Reducer to update quantity
    updateQty(state, action) {
      const { _id, qty } = action.payload;
      const item = state.items.find((i) => i._id === _id);
      if (item) {
        item.qty = qty;
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    clearCart(state) { state.items = []; },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQty } = cartSlice.actions;
export default cartSlice.reducer;