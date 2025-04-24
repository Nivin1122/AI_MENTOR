import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { fetchCourses } from '../../../api/api';

// Async thunk for adding a new course
export const addCourse = createAsyncThunk(
  'courses/addCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminAccess');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };
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

// ✅ New: Async thunk to fetch all courses
export const fetchAllCourses = createAsyncThunk(
  'courses/fetchAllCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCourses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch courses' });
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
      // Add Course
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
      })

      // ✅ Fetch All Courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch courses';
      });
  },
});

export const { clearMessages } = courseSlice.actions;
export default courseSlice.reducer;
