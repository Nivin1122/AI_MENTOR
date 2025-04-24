import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/users';

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, thunkAPI) => {
  const res = await axios.post(`${API_URL}/register/`, userData);
  return res.data;
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, thunkAPI) => {
  const res = await axios.post(`${API_URL}/login/`, userData);
  localStorage.setItem('accessToken', res.data.access);
  localStorage.setItem('refreshToken', res.data.refresh);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Login failed';
      })
      .addCase(registerUser.rejected, (state) => {
        state.error = 'Registration failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;