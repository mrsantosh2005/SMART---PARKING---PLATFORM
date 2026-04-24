import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { parkingService } from '../../services/parkingService';
import { FaCar, FaMotorcycle, FaMapMarkerAlt, FaDollarSign, FaSearch } from 'react-icons/fa';
import { BiCurrentLocation } from 'react-icons/bi';
import toast from 'react-hot-toast';

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
        <div className="loading-spinner"></div>
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
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Find Parking Near You</h1>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter location or address"
              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <FaSearch /> Search
          </button>
          <button
            onClick={getUserLocation}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <BiCurrentLocation /> My Location
          </button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {parkings.map((parking) => (
          <motion.div key={parking._id} variants={cardVariants} whileHover={{ y: -8 }}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl card-hover">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{parking.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-600 mb-4">
                  <FaMapMarkerAlt className="mr-2" />
                  <p className="text-sm">{parking.address}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                    <FaCar className="text-blue-600" />
                    <span className="text-sm">{parking.availableCarSlots}/{parking.totalCarSlots}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                    <FaMotorcycle className="text-green-600" />
                    <span className="text-sm">{parking.availableBikeSlots}/{parking.totalBikeSlots}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaDollarSign className="text-yellow-600" />
                    <span className="text-2xl font-bold text-blue-600">${parking.pricePerHour}</span>
                    <span className="text-gray-500">/hour</span>
                  </div>
                </div>
                <Link
                  to={`/parking/${parking._id}`}
                  className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ParkingList;