import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { 
  FaCar, FaMotorcycle, FaBus, FaTruck, FaChargingStation, 
  FaMapMarkerAlt, FaDollarSign, FaSearch, FaFilter,
  FaParking, FaClock, FaShieldAlt
} from 'react-icons/fa';
import { BiCurrentLocation } from 'react-icons/bi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const vehicleFilters = [
  { value: 'car', label: 'Car', icon: FaCar, color: 'blue' },
  { value: 'bike', label: 'Bike', icon: FaMotorcycle, color: 'green' },
  { value: 'suv', label: 'SUV', icon: FaCar, color: 'purple' },
  { value: 'ev', label: 'Electric Vehicle', icon: FaChargingStation, color: 'emerald' },
  { value: 'bus', label: 'Bus', icon: FaBus, color: 'orange' },
  { value: 'truck', label: 'Truck', icon: FaTruck, color: 'red' },
];

const ParkingList = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [radius, setRadius] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadParkings();
  }, [selectedVehicle, radius]);

  const loadParkings = async (lat, lng) => {
    try {
      setLoading(true);
      const data = await parkingService.getParkings(lat, lng, radius, selectedVehicle);
      setParkings(data.data || []);
      if (lat && lng) {
        setUserLocation({ lat, lng });
      }
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
    // In production, use Google Places API to get coordinates
    // For demo, using default coordinates
    loadParkings(18.5204, 73.8567);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...', { id: 'location' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadParkings(position.coords.latitude, position.coords.longitude);
          toast.success('Location detected!', { id: 'location' });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to get your location', { id: 'location' });
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const getVehicleIcon = (type) => {
    const vehicle = vehicleFilters.find(v => v.value === type);
    if (vehicle) {
      const Icon = vehicle.icon;
      return <Icon className="text-sm" />;
    }
    return <FaCar className="text-sm" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Find Parking Near You</h1>
          <p className="text-center text-blue-100 mb-8">Book safe & secure parking spots instantly</p>
          
          {/* Search Box */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter location or address..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-gray-800"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="w-full md:w-40">
                  <select
                    className="w-full px-4 py-3 rounded-xl border-0 bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                  >
                    <option value="1000">1 km</option>
                    <option value="2000">2 km</option>
                    <option value="5000">5 km</option>
                    <option value="10000">10 km</option>
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
                  <BiCurrentLocation /> Near Me
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Vehicle Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FaFilter className="text-gray-400" /> Filter by vehicle type:
            </p>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-600 text-sm hover:underline"
            >
              {showFilters ? 'Hide' : 'Show all'}
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {vehicleFilters.slice(0, showFilters ? vehicleFilters.length : 4).map((filter) => {
              const Icon = filter.icon;
              const isActive = selectedVehicle === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => setSelectedVehicle(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? `bg-${filter.color}-600 text-white shadow-md`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Found <span className="font-semibold text-blue-600">{parkings.length}</span> parking spots
          </p>
          {userLocation && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <BiCurrentLocation className="text-green-600" />
              Near your location
            </p>
          )}
        </div>

        {/* Parking Cards Grid */}
        {parkings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaParking className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No parking spots found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search radius or vehicle type</p>
            <button onClick={getUserLocation} className="text-blue-600 hover:underline">
              Use my current location
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parkings.map((parking, index) => (
              <motion.div
                key={parking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Image placeholder with gradient */}
                <div className="h-36 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-1 text-white text-sm">
                      <FaMapMarkerAlt className="text-white/80" />
                      <span className="truncate max-w-[200px]">{parking.address}</span>
                    </div>
                  </div>
                  {parking.hasEVCharging && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <FaChargingStation /> EV
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{parking.name}</h3>
                    {parking.ownerId?.isVerified && (
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FaShieldAlt /> Verified
                      </span>
                    )}
                  </div>

                  {/* Supported Vehicles */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {parking.supportedVehicles?.slice(0, 4).map((v) => (
                      <span key={v} className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                        {getVehicleIcon(v)} {v}
                      </span>
                    ))}
                    {parking.supportedVehicles?.length > 4 && (
                      <span className="text-xs text-gray-500">+{parking.supportedVehicles.length - 4}</span>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {parking.availableForVehicle || parking.availableCarSlots || 0} spots available
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <FaClock />
                      <span>24/7</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{parking.priceForVehicle || parking.basePricePerHour || parking.pricePerHour}
                      </span>
                      <span className="text-gray-500">/hour</span>
                    </div>
                    <Link
                      to={`/parking/${parking._id}`}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      Book Now <FaSearch className="text-xs" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingList;