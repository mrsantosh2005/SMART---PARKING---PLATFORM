import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { parkingService } from '../../services/parkingService';
import { FaCar, FaMotorcycle, FaMapMarkerAlt, FaDollarSign, FaSearch, FaShieldAlt } from 'react-icons/fa';
import { BiCurrentLocation } from 'react-icons/bi';
import toast from 'react-hot-toast';

// Helper function to get verified badge
const getVerifiedBadge = (owner) => {
  if (!owner?.isVerified) return null;
  
  const badges = {
    platinum: { color: 'bg-purple-100 text-purple-800', icon: '👑', text: 'Platinum Verified' },
    gold: { color: 'bg-yellow-100 text-yellow-800', icon: '🥇', text: 'Gold Verified' },
    silver: { color: 'bg-gray-100 text-gray-800', icon: '🥈', text: 'Silver Verified' },
    basic: { color: 'bg-blue-100 text-blue-800', icon: '✅', text: 'Verified' }
  };
  
  const badge = badges[owner.verifiedBadge] || badges.basic;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
      <span>{badge.icon}</span> {badge.text}
    </span>
  );
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

      {/* Parking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkings.map((parking) => (
          <div key={parking._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{parking.name}</h3>
                {/* ✅ Verified Badge Display */}
                {getVerifiedBadge(parking.ownerId)}
              </div>
              
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

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaDollarSign className="text-yellow-600" />
                  <span className="text-2xl font-bold text-blue-600">₹{parking.pricePerHour}</span>
                  <span className="text-gray-500">/hour</span>
                </div>
                {/* Trust Badge */}
                {parking.ownerId?.isVerified && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <FaShieldAlt /> Trusted
                  </div>
                )}
              </div>

              <Link
                to={`/parking/${parking._id}`}
                className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {parkings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🅿️</div>
          <p className="text-gray-500 text-lg">No parking spaces found in this area.</p>
          <p className="text-gray-400 text-sm mt-2">Only verified parking owners are shown here.</p>
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