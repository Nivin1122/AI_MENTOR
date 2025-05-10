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
import AdminCourseForm from "./pages/admin/course/course/AdminCourseForm";
import ProtectedAdminRoute from "./routes/courses/ProtectedAdminRoute";
import Navbar from "./components/navbar/Navbar";
import AdminLayout from "./components/admin/AdminLayout";
import CourseDetails from "./pages/users/courses/CourseDetails";
import UserList from "./pages/admin/users/UsersList";
import AddCategory from "./pages/admin/course/category/AddCategory";
import StartClass from "./pages/users/courses/StartClass";
import AddSyllabus from "./pages/admin/course/syllabus/AddSyllabus";
import ListSyllabus from "./pages/admin/course/syllabus/ListSyllabus";
import SyllabusPage from "./pages/users/courses/SyllabusPage";
import All_Course from "./pages/admin/course/course/All_Course";


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
          
          <Route path="/course/:courseId/syllabus" element={<SyllabusPage />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
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
          
            <Route 
              index 
              element={<Navigate to="/admin/dashboard" replace />} 
            />
            
            <Route 
              path="dashboard" 
              element={<AdminDashboard />} 
            />
           
            <Route path="courses">
              <Route index element={<div>All Courses (placeholder)</div>} />
              <Route path="add" element={<AdminCourseForm />} />
              <Route path="categories" element={<div>Categories (placeholder)</div>} />
              <Route path="add_syllabus" element={<AddSyllabus />}/>
              <Route path="list_syllabus" element={<ListSyllabus />}/>
              <Route path="all_courses" element={<All_Course />}/>
            </Route>

            <Route path="category">
              <Route path="create" element={<AddCategory />} />
            </Route>

            <Route path="users">
              <Route index element={<UserList />} />
            </Route>
            
            <Route path="sales" element={<div>Sales (placeholder)</div>} />
            <Route path="analytics" element={<div>Analytics (placeholder)</div>} />
            <Route path="messages" element={<div>Messages (placeholder)</div>} />
            <Route path="settings" element={<div>Settings (placeholder)</div>} />
          </Route>

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
