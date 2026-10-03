import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const saveCartToStorage = (items) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartItemsFromStorage,
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.product === newItem.product);
      if (existingItem) {
        existingItem.qty = Math.min(existingItem.qty + newItem.qty, existingItem.stock);
      } else {
        state.items.push(newItem);
      }
      saveCartToStorage(state.items);
    },
    updateCartQty: (state, action) => {
      const { product, qty } = action.payload;
      const item = state.items.find((item) => item.product === product);
      if (item) {
        item.qty = qty;
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.product !== action.payload);
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, updateCartQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
