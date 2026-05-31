import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { FaCar, FaMotorcycle, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaClock, FaInfoCircle, FaShieldAlt, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ParkingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    vehicleType: 'car',
    vehicleNumber: '',
    startTime: '',
    endTime: '',
  });
  const [minDateTime, setMinDateTime] = useState('');

  useEffect(() => {
    loadParking();
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
  }, [id]);

  const loadParking = async () => {
    try {
      const data = await parkingService.getParking(id);
      console.log('Parking data:', data.data);
      setParking(data.data);
    } catch (error) {
      console.error('Error loading parking:', error);
      toast.error('Failed to load parking details');
      navigate('/parkings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  // Get correct price
  const getPricePerHour = () => {
    if (!parking) return 50;
    return parking.basePricePerHour || parking.pricePerHour || 50;
  };

  const calculateHours = () => {
    if (bookingData.startTime && bookingData.endTime) {
      const start = new Date(bookingData.startTime);
      const end = new Date(bookingData.endTime);
      const diffMs = end - start;
      if (diffMs <= 0) return 0;
      return Math.ceil(diffMs / (1000 * 60 * 60));
    }
    return 0;
  };

  const calculateTotal = () => {
    const hours = calculateHours();
    const pricePerHour = getPricePerHour();
    return hours * pricePerHour;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only users can book parking');
      return;
    }

    if (!bookingData.vehicleNumber.trim()) {
      toast.error('Please enter vehicle number');
      return;
    }

    if (!bookingData.startTime || !bookingData.endTime) {
      toast.error('Please select start and end time');
      return;
    }

    const start = new Date(bookingData.startTime);
    const end = new Date(bookingData.endTime);
    const now = new Date();

    if (start < now) {
      toast.error('Start time cannot be in the past');
      return;
    }

    if (end <= start) {
      toast.error('End time must be after start time');
      return;
    }

    const totalAmount = calculateTotal();
    const hours = calculateHours();
    const pricePerHour = getPricePerHour();

    console.log('Booking details:', {
      parkingId: id,
      vehicleType: bookingData.vehicleType,
      vehicleNumber: bookingData.vehicleNumber,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      hours,
      pricePerHour,
      totalAmount
    });

    try {
      const response = await bookingService.createBooking({
        parkingId: id,
        vehicleType: bookingData.vehicleType,
        vehicleNumber: bookingData.vehicleNumber.toUpperCase(),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        totalAmount: totalAmount,
      });

      if (response.success) {
        toast.success(`Booking confirmed! Amount: ₹${totalAmount}`);
        navigate('/user/bookings');
      }
    } catch (error) {
      console.error('Booking error:', error.response?.data);
      toast.error(error.response?.data?.error || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!parking) {
    return <div className="text-center py-12 text-white">Parking not found</div>;
  }

  const pricePerHour = getPricePerHour();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column - Parking Info */}
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{parking.name}</h1>
                {parking.ownerId?.isVerified && (
                  <div className="flex items-center gap-1 bg-blue-500/20 px-3 py-1 rounded-full">
                    <FaShieldAlt className="text-blue-400 text-sm" />
                    <span className="text-blue-400 text-xs">Verified</span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 mb-6">
                <FaMapMarkerAlt className="text-gray-400 mt-1" />
                <p className="text-gray-300">{parking.address}</p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">(128 reviews)</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-500/10 rounded-xl p-4 text-center">
                  <FaCar className="text-blue-400 text-2xl mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{parking.availableCarSlots || 0}/{parking.totalCarSlots || 0}</p>
                  <p className="text-gray-400 text-sm">Car Slots</p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4 text-center">
                  <FaMotorcycle className="text-green-400 text-2xl mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{parking.availableBikeSlots || 0}/{parking.totalBikeSlots || 0}</p>
                  <p className="text-gray-400 text-sm">Bike Slots</p>
                </div>
              </div>

              {/* ✅ PRICE DISPLAY */}
              <div className="bg-yellow-500/10 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Price per hour</p>
                    <p className="text-3xl font-bold text-yellow-400">₹{pricePerHour}</p>
                  </div>
                  <FaDollarSign className="text-yellow-500 text-4xl opacity-50" />
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="text-white font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-gray-300 text-sm">✓ CCTV Camera</span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-gray-300 text-sm">✓ 24/7 Security</span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-gray-300 text-sm">✓ Well Lit</span>
                  {parking.hasEVCharging && (
                    <span className="px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm">✓ EV Charging</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="bg-white/5 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Book This Slot</h2>

              <form onSubmit={handleBooking} className="space-y-5">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Vehicle Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="vehicleType"
                        value="car"
                        checked={bookingData.vehicleType === 'car'}
                        onChange={handleChange}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <FaCar className="text-blue-400" />
                      <span className="text-white">Car</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="vehicleType"
                        value="bike"
                        checked={bookingData.vehicleType === 'bike'}
                        onChange={handleChange}
                        className="w-4 h-4 accent-green-600"
                      />
                      <FaMotorcycle className="text-green-400" />
                      <span className="text-white">Bike</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={bookingData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="MH12AB1234"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={bookingData.startTime}
                    onChange={handleChange}
                    min={minDateTime}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={bookingData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* ✅ PRICE SUMMARY */}
                {bookingData.startTime && bookingData.endTime && calculateHours() > 0 && (
                  <div className="bg-blue-500/10 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white font-semibold">{calculateHours()} hour(s)</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Rate:</span>
                      <span className="text-white">₹{pricePerHour}/hour</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold">Total Amount:</span>
                        <span className="text-yellow-400 font-bold text-xl">₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-500/10 rounded-xl p-3 flex items-start gap-2">
                  <FaInfoCircle className="text-blue-400 mt-0.5" />
                  <p className="text-blue-300 text-xs">Slot will be held for 15 minutes after start time</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition"
                >
                  Confirm Booking
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParkingDetail;