import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaMotorcycle, FaCalendarAlt, FaDollarSign, FaQrcode, FaClock, FaMapMarkerAlt, FaStar, FaSearch, FaFilter, FaBell, FaUserCircle, FaChartLine, FaWallet, FaGift, FaCrown } from 'react-icons/fa';
import { bookingService } from '../../services/bookingService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showStats, setShowStats] = useState(false);

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

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.startTime) > new Date());
  const pastBookings = bookings.filter(b => b.status === 'completed' || (b.status === 'confirmed' && new Date(b.endTime) < new Date()));
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const stats = {
    totalSpent: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    totalBookings: bookings.length,
    savedAmount: Math.floor(bookings.length * 20),
    rank: bookings.length > 10 ? 'Gold' : bookings.length > 5 ? 'Silver' : 'Bronze',
  };

  const BookingCard = ({ booking, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{booking.parkingId?.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <FaMapMarkerAlt className="text-gray-400 text-xs" />
            <p className="text-gray-400 text-sm">{booking.parkingId?.address}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          {booking.status?.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          {booking.vehicleType === 'car' ? <FaCar className="text-blue-400" /> : <FaMotorcycle className="text-green-400" />}
          <span className="text-gray-300 text-sm">{booking.vehicleNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-purple-400" />
          <span className="text-gray-300 text-sm">{format(new Date(booking.startTime), 'MMM dd')}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-orange-400" />
          <span className="text-gray-300 text-sm">{format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaDollarSign className="text-yellow-400" />
          <span className="text-gray-300 text-sm font-medium">₹{booking.totalAmount}</span>
        </div>
      </div>

      {booking.status === 'confirmed' && new Date(booking.startTime) > new Date() && (
        <div className="flex gap-3 mt-3">
          <button className="flex-1 px-4 py-2 bg-blue-600 rounded-xl text-white text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <FaQrcode /> Show QR
          </button>
          <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 transition">
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-3xl p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-black/20 rounded-b-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back, User!</h1>
              <p className="text-blue-100 mt-1">Find and manage your parking spots</p>
            </div>
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.05 }} className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <FaBell className="text-white" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <FaUserCircle className="text-white text-xl" />
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <motion.div whileHover={{ y: -5 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-blue-200 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-white">₹{stats.totalSpent}</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-blue-200 text-sm">Bookings</p>
              <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-blue-200 text-sm">Saved</p>
              <p className="text-2xl font-bold text-white">₹{stats.savedAmount}</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-blue-200 text-sm">Rank</p>
              <p className="text-2xl font-bold text-white flex items-center gap-1">{stats.rank} {stats.rank === 'Gold' && <FaCrown className="text-yellow-400 text-sm" />}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-6 md:p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1 w-fit">
          {['upcoming', 'past', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'upcoming' && upcomingBookings.length > 0 && `(${upcomingBookings.length})`}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {activeTab === 'upcoming' && upcomingBookings.map((booking, idx) => <BookingCard key={booking._id} booking={booking} index={idx} />)}
            {activeTab === 'past' && pastBookings.map((booking, idx) => <BookingCard key={booking._id} booking={booking} index={idx} />)}
            {activeTab === 'cancelled' && cancelledBookings.map((booking, idx) => <BookingCard key={booking._id} booking={booking} index={idx} />)}

            {activeTab === 'upcoming' && upcomingBookings.length === 0 && (
              <div className="text-center py-12 bg-white/5 rounded-2xl">
                <FaCalendarAlt className="text-6xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No upcoming bookings</p>
                <Link to="/parkings" className="mt-4 inline-block px-6 py-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition">Find Parking</Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserDashboard;