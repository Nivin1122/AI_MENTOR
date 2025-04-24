import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../redux/slices/auth/AuthSlice'
import adminAuthReducer from '../../redux/slices/auth/AdminAuthSlice';
import courseReducer from '../slices/courses/courseSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
    courses: courseReducer,
  },
});