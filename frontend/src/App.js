import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import Navbar from './components/common/Navbar';
import LoginCSS from './components/auth/LoginCSS';
import Register from './components/auth/Register';
import ParkingList from './components/user/ParkingList';
import ParkingDetail from './components/user/ParkingDetail';
import UserBookings from './components/user/UserBookings';
import OwnerDashboard from './components/owner/OwnerDashboard';
import AddParking from './components/owner/AddParking';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        
        {/* Main App Content */}
        <Routes>
          {/* Public Routes - Login ke liye */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginCSS />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Protected Routes - Login ke baad hi dikhenge */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ParkingList />
                </>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/parkings" 
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ParkingList />
                </>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/parking/:id" 
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ParkingDetail />
                </>
              </ProtectedRoute>
            } 
          />

          {/* User Routes */}
          <Route 
            path="/user/bookings" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <>
                  <Navbar />
                  <UserBookings />
                </>
              </ProtectedRoute>
            } 
          />

          {/* Owner Routes */}
          <Route 
            path="/owner/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <>
                  <Navbar />
                  <OwnerDashboard />
                </>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/owner/add-parking" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <>
                  <Navbar />
                  <AddParking />
                </>
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <>
                  <Navbar />
                  <AdminDashboard />
                </>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;