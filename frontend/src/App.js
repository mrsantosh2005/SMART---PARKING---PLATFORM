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
import UpdateParking from './components/owner/UpdateParking';
import LandingPage from './pages/LandingPage';  // ✅ Added LandingPage import

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role === 'owner') {
    return <Navigate to="/owner/dashboard" replace />;
  } else {
    return <Navigate to="/user/bookings" replace />;
  }
};

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
    return <Navigate to="/home" replace />;  // ✅ Changed from "/" to "/home"
  }

  return children;
};

// Main App Content
const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Show Navbar only on protected pages (not on landing page) */}
      {user && location.pathname !== '/' && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* ✅ LANDING PAGE - First screen users see */}
          <Route path="/" element={<LandingPage />} />
          
          {/* ✅ HOME PAGE - After login (Protected) */}
          <Route path="/home" element={<ProtectedRoute><ParkingList /></ProtectedRoute>} />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<PublicRoute><LoginCSS /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/parkings" element={<ProtectedRoute><ParkingList /></ProtectedRoute>} />
          <Route path="/parking/:id" element={<ProtectedRoute><ParkingDetail /></ProtectedRoute>} />
          
          {/* Dashboard Route */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
          
          {/* User Routes */}
          <Route path="/user/bookings" element={<ProtectedRoute allowedRoles={['user']}><UserBookings /></ProtectedRoute>} />

          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/add-parking" element={<ProtectedRoute allowedRoles={['owner']}><AddParking /></ProtectedRoute>} />
          <Route 
            path="/owner/update-parking/:id" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <UpdateParking />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          
          {/* Catch all - 404 redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
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
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;