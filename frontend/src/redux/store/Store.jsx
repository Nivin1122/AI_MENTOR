import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../redux/slices/auth/AuthSlice'
import adminAuthReducer from '../../redux/slices/auth/AdminAuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
  },
});