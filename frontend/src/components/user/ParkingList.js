import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { parkingService } from '../../services/parkingService';
import ParkingImage from '../common/ParkingImage'; // ✅ Single import
import { FaCar, FaMotorcycle, FaMapMarkerAlt, FaDollarSign, FaSearch } from 'react-icons/fa';
import { BiCurrentLocation } from 'react-icons/bi';
import toast from 'react-hot-toast';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ParkingList = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [radius, setRadius] = useState(5000);

  useEffect(() => {
    loadParkings();
  }, []);

  const loadParkings = async (lat, lng) => {
    try {
      setLoading(true);
      const data = await parkingService.getParkings(lat, lng, radius);
      setParkings(data.data);
    } catch (error) {
      toast.error('Failed to load parkings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => loadParkings(40.7128, -74.0060);
  
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => loadParkings(position.coords.latitude, position.coords.longitude),
        () => toast.error('Unable to get your location')
      );
    } else {
      toast.error('Geolocation not supported');
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
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Find Parking Near You
      </h1>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter location or address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              <option value="1000">Within 1 km</option>
              <option value="2000">Within 2 km</option>
              <option value="5000">Within 5 km</option>
              <option value="10000">Within 10 km</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FaSearch /> Search
          </button>
          <button
            onClick={getUserLocation}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <BiCurrentLocation /> My Location
          </button>
        </div>
      </div>

      {/* Parking Grid with Images */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {parkings.map((parking) => (
          <motion.div key={parking._id} variants={cardVariants} whileHover={{ y: -8 }}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              {/* ✅ Parking Image - Properly integrated */}
              <div className="h-48 overflow-hidden relative">
                <ParkingImage 
                  parkingId={parking._id}
                  name={parking.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ${parking.pricePerHour}/hour
                </div>
                {/* Availability Badge */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                  {parking.availableCarSlots + parking.availableBikeSlots} spots left
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{parking.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
                  <span>{parking.address}</span>
                </div>

                {/* Slot Availability */}
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                    <FaCar className="text-blue-600" />
                    <span className="text-sm font-medium">{parking.availableCarSlots}/{parking.totalCarSlots}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                    <FaMotorcycle className="text-green-600" />
                    <span className="text-sm font-medium">{parking.availableBikeSlots}/{parking.totalBikeSlots}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <Link
                  to={`/parking/${parking._id}`}
                  className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {parkings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🅿️</div>
          <p className="text-gray-500 text-lg">No parking spaces found in this area.</p>
          <button
            onClick={getUserLocation}
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Try My Location
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ParkingList;