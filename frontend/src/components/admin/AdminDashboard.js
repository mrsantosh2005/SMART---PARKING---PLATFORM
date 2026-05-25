import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { 
  FaUsers, 
  FaUserTie, 
  FaParking, 
  FaCalendarCheck, 
  FaDollarSign, 
  FaCheck, 
  FaIdCard, 
  FaShieldAlt,
  FaUserCheck,
  FaClock,
  FaMoneyBillWave
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, pendingData] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingOwners(),
      ]);
      setStats(statsData.data);
      setPendingOwners(pendingData.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOwner = async (ownerId) => {
    try {
      await adminService.approveOwner(ownerId);
      toast.success('Owner approved successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to approve owner');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage platform, users, and KYC verification</p>

      {/* ========== ADMIN NAVIGATION CARDS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* ✅ KYC Verification Card */}
        <Link 
          to="/admin/kyc"
          className="group bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <FaIdCard className="text-2xl" />
            </div>
            <span className="text-purple-200 text-sm">Admin Only</span>
          </div>
          <h3 className="text-xl font-bold mb-1">KYC Verification</h3>
          <p className="text-purple-100 text-sm mb-3">Verify owner documents</p>
          <div className="flex items-center gap-1 text-purple-200 text-sm">
            <span>Review & Approve</span>
            <span>→</span>
          </div>
        </Link>

        {/* User Management Card */}
        <Link 
          to="/admin/users"
          className="group bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <FaUsers className="text-2xl" />
            </div>
            <span className="text-blue-200 text-sm">Total: {stats?.totalUsers || 0}</span>
          </div>
          <h3 className="text-xl font-bold mb-1">User Management</h3>
          <p className="text-blue-100 text-sm mb-3">View all users</p>
          <div className="flex items-center gap-1 text-blue-200 text-sm">
            <span>Manage Users</span>
            <span>→</span>
          </div>
        </Link>

        {/* Parking Management Card */}
        <Link 
          to="/admin/parkings"
          className="group bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <FaParking className="text-2xl" />
            </div>
            <span className="text-green-200 text-sm">Total: {stats?.totalParkings || 0}</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Parking Management</h3>
          <p className="text-green-100 text-sm mb-3">View all parkings</p>
          <div className="flex items-center gap-1 text-green-200 text-sm">
            <span>View Locations</span>
            <span>→</span>
          </div>
        </Link>

        {/* Bookings Card */}
        <Link 
          to="/admin/bookings"
          className="group bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <FaCalendarCheck className="text-2xl" />
            </div>
            <span className="text-orange-200 text-sm">Total: {stats?.totalBookings || 0}</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Bookings</h3>
          <p className="text-orange-100 text-sm mb-3">View all bookings</p>
          <div className="flex items-center gap-1 text-orange-200 text-sm">
            <span>View History</span>
            <span>→</span>
          </div>
        </Link>
      </div>

      {/* ========== STATISTICS CARDS ========== */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue || 0}</p>
              </div>
              <FaMoneyBillWave className="text-3xl text-green-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{stats.activeBookings || 0}</p>
              </div>
              <FaCalendarCheck className="text-3xl text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completedBookings || 0}</p>
              </div>
              <FaCheck className="text-3xl text-green-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Owners</p>
                <p className="text-2xl font-bold text-gray-800">{pendingOwners.length}</p>
              </div>
              <FaUserTie className="text-3xl text-yellow-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* ========== PENDING OWNER APPROVALS (REGULAR) ========== */}
      {pendingOwners.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center gap-2">
              <FaClock className="text-yellow-600" />
              <h2 className="text-xl font-semibold text-yellow-800">
                Pending Owner Approvals ({pendingOwners.length})
              </h2>
            </div>
            <p className="text-sm text-yellow-600 mt-1">New owners waiting for approval</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingOwners.map((owner) => (
                  <tr key={owner._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{owner.name}</div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{owner.email}</div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{owner.phone}</div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(owner.createdAt).toLocaleDateString()}
                      </div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleApproveOwner(owner._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      >
                        <FaCheck /> Approve
                      </button>
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;