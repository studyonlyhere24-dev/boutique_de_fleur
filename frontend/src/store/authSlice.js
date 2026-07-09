import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,       // Contiendra les infos du client (ex: { email: '...' })
  token: null,      // Le token JWT envoyé par le backend de ton amie
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action appelée quand le backend valide les identifiants
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    // Action appelée pour déconnecter l'utilisateur
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;