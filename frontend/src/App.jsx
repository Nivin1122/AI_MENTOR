import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/users/Login";
import Register from "./pages/auth/users/Register";
import AdminLogin from "./pages/auth/admin/AdminLogin";
import AdminDashboard from "./pages/auth/admin/AdminDashboard";
import HomePage from "./pages/auth/users/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminCourseForm from "./pages/admin/course/AdminCourseForm";
import ProtectedAdminRoute from "./routes/courses/ProtectedAdminRoute";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/home/Hero";
import AdminLayout from "./components/admin/AdminLayout";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* User routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/hero" element={<Hero />} />

          {/* Admin login (outside admin layout) */}
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Admin routes with sidebar layout */}
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            {/* Dashboard as index route */}
            <Route 
              index 
              element={<Navigate to="/admin/dashboard" replace />} 
            />
            
            <Route 
              path="dashboard" 
              element={<AdminDashboard />} 
            />
            
            {/* Courses section */}
            <Route path="courses">
              <Route index element={<div>All Courses (placeholder)</div>} />
              <Route path="add" element={<AdminCourseForm />} />
              <Route path="categories" element={<div>Categories (placeholder)</div>} />
            </Route>
            
            {/* Other admin routes */}
            <Route path="users" element={<div>Users Management (placeholder)</div>} />
            <Route path="sales" element={<div>Sales (placeholder)</div>} />
            <Route path="analytics" element={<div>Analytics (placeholder)</div>} />
            <Route path="messages" element={<div>Messages (placeholder)</div>} />
            <Route path="settings" element={<div>Settings (placeholder)</div>} />
          </Route>

          {/* Legacy admin routes - redirect to new structure */}
          <Route 
            path="/admin-dashboard" 
            element={<Navigate to="/admin/dashboard" replace />} 
          />
          <Route 
            path="/admin/add-course" 
            element={<Navigate to="/admin/courses/add" replace />} 
          />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
