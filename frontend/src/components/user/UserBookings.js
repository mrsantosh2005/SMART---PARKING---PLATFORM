import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { format } from 'date-fns';
import { FaCar, FaMotorcycle, FaCalendarAlt, FaDollarSign, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        toast.success('Booking cancelled successfully');
        loadBookings();
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-4">You haven't made any bookings yet</p>
          <a
            href="/parkings"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Find Parking
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h3 className="text-xl font-semibold mb-2 md:mb-0">
                  {booking.parkingId.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  {booking.vehicleType === 'car' ? (
                    <FaCar className="text-blue-600 mr-2" />
                  ) : (
                    <FaMotorcycle className="text-green-600 mr-2" />
                  )}
                  <span>
                    {booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)} - {booking.vehicleNumber}
                  </span>
                </div>

                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-500 mr-2" />
                  <span>
                    {format(new Date(booking.startTime), 'MMM dd, yyyy h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                  </span>
                </div>

                <div className="flex items-center">
                  <FaDollarSign className="text-yellow-600 mr-2" />
                  <span className="font-semibold">${booking.totalAmount}</span>
                </div>
              </div>

              {booking.status === 'confirmed' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="flex items-center text-red-600 hover:text-red-800"
                  >
                    <FaTimes className="mr-1" />
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;