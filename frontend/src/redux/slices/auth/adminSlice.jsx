// adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const adminLogin = createAsyncThunk(
  'admin/login',
  async (adminData, thunkAPI) => {
    const response = await axios.post('http://localhost:8000/admin-panel/admin-login/', adminData);
    const tokens = response.data;

    localStorage.setItem('adminToken', tokens.access); // ✅ Store token
    return tokens;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    token: localStorage.getItem('adminToken') || null,
  },
  reducers: {
    adminLogout: (state) => {
      localStorage.removeItem('adminToken');
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(adminLogin.fulfilled, (state, action) => {
      state.token = action.payload.access;
    });
  },
});

export const { adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
