import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportItem from './pages/ReportItem';
import ItemDetails from './pages/ItemDetails';
import MyPosts from './pages/MyPosts';
import MyClaims from './pages/MyClaims';
import Profile from './pages/Profile';
import ContactForm from './components/ContactForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ItemForm from './pages/ItemForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Protected Route Component for Users
const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return admin ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/items/:id" element={<ItemDetails />} />
            <Route path="/contact" element={
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Contact Us
                  </h1>
                  <ContactForm />
                </div>
              </div>
            } />
            
            {/* User Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Protected Routes */}
            <Route path="/report" element={
              <UserProtectedRoute>
                <ReportItem />
              </UserProtectedRoute>
            } />
            <Route path="/my-posts" element={
              <UserProtectedRoute>
                <MyPosts />
              </UserProtectedRoute>
            } />
            <Route path="/my-claims" element={
              <UserProtectedRoute>
                <MyClaims />
              </UserProtectedRoute>
            } />
            <Route path="/profile" element={
              <UserProtectedRoute>
                <Profile />
              </UserProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/items/new" element={
              <AdminProtectedRoute>
                <ItemForm />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/items/edit/:id" element={
              <AdminProtectedRoute>
                <ItemForm />
              </AdminProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
