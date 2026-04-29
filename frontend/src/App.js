import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ParkingList from './components/user/ParkingList';
import LoginCSS from './components/auth/LoginCSS';
import Register from './components/auth/Register';
import ParkingDetail from './components/user/ParkingDetail';
import UserBookings from './components/user/UserBookings';
import OwnerDashboard from './components/owner/OwnerDashboard';
import AddParking from './components/owner/AddParking';
import AdminDashboard from './components/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Content
const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><LoginCSS /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><ParkingList /></ProtectedRoute>} />
          <Route path="/parkings" element={<ProtectedRoute><ParkingList /></ProtectedRoute>} />
          <Route path="/parking/:id" element={<ProtectedRoute><ParkingDetail /></ProtectedRoute>} />
          
          {/* User Routes */}
          <Route path="/user/bookings" element={<ProtectedRoute allowedRoles={['user']}><UserBookings /></ProtectedRoute>} />

          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/add-parking" element={<ProtectedRoute allowedRoles={['owner']}><AddParking /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;