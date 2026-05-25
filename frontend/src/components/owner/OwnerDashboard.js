import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { bookingService } from '../../services/bookingService';
import { kycService } from '../../services/kycService';
import { FaParking, FaCalendarCheck, FaDollarSign, FaPlus, FaCar, FaMotorcycle, FaEdit, FaQrcode, FaIdCard, FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import QRScanner from './QRScanner';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [kycInfo, setKycInfo] = useState(null);
  const [stats, setStats] = useState({
    totalParkings: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
  });

  useEffect(() => {
    loadParkings();
    loadKYCInfo();
  }, []);

  useEffect(() => {
    if (selectedParking) {
      loadBookings(selectedParking);
    }
  }, [selectedParking]);

  const loadParkings = async () => {
    try {
      setLoading(true);
      const data = await parkingService.getMyParkings();
      setParkings(data.data);
      if (data.data.length > 0) {
        setSelectedParking(data.data[0]._id);
      }
      calculateStats(data.data);
    } catch (error) {
      console.error('Load parkings error:', error);
      toast.error('Failed to load parkings');
    } finally {
      setLoading(false);
    }
  };

  const loadKYCInfo = async () => {
    try {
      const response = await kycService.getKYCStatus();
      setKycInfo(response.data);
    } catch (error) {
      console.error('Error loading KYC info:', error);
    }
  };

  const loadBookings = async (parkingId) => {
    try {
      const data = await bookingService.getParkingBookings(parkingId);
      setBookings(data.data);
      
      const totalRevenue = data.data.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const activeBookings = data.data.filter(b => b.status === 'confirmed').length;
      
      setStats(prev => ({
        ...prev,
        totalBookings: data.data.length,
        totalRevenue: totalRevenue,
        activeBookings: activeBookings
      }));
    } catch (error) {
      console.error('Load bookings error:', error);
      toast.error('Failed to load bookings');
    }
  };

  const calculateStats = (parkingsData) => {
    setStats(prev => ({
      ...prev,
      totalParkings: parkingsData.length,
    }));
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await bookingService.completeBooking(bookingId);
      toast.success('Booking completed successfully');
      loadBookings(selectedParking);
      loadParkings();
    } catch (error) {
      console.error('Complete booking error:', error);
      toast.error('Failed to complete booking');
    }
  };

  const handleScanSuccess = (scannedData) => {
    console.log('Scanned booking:', scannedData);
    toast.success(`✅ Verified: ${scannedData.userName || 'Customer'}`);
    
    // Optional: Auto complete booking after scan
    if (scannedData.bookingId) {
      setTimeout(() => {
        // You can auto-complete or just notify
        toast.info(`Customer ${scannedData.userName} verified successfully`);
      }, 1000);
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Owner Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your parking spaces and track bookings</p>
        </div>
        <div className="flex gap-3">
          {/* KYC Verification Button */}
          <Link
            to="/owner/kyc"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <FaIdCard /> Verify KYC
          </Link>

          {/* QR Scanner Toggle Button */}
          <button
            onClick={() => setShowScanner(!showScanner)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              showScanner ? 'bg-purple-700' : 'bg-purple-600'
            } text-white hover:bg-purple-700`}
          >
            <FaQrcode /> {showScanner ? 'Hide Scanner' : 'Scan QR Code'}
          </button>
          
          {/* Add Parking Button */}
          <Link
            to="/owner/add-parking"
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add New Parking
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Parkings</p>
              <p className="text-3xl font-bold">{stats.totalParkings}</p>
            </div>
            <FaParking className="text-4xl text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold">{stats.totalBookings}</p>
            </div>
            <FaCalendarCheck className="text-4xl text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">₹{stats.totalRevenue}</p>
            </div>
            <FaDollarSign className="text-4xl text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Active Bookings</p>
              <p className="text-3xl font-bold">{stats.activeBookings}</p>
            </div>
            <FaCalendarCheck className="text-4xl text-white/50" />
          </div>
        </div>
      </div>

      {/* KYC Status Card */}
      {kycInfo && !kycInfo.isVerified && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-yellow-400 text-xl mr-3" />
            <div>
              <p className="text-sm text-yellow-700 font-medium">
                ⚠️ Your KYC is not verified yet!
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Your parking spaces will NOT be visible to users until KYC is approved.
              </p>
              <Link to="/owner/kyc" className="text-sm font-medium text-yellow-700 underline mt-1 inline-block">
                Complete KYC Verification →
              </Link>
            </div>
          </div>
        </div>
      )}

      {kycInfo?.isVerified && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-400 text-xl mr-3" />
            <div>
              <p className="text-sm text-green-700 font-medium">
                ✅ KYC Verified! Your parking spaces are visible to users.
              </p>
              <p className="text-xs text-green-600 mt-1">
                Verified Badge: {kycInfo.verifiedBadge?.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Section */}
      {showScanner && (
        <div className="mb-8">
          <QRScanner 
            onScanSuccess={handleScanSuccess}
            onScanError={(err) => {
              console.error('Scan error:', err);
              toast.error('Failed to scan QR code');
            }}
          />
        </div>
      )}

      {/* Parking Selection & Update Button */}
      {parkings.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Parking Location
              </label>
              <select
                className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedParking}
                onChange={(e) => setSelectedParking(e.target.value)}
              >
                {parkings.map((parking) => (
                  <option key={parking._id} value={parking._id}>
                    {parking.name} - 🚗 Cars: {parking.availableCarSlots}/{parking.totalCarSlots} | 🏍️ Bikes: {parking.availableBikeSlots}/{parking.totalBikeSlots}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Update Button */}
            <Link
              to={`/owner/update-parking/${selectedParking}`}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
            >
              <FaEdit /> Update Selected Parking
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You haven't added any parking locations yet.{' '}
                <Link to="/owner/add-parking" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                  Add your first parking location
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings Table */}
      {selectedParking && parkings.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">📋 Recent Bookings</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all bookings for this parking location
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.userId?.name}</div>
                      <div className="text-sm text-gray-500">{booking.userId?.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {booking.vehicleType === 'car' ? 
                          <FaCar className="text-blue-500" /> : 
                          <FaMotorcycle className="text-green-500" />
                        }
                        <span className="text-sm text-gray-900">{booking.vehicleType} - {booking.vehicleNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.startTime).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.startTime).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{booking.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCompleteBooking(booking._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition text-sm"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No bookings found for this parking location.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;