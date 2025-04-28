import { createSlice } from '@reduxjs/toolkit';

const ADMIN_TOKEN_KEY = 'adminAccess';
const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    token: adminToken || null,
    isAuthenticated: !!adminToken,
  },
  reducers: {
    setAdminToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem(ADMIN_TOKEN_KEY, action.payload);
    },
    logoutAdmin: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    },
  },
});

export const { setAdminToken, logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;