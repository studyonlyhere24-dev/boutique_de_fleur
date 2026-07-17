import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

// ─── AJOUTER UN ARTICLE AU PANIER ───
    addItem: (state, action) => {
      const newItem = action.payload;
      
      const existingItem = state.items.find(item => item._id === newItem._id);

      if (existingItem) {
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity += 1;
        }
      } else {
        if (newItem.stock > 0) {
          state.items.push({
            ...newItem,
            quantity: 1
          });
        }
      }
    },

    // ─── RETIRER OU DIMINUER UN ARTICLE ───
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item._id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item._id !== id);
        } else {
          existingItem.quantity -= 1;
        }
      }
    },

    // ─── SUPPRIMER COMPLÈTEMENT UNE LIGNE ───
    deleteItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item._id !== id);
    },

    // ─── VIDER LE PANIER EN ENTIER  ───
    clearCart: (state) => {
      state.items = [];
    }
  },
});

export const { addItem, removeItem, deleteItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;