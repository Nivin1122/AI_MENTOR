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


function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
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

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin-dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/add-course"
            element={
              <ProtectedAdminRoute>
               <AdminCourseForm />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
