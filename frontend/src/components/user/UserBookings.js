import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { format } from 'date-fns';
import { 
  FaCar, 
  FaMotorcycle, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaTimes, 
  FaCheckCircle, 
  FaClock, 
  FaMapMarkerAlt,
  FaReceipt,
  FaDownload,
  FaStar,
  FaShareAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import toast from 'react-hot-toast';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

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
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-xl p-4 max-w-md">
        <p className="text-gray-800 mb-4">Are you sure you want to cancel this booking?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            No
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await bookingService.cancelBooking(bookingId);
                toast.success('Booking cancelled successfully');
                loadBookings();
              } catch (error) {
                toast.error('Failed to cancel booking');
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    ));
  };

  const handleViewReceipt = (booking) => {
    setSelectedBooking(booking);
    setShowReceipt(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle />;
      case 'pending':
        return <FaClock />;
      case 'completed':
        return <FaCheckCircle />;
      case 'cancelled':
        return <FaTimes />;
      default:
        return null;
    }
  };

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filterStatus);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: index * 0.05,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }),
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: {
      scale: 0.95
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.4, type: "spring" }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex flex-col justify-center items-center h-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          variants={loadingVariants}
          animate="animate"
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <motion.div 
            className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <motion.p 
          className="mt-4 text-gray-600 text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Loading your bookings...
        </motion.p>
      </motion.div>
    );
  }

  // Calculate statistics
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div variants={headerVariants} className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600">Track and manage all your parking reservations</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          variants={statsVariants}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm font-medium">Total Spent</p>
            <FaDollarSign className="text-3xl text-white/50" />
          </div>
          <p className="text-4xl font-bold">
            <CountUp start={0} end={totalSpent} duration={2.5} prefix="$" />
          </p>
        </motion.div>

        <motion.div 
          variants={statsVariants}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm font-medium">Active Bookings</p>
            <FaCheckCircle className="text-3xl text-white/50" />
          </div>
          <p className="text-4xl font-bold">
            <CountUp start={0} end={activeBookings} duration={2.5} />
          </p>
        </motion.div>

        <motion.div 
          variants={statsVariants}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 text-sm font-medium">Completed Bookings</p>
            <FaStar className="text-3xl text-white/50" />
          </div>
          <p className="text-4xl font-bold">
            <CountUp start={0} end={completedBookings} duration={2.5} />
          </p>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <motion.div 
        variants={filterVariants}
        className="flex flex-wrap gap-3 mb-6"
      >
        {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((status) => (
          <motion.button
            key={status}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setFilterStatus(status)}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
              filterStatus === status
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 text-sm">
                ({bookings.filter(b => b.status === status).length})
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-500 text-lg mb-4">No bookings found</p>
          <p className="text-gray-400 mb-6">
            {filterStatus === 'all' 
              ? "You haven't made any bookings yet"
              : `No ${filterStatus} bookings found`}
          </p>
          <Link to="/parkings">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-md"
            >
              Find Parking Now
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover="hover"
                custom={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* Header with gradient */}
                <div className={`${getStatusColor(booking.status)} px-6 py-3 flex justify-between items-center`}>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(booking.status)}
                    <span className="font-semibold">
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm opacity-90">
                    Booking ID: #{booking._id.slice(-6)}
                  </div>
                </div>

                <div className="p-6">
                  {/* Parking Name */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {booking.parkingId?.name || 'Parking Space'}
                  </h3>

                  {/* Address */}
                  <div className="flex items-start mb-4 text-gray-600">
                    <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0 text-blue-500" />
                    <p className="text-sm">{booking.parkingId?.address || 'Address not available'}</p>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                      {booking.vehicleType === 'car' ? (
                        <FaCar className="text-blue-600 text-xl mr-3" />
                      ) : (
                        <FaMotorcycle className="text-green-600 text-xl mr-3" />
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Vehicle</p>
                        <p className="font-semibold text-gray-800">
                          {booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)} - {booking.vehicleNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                      <FaCalendarAlt className="text-purple-600 text-xl mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-800">
                          {format(new Date(booking.startTime), 'MMM dd, yyyy')}
                          <span className="text-sm font-normal text-gray-500 block">
                            {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                      <FaDollarSign className="text-yellow-600 text-xl mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          ${booking.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                      <FaReceipt className="text-gray-600 text-xl mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Payment Status</p>
                        <p className="font-semibold text-green-600">Paid</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-end border-t pt-4">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleViewReceipt(booking)}
                      className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaReceipt className="mr-2" />
                      View Receipt
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FaShareAlt className="mr-2" />
                      Share
                    </motion.button>

                    {booking.status === 'confirmed' && (
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleCancel(booking._id)}
                        className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTimes className="mr-2" />
                        Cancel Booking
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceipt && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReceipt(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
                    <FaReceipt className="text-white text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Payment Receipt</h2>
                  <p className="text-gray-500 text-sm">Booking #{selectedBooking._id.slice(-8)}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Parking Space</span>
                    <span className="font-semibold">{selectedBooking.parkingId?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Vehicle</span>
                    <span className="font-semibold">{selectedBooking.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold">
                      {format(new Date(selectedBooking.startTime), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Time</span>
                    <span className="font-semibold">
                      {format(new Date(selectedBooking.startTime), 'h:mm a')} - {format(new Date(selectedBooking.endTime), 'h:mm a')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">
                      {Math.ceil((new Date(selectedBooking.endTime) - new Date(selectedBooking.startTime)) / (1000 * 60 * 60))} hours
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Rate</span>
                    <span className="font-semibold">${selectedBooking.parkingId?.pricePerHour}/hour</span>
                  </div>
                  <div className="flex justify-between py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-3 -mx-3">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">${selectedBooking.totalAmount}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowReceipt(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-md"
                  >
                    <FaDownload className="inline mr-2" />
                    Download PDF
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserBookings;