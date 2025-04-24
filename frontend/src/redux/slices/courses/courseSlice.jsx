// courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/api';

// Async thunk for adding a new course
export const addCourse = createAsyncThunk(
  'courses/addCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      // Get token directly from localStorage as a fallback
      const token = localStorage.getItem('adminAccess');
      
      // Set authorization header directly if needed
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Use the api instance that has auth interceptors
      const response = await api.post('/courses/add/', courseData, config);
      return response.data;
    } catch (error) {
      console.error('Error adding course:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to add course' }
      );
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
        state.successMessage = 'Course added successfully!';
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add course';
      });
  },
});

export const { clearMessages } = courseSlice.actions;
export default courseSlice.reducer;