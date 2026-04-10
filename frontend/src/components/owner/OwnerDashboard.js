import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { bookingService } from '../../services/bookingService';
import { FaParking, FaCalendarCheck, FaDollarSign, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalParkings: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
  });

  useEffect(() => {
    loadParkings();
  }, []);

  useEffect(() => {
    if (selectedParking) {
      loadBookings(selectedParking);
    }
  }, [selectedParking]);

  const loadParkings = async () => {
    try {
      const data = await parkingService.getMyParkings();
      setParkings(data.data);
      if (data.data.length > 0) {
        setSelectedParking(data.data[0]._id);
      }
      calculateStats(data.data);
    } catch (error) {
      toast.error('Failed to load parkings');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (parkingId) => {
    try {
      const data = await bookingService.getParkingBookings(parkingId);
      setBookings(data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    }
  };

  const calculateStats = (parkingsData) => {
    // This would normally come from an API
    setStats({
      totalParkings: parkingsData.length,
      totalBookings: 45, // Mock data
      totalRevenue: 1250, // Mock data
      activeBookings: 12, // Mock data
    });
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await bookingService.completeBooking(bookingId);
      toast.success('Booking completed successfully');
      loadBookings(selectedParking);
    } catch (error) {
      toast.error('Failed to complete booking');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <Link
          to="/owner/add-parking"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Add New Parking
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Parkings</p>
              <p className="text-3xl font-bold">{stats.totalParkings}</p>
            </div>
            <FaParking className="text-4xl text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold">{stats.totalBookings}</p>
            </div>
            <FaCalendarCheck className="text-4xl text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">${stats.totalRevenue}</p>
            </div>
            <FaDollarSign className="text-4xl text-yellow-600 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Bookings</p>
              <p className="text-3xl font-bold">{stats.activeBookings}</p>
            </div>
            <FaCalendarCheck className="text-4xl text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Parking Selection */}
      {parkings.length > 0 ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Parking
          </label>
          <select
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedParking}
            onChange={(e) => setSelectedParking(e.target.value)}
          >
            {parkings.map((parking) => (
              <option key={parking._id} value={parking._id}>
                {parking.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
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

      {/* Bookings Table */}
      {selectedParking && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.userId.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.userId.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.vehicleType} - {booking.vehicleNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.startTime).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.startTime).toLocaleTimeString()} -{' '}
                        {new Date(booking.endTime).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${booking.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCompleteBooking(booking._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete
                        </button>
                      )}
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

export default OwnerDashboard;