import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import LoginCSS from './components/auth/LoginCSS';
import Register from './components/auth/Register';
import ParkingList from './components/user/ParkingList';
import ParkingDetail from './components/user/ParkingDetail';
import UserBookings from './components/user/UserBookings';
import OwnerDashboard from './components/owner/OwnerDashboard';
import AddParking from './components/owner/AddParking';
import AdminDashboard from './components/admin/AdminDashboard';

// Page Transition Animation
const pageVariants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 }
};

const pageTransition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96]
};

const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <AnimatedPage>{children}</AnimatedPage>;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <AnimatedPage>{children}</AnimatedPage>;
};

// Main App Content
const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen gradient-bg">
      {user && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={
            <PublicRoute><LoginCSS /></PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute><Register /></PublicRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute><ParkingList /></ProtectedRoute>
          } />
          
          <Route path="/parkings" element={
            <ProtectedRoute><ParkingList /></ProtectedRoute>
          } />
          
          <Route path="/parking/:id" element={
            <ProtectedRoute><ParkingDetail /></ProtectedRoute>
          } />

          <Route path="/user/bookings" element={
            <ProtectedRoute allowedRoles={['user']}><UserBookings /></ProtectedRoute>
          } />

          <Route path="/owner/dashboard" element={
            <ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>
          } />
          
          <Route path="/owner/add-parking" element={
            <ProtectedRoute allowedRoles={['owner']}><AddParking /></ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

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