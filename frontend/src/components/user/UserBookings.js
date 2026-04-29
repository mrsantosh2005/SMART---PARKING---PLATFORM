import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { format } from 'date-fns';
import { FaCar, FaMotorcycle, FaCalendarAlt, FaDollarSign, FaTimes, FaParking } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Free stock images (Unsplash - Parking related)
const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1470224114660-3f6686c56285?w=1600', // Parking lot
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1600', // Car parking  
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1600', // Multi-level
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1600', // Parking garage
  'https://images.unsplash.com/photo-1528597469186-bddab681a37f?w=1600', // City parking
];

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    loadBookings();
    // Change background every 15 seconds
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 15000);
    return () => clearInterval(interval);
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
    if (window.confirm('Are you sure you want to cancel?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        toast.success('Booking cancelled');
        loadBookings();
      } catch (error) {
        toast.error('Failed to cancel');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div 
      className="min-h-screen py-8 px-4 transition-all duration-1000"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${BACKGROUND_IMAGES[bgIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                My Parking Bookings
              </h1>
              <p className="text-gray-500 mt-1">View and manage your parking reservations</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaParking className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 text-center">
            <FaParking className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No bookings yet</p>
            <a href="/parkings" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Find Parking
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <h3 className="text-xl font-semibold">{booking.parkingId?.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      {booking.vehicleType === 'car' ? 
                        <FaCar className="text-blue-600" /> : 
                        <FaMotorcycle className="text-green-600" />
                      }
                      <span>{booking.vehicleType} - {booking.vehicleNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-500" />
                      <span>
                        {format(new Date(booking.startTime), 'MMM dd, h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-yellow-600" />
                      <span className="font-bold text-lg">${booking.totalAmount}</span>
                    </div>
                  </div>

                  {booking.status === 'confirmed' && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                      >
                        <FaTimes /> Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Background Image Credit */}
        <div className="text-center mt-6 text-white/50 text-xs">
          Background images from Unsplash
        </div>
      </div>
    </div>
  );
};

export default UserBookings;