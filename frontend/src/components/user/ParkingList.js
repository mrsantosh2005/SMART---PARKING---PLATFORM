import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { FaCar, FaMotorcycle, FaMapMarkerAlt, FaDollarSign, FaSearch } from 'react-icons/fa';
import { BiCurrentLocation } from 'react-icons/bi';
import toast from 'react-hot-toast';

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

  const handleSearch = () => {
    loadParkings(40.7128, -74.0060);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadParkings(position.coords.latitude, position.coords.longitude);
        },
        () => {
          toast.error('Unable to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported');
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
      <h1 className="text-3xl font-bold mb-8">Find Parking Near You</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter location or address"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <FaSearch className="mr-2" />
            Search
          </button>
          <button
            onClick={getUserLocation}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <BiCurrentLocation className="mr-2" />
            My Location
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkings.map((parking) => (
          <div key={parking._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{parking.name}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                <p className="text-sm">{parking.address}</p>
              </div>

              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <FaCar className="text-blue-600 mr-2" />
                  <span>Cars: {parking.availableCarSlots}/{parking.totalCarSlots}</span>
                </div>
                <div className="flex items-center">
                  <FaMotorcycle className="text-green-600 mr-2" />
                  <span>Bikes: {parking.availableBikeSlots}/{parking.totalBikeSlots}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-700 mb-4">
                <FaDollarSign className="text-yellow-600 mr-2" />
                <span className="font-semibold">${parking.pricePerHour}/hour</span>
              </div>

              <Link
                to={`/parking/${parking._id}`}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}

        {parkings.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 text-lg">No parking spaces found in this area.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingList;