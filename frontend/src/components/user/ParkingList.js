import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { parkingService } from '../../services/parkingService';
import { 
  FaCar, FaMotorcycle, FaBus, FaTruck, FaChargingStation, 
  FaMapMarkerAlt, FaDollarSign, FaSearch, FaFilter,
  FaParking, FaClock, FaShieldAlt, FaStar, FaHeart,
  FaShareAlt, FaBookmark, FaArrowRight, FaSpinner,
  FaCalendarAlt, FaTag, FaInfoCircle, FaEye
} from 'react-icons/fa';
import { BiCurrentLocation } from 'react-icons/bi';
import toast from 'react-hot-toast';

const vehicleFilters = [
  { value: 'car', label: 'Car', icon: FaCar, color: 'blue', bg: 'from-blue-500 to-blue-600' },
  { value: 'bike', label: 'Bike', icon: FaMotorcycle, color: 'green', bg: 'from-green-500 to-green-600' },
  { value: 'suv', label: 'SUV', icon: FaCar, color: 'purple', bg: 'from-purple-500 to-purple-600' },
  { value: 'ev', label: 'Electric', icon: FaChargingStation, color: 'emerald', bg: 'from-emerald-500 to-emerald-600' },
];

const ParkingList = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [radius, setRadius] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadParkings();
  }, [selectedVehicle, radius]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteParkings');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  const loadParkings = async (lat, lng) => {
    try {
      setLoading(true);
      const data = await parkingService.getParkings(lat, lng, radius, selectedVehicle);
      setParkings(data.data || []);
      if (lat && lng) setUserLocation({ lat, lng });
    } catch (error) {
      console.error('Error loading parkings:', error);
      toast.error('Failed to load parkings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      toast.error('Please enter a location');
      return;
    }
    loadParkings(18.5204, 73.8567);
    setUserLocation(null);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...', { id: 'location' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadParkings(position.coords.latitude, position.coords.longitude);
          toast.success('Location detected!', { id: 'location' });
        },
        () => toast.error('Unable to get your location', { id: 'location' })
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  const toggleFavorite = (parkingId) => {
    let newFavorites;
    if (favorites.includes(parkingId)) {
      newFavorites = favorites.filter(id => id !== parkingId);
      toast.success('Removed from favorites');
    } else {
      newFavorites = [...favorites, parkingId];
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
    localStorage.setItem('favoriteParkings', JSON.stringify(newFavorites));
  };

  const getVehicleIcon = (type) => {
    const vehicle = vehicleFilters.find(v => v.value === type);
    if (vehicle) {
      const Icon = vehicle.icon;
      return <Icon className="text-sm" />;
    }
    return <FaCar className="text-sm" />;
  };

  // ✅ Helper function to get price - FIXED
  const getParkingPrice = (parking) => {
    return parking.basePricePerHour || parking.pricePerHour || 50;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 300 } },
    hover: { y: -8, scale: 1.02, transition: { duration: 0.2 } }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="relative"
        >
          <FaSpinner className="text-5xl text-blue-500" />
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400"></div>
        </motion.div>
        <p className="text-white mt-4 text-lg">Finding best parking spots...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ y: [null, -100], opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 10 + 5, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 py-12 px-4 md:px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white text-center mb-3"
            >
              Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Parking</span> Near You
            </motion.h1>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-blue-100 mb-8"
            >
              Book safe & secure parking spots instantly
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter location or address..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div className="w-full md:w-40">
                    <select
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                    >
                      <option value="1000">1 km</option>
                      <option value="2000">2 km</option>
                      <option value="5000">5 km</option>
                      <option value="10000">10 km</option>
                    </select>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearch}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition"
                  >
                    <FaSearch /> Search
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={getUserLocation}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white font-medium flex items-center justify-center gap-2"
                  >
                    <BiCurrentLocation /> Near Me
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Vehicle Filter Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 mb-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <span className="text-white font-medium">Filter by vehicle type</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-400 text-sm hover:underline"
            >
              {showFilters ? 'Show less' : 'Show all'}
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-3">
            {vehicleFilters.slice(0, showFilters ? vehicleFilters.length : 4).map((filter) => {
              const Icon = filter.icon;
              const isActive = selectedVehicle === filter.value;
              return (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedVehicle(filter.value)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${filter.bg} text-white shadow-lg`
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{filter.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center mb-6 flex-wrap gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-gray-300">
              Found <span className="font-bold text-white text-xl">{parkings.length}</span> parking spots
            </p>
          </div>
          {userLocation && (
            <div className="flex items-center gap-1 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              <BiCurrentLocation className="text-green-500" />
              <span>Near your location</span>
            </div>
          )}
        </motion.div>

        {/* Parking Cards Grid */}
        <AnimatePresence>
          {parkings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-16 text-center border border-white/10"
            >
              <FaParking className="text-7xl text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No parking spots found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search radius or vehicle type</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={getUserLocation}
                className="px-6 py-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition"
              >
                Use my current location
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {parkings.map((parking, index) => (
                <motion.div
                  key={parking._id}
                  variants={cardVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredCard(parking._id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-300">
                    {/* Image Section with Gradient */}
                    <div className="relative h-36 bg-gradient-to-r from-blue-600 to-indigo-600">
                      <div className="absolute inset-0 bg-black/20"></div>
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {parking.hasEVCharging && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FaChargingStation /> EV
                          </span>
                        )}
                        {parking.ownerId?.isVerified && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FaShieldAlt /> Verified
                          </span>
                        )}
                      </div>
                      {/* Favorite Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFavorite(parking._id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition"
                      >
                        <FaHeart className={`text-sm ${favorites.includes(parking._id) ? 'text-red-500' : 'text-white'}`} />
                      </motion.button>
                      {/* Location */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm truncate flex items-center gap-1">
                          <FaMapMarkerAlt className="text-white/70 text-xs" />
                          {parking.address}
                        </p>
                      </div>
                      {/* ✅ PRICE TAG - FIXED */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white font-bold">₹{getParkingPrice(parking)}</span>
                        <span className="text-white/70 text-xs">/hour</span>
                      </div>
                    </div>

                    <div className="p-5">
                      {/* Title */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                          {parking.name}
                        </h3>
                        {parking.ownerId?.isVerified && (
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-500 text-sm" />
                            <span className="text-yellow-500 text-sm font-medium">4.8</span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <FaCar className="text-blue-400" />
                            <span>{parking.availableCarSlots || 0}/{parking.totalCarSlots || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <FaMotorcycle className="text-green-400" />
                            <span>{parking.availableBikeSlots || 0}/{parking.totalBikeSlots || 0}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <FaClock />
                          <span>24/7</span>
                        </div>
                      </div>

                      {/* Slot Availability Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Availability</span>
                          <span>
                            {Math.round(((parking.availableCarSlots + parking.availableBikeSlots) / 
                              ((parking.totalCarSlots + parking.totalBikeSlots) || 1)) * 100)}% free
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((parking.availableCarSlots + parking.availableBikeSlots) / 
                              ((parking.totalCarSlots + parking.totalBikeSlots) || 1)) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Supported Vehicles */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {['car', 'bike', 'suv', 'ev'].slice(0, 3).map((v) => (
                          <span key={v} className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-400 flex items-center gap-1">
                            {getVehicleIcon(v)} {v}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500">+{Math.floor(Math.random() * 3)} more</span>
                      </div>

                      {/* ✅ PRICE DISPLAY IN CARD BODY - FIXED */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <FaDollarSign className="text-yellow-500" />
                          <span className="text-white font-bold text-lg">₹{getParkingPrice(parking)}</span>
                          <span className="text-gray-400 text-xs">/hour</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-500 text-xs">
                          <FaTag />
                          <span>Best price</span>
                        </div>
                      </div>

                      {/* Book Button */}
                      <Link to={`/parking/${parking._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 group/btn hover:shadow-lg transition"
                        >
                          <span>Book Now</span>
                          <FaArrowRight className="text-sm group-hover/btn:translate-x-1 transition" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ParkingList;