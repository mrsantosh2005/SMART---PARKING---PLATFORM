import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { FaCar, FaMotorcycle, FaBus, FaTruck, FaChargingStation, FaMapMarkerAlt, FaDollarSign, FaSearch } from 'react-icons/fa';
import { BiCurrentLocation } from 'react-icons/bi';
import toast from 'react-hot-toast';

const vehicleFilters = [
  { value: 'car', label: '🚗 Car', icon: FaCar },
  { value: 'bike', label: '🏍️ Bike', icon: FaMotorcycle },
  { value: 'suv', label: '🚙 SUV', icon: FaCar },
  { value: 'bus', label: '🚌 Bus', icon: FaBus },
  { value: 'truck', label: '🚛 Truck', icon: FaTruck },
  { value: 'ev', label: '⚡ EV', icon: FaChargingStation },
];

const ParkingList = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [radius, setRadius] = useState(5000);

  useEffect(() => {
    loadParkings();
  }, [selectedVehicle]);

  const loadParkings = async (lat, lng) => {
    try {
      setLoading(true);
      const data = await parkingService.getParkings(lat, lng, radius, selectedVehicle);
      setParkings(data.data);
    } catch (error) {
      toast.error('Failed to load parkings');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => loadParkings(position.coords.latitude, position.coords.longitude),
        () => toast.error('Unable to get your location')
      );
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
      <h1 className="text-3xl font-bold mb-6">Find Parking Near You</h1>

      {/* Vehicle Filter */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <p className="text-sm text-gray-600 mb-3">Select your vehicle type:</p>
        <div className="flex flex-wrap gap-3">
          {vehicleFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.value}
                onClick={() => setSelectedVehicle(filter.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  selectedVehicle === filter.value
                    ? 'bg-blue-600 text-white'
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

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow p-4 mb-8">
        <div className="flex gap-4">
          <button onClick={getUserLocation} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <BiCurrentLocation /> Use My Location
          </button>
          <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="border rounded-lg px-4 py-2">
            <option value="1000">1 km</option>
            <option value="2000">2 km</option>
            <option value="5000">5 km</option>
            <option value="10000">10 km</option>
          </select>
        </div>
      </div>

      {/* Parking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkings.map((parking) => (
          <div key={parking._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{parking.name}</h3>
                {parking.hasEVCharging && (
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FaChargingStation /> EV
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <FaMapMarkerAlt className="mr-1" />
                <span>{parking.address}</span>
              </div>

              {/* Availability by Vehicle Type */}
              <div className="mb-3">
                <p className="text-sm text-gray-600">Available slots:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {parking.supportedVehicles?.slice(0, 4).map(v => (
                    <span key={v} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{v}</span>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center">
                  <FaDollarSign className="text-yellow-600" />
                  <span className="text-2xl font-bold text-blue-600">₹{parking.priceForVehicle || parking.basePricePerHour}</span>
                  <span className="text-gray-500">/hour</span>
                </div>
                <Link to={`/parking/${parking._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Book Now →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingList;