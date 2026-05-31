import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaParking, FaCalendarCheck, FaDollarSign, FaPlus, 
  FaCar, FaMotorcycle, FaEdit, FaQrcode, 
  FaUsers, FaSpinner, FaIdCard, FaExclamationTriangle, 
  FaCheckCircle, FaSync, FaEye, FaTrash
} from 'react-icons/fa';
import { parkingService } from '../../services/parkingService';
import { bookingService } from '../../services/bookingService';
import { kycService } from '../../services/kycService';
import QRScanner from './QRScanner';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [kycInfo, setKycInfo] = useState(null);

  useEffect(() => {
    loadData();
    loadKYCInfo();
  }, []);

  useEffect(() => {
    if (selectedParking) {
      loadBookings(selectedParking);
    }
  }, [selectedParking]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await parkingService.getMyParkings();
      console.log('Loaded parkings:', data.data);
      setParkings(data.data);
      if (data.data.length > 0 && !selectedParking) {
        setSelectedParking(data.data[0]._id);
      }
    } catch (error) {
      console.error('Load parkings error:', error);
      toast.error('Failed to load parkings');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (parkingId) => {
    try {
      console.log('Loading bookings for parking:', parkingId);
      const data = await bookingService.getParkingBookings(parkingId);
      console.log('Bookings response:', data);
      setBookings(data.data || []);
      if (data.data.length === 0) {
        console.log('No bookings found for this parking');
      }
    } catch (error) {
      console.error('Load bookings error:', error);
      toast.error('Failed to load bookings');
      setBookings([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings(selectedParking);
    await loadData();
    setRefreshing(false);
    toast.success('Dashboard refreshed!');
  };

  const loadKYCInfo = async () => {
    try {
      const response = await kycService.getKYCStatus();
      setKycInfo(response.data);
    } catch (error) {
      console.error('Error loading KYC:', error);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await bookingService.completeBooking(bookingId);
      toast.success('Booking completed successfully');
      await loadBookings(selectedParking);
      await loadData();
    } catch (error) {
      console.error('Complete booking error:', error);
      toast.error('Failed to complete booking');
    }
  };

  const stats = {
    totalParkings: parkings.length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    activeBookings: bookings.filter(b => b.status === 'confirmed').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Owner Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your parking spaces and track earnings</p>
          </div>
          <div className="flex gap-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition"
            >
              <FaSync className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
            <Link to="/owner/kyc" className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-xl text-white hover:bg-purple-700 transition">
              <FaIdCard /> KYC
            </Link>
            <button
              onClick={() => setShowScanner(!showScanner)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${showScanner ? 'bg-purple-700' : 'bg-purple-600'} text-white`}
            >
              <FaQrcode /> {showScanner ? 'Hide Scanner' : 'Scan QR'}
            </button>
            <Link to="/owner/add-parking" className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-xl text-white hover:bg-green-700 transition">
              <FaPlus /> Add Parking
            </Link>
          </div>
        </div>

        {/* KYC Status Card */}
        {kycInfo && !kycInfo.isVerified && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-yellow-400 text-2xl" />
                <div>
                  <p className="text-yellow-400 font-semibold">⚠️ KYC Verification Pending!</p>
                  <p className="text-yellow-400/70 text-sm">Your parking spaces will NOT be visible to users until KYC is approved.</p>
                </div>
              </div>
              <Link to="/owner/kyc" className="px-4 py-2 bg-yellow-600 rounded-xl text-white hover:bg-yellow-700 transition">
                Complete KYC Now
              </Link>
            </div>
          </div>
        )}

        {kycInfo?.isVerified && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-400 text-2xl" />
              <div>
                <p className="text-green-400 font-semibold">✅ KYC Verified!</p>
                <p className="text-green-400/70 text-sm">Badge: {kycInfo.verifiedBadge}</p>
              </div>
            </div>
          </div>
        )}

        {/* QR Scanner */}
        {showScanner && (
          <div className="mb-8">
            <QRScanner onScanSuccess={(data) => toast.success(`Verified: ${data.userName}`)} />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div><p className="text-white/70 text-sm">Total Parkings</p><p className="text-3xl font-bold text-white">{stats.totalParkings}</p></div>
              <FaParking className="text-4xl text-white/50" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div><p className="text-white/70 text-sm">Total Bookings</p><p className="text-3xl font-bold text-white">{stats.totalBookings}</p></div>
              <FaCalendarCheck className="text-4xl text-white/50" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div><p className="text-white/70 text-sm">Total Revenue</p><p className="text-3xl font-bold text-white">₹{stats.totalRevenue}</p></div>
              <FaDollarSign className="text-4xl text-white/50" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div><p className="text-white/70 text-sm">Active Bookings</p><p className="text-3xl font-bold text-white">{stats.activeBookings}</p></div>
              <FaUsers className="text-4xl text-white/50" />
            </div>
          </div>
        </div>

        {/* Parking Selection */}
        {parkings.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-gray-400 text-sm mb-2">Select Parking Location</label>
                <select
                  className="w-full md:w-96 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                  value={selectedParking}
                  onChange={(e) => setSelectedParking(e.target.value)}
                >
                  {parkings.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} - Cars: {p.availableCarSlots}/{p.totalCarSlots} | Bikes: {p.availableBikeSlots}/{p.totalBikeSlots}
                    </option>
                  ))}
                </select>
              </div>
              <Link to={`/owner/update-parking/${selectedParking}`} className="px-6 py-3 bg-yellow-600 rounded-xl text-white hover:bg-yellow-700 transition flex items-center gap-2">
                <FaEdit /> Update
              </Link>
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaSync /> Refresh Bookings
              </button>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        {selectedParking && parkings.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden">
            <div className="px-6 py-4 bg-white/5 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
              <p className="text-gray-400 text-sm">Total: {bookings.length} bookings found</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm">User</th>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm">Vehicle</th>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm">Time</th>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm">Amount</th>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm">Status</th>
                    <th className="px-6 py-3 text-left text-gray-400 text-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <FaCalendarCheck className="text-4xl text-gray-600" />
                          <p>No bookings found for this parking location</p>
                          <p className="text-sm text-gray-600">Try refreshing or check back later</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{booking.userId?.name || 'N/A'}</div>
                          <div className="text-gray-400 text-sm">{booking.userId?.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {booking.vehicleType === 'car' ? <FaCar className="text-blue-400" /> : <FaMotorcycle className="text-green-400" />}
                            <span className="text-white">{booking.vehicleNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white text-sm">{new Date(booking.startTime).toLocaleDateString()}</div>
                          <div className="text-gray-400 text-xs">{new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-400 font-semibold">₹{booking.totalAmount || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            booking.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleCompleteBooking(booking._id)}
                              className="px-3 py-1 bg-green-600 rounded-lg text-white text-sm hover:bg-green-700 transition"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {parkings.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-2xl">
            <FaParking className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No parking locations added yet</p>
            <Link to="/owner/add-parking" className="px-6 py-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition">
              Add Your First Parking
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;