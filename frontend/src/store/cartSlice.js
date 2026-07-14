import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Contiendra les objets { _id, name, price, imageUrl, quantity, description }
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
/*     // ─── AJOUTER UN ARTICLE AU PANIER ───
    addItem: (state, action) => {
      const newItem = action.payload;
      
      // On cherche si l'article existe déjà dans le panier grâce à son _id (Modèle MongoDB)
      const existingItem = state.items.find(item => item._id === newItem._id);

      if (existingItem) {
        // Liaison API : Remplacement de quantite par quantity
        existingItem.quantity += 1;
      } else {
        // Si c'est un nouvel article, on l'ajoute avec une quantity initiale de 1
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1
        });
      }
    }, */

// ─── AJOUTER UN ARTICLE AU PANIER ───
    addItem: (state, action) => {
      const newItem = action.payload;
      
      const existingItem = state.items.find(item => item._id === newItem._id);

      if (existingItem) {
        // On vérifie que la quantité dans le panier est strictement inférieure au stock disponible
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity += 1;
        }
      } else {
        // Si c'est un nouvel article et qu'il y a du stock
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
          // S'il n'en reste qu'un, on supprime carrément la ligne
          state.items = state.items.filter(item => item._id !== id);
        } else {
          // Sinon, on diminue la quantity de 1
          existingItem.quantity -= 1;
        }
      }
    },

    // ─── SUPPRIMER COMPLÈTEMENT UNE LIGNE (Bouton Poubelle) ───
    deleteItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item._id !== id);
    },

    // ─── VIDER LE PANIER EN ENTIER (Après une commande réussie) ───
    clearCart: (state) => {
      state.items = [];
    }
  },
});

// Export des actions pour tes composants (Catalog, SidebarCart, etc.)
export const { addItem, removeItem, deleteItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;