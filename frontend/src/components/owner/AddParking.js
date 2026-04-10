import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { useAuth } from '../../context/AuthContext';
import { 
  FaMapMarkerAlt, 
  FaCar, 
  FaMotorcycle, 
  FaDollarSign,
  FaParking,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AddParking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    totalCarSlots: '',
    totalBikeSlots: '',
    pricePerHour: '',
  });

  // Check if owner is approved
  React.useEffect(() => {
    if (user && user.role === 'owner' && !user.isApproved) {
      toast.error('Your account is pending approval from admin');
      navigate('/owner/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Parking name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    if (!formData.latitude) {
      newErrors.latitude = 'Latitude is required';
    } else if (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Valid latitude between -90 and 90 is required';
    }

    if (!formData.longitude) {
      newErrors.longitude = 'Longitude is required';
    } else if (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Valid longitude between -180 and 180 is required';
    }

    if (!formData.totalCarSlots) {
      newErrors.totalCarSlots = 'Car slots are required';
    } else if (parseInt(formData.totalCarSlots) < 0) {
      newErrors.totalCarSlots = 'Car slots cannot be negative';
    }

    if (!formData.totalBikeSlots) {
      newErrors.totalBikeSlots = 'Bike slots are required';
    } else if (parseInt(formData.totalBikeSlots) < 0) {
      newErrors.totalBikeSlots = 'Bike slots cannot be negative';
    }

    if (!formData.pricePerHour) {
      newErrors.pricePerHour = 'Price per hour is required';
    } else if (parseFloat(formData.pricePerHour) <= 0) {
      newErrors.pricePerHour = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error('Please fix the errors in the form');
    return;
  }

  setLoading(true);

  try {
    // First test if backend is reachable
    try {
      const testResponse = await fetch('http://localhost:5001/api/test');
      if (!testResponse.ok) {
        throw new Error('Backend test failed');
      }
      console.log('✅ Backend connection test passed');
    } catch (testError) {
      console.error('❌ Backend connection test failed:', testError);
      toast.error('Cannot connect to server. Please check if backend is running on port 5001');
      setLoading(false);
      return;
    }

    const parkingData = {
      name: formData.name,
      address: formData.address,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      totalCarSlots: parseInt(formData.totalCarSlots),
      totalBikeSlots: parseInt(formData.totalBikeSlots),
      pricePerHour: parseFloat(formData.pricePerHour)
    };

    console.log('📤 Submitting parking data:', parkingData);
    
    const response = await parkingService.addParking(parkingData);
    console.log('✅ Parking added successfully:', response);
    
    toast.success('Parking location added successfully!');
    navigate('/owner/dashboard');
  } catch (error) {
    console.error('❌ Add parking error:', error);
    
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      toast.error('Cannot connect to server. Please ensure backend is running on port 5001');
    } else if (error.response) {
      // Server responded with error
      toast.error(error.response.data?.error || 'Failed to add parking');
    } else if (error.request) {
      // Request made but no response
      toast.error('No response from server. Check if backend is running');
    } else {
      toast.error('An unexpected error occurred');
    }
  } finally {
    setLoading(false);
  }
};
  // Function to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...', { id: 'location' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <FaParking className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Parking Location
          </h1>
          <p className="text-gray-600">
            Fill in the details below to list your parking space
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parking Name */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Parking Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Downtown Parking Garage"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errors.name}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Full address with street, city, zip code"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationCircle className="mr-1" /> {errors.address}
                </p>
              )}
            </div>

            {/* Coordinates */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium">
                  Coordinates <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FaMapMarkerAlt className="mr-1" />
                  Use My Location
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.latitude ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Latitude (e.g., 40.7128)"
                  />
                  {errors.latitude && (
                    <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.longitude ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Longitude (e.g., -74.0060)"
                  />
                  {errors.longitude && (
                    <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Car Slots <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCar className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="totalCarSlots"
                    value={formData.totalCarSlots}
                    onChange={handleChange}
                    min="0"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.totalCarSlots ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Number of car slots"
                  />
                </div>
                {errors.totalCarSlots && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalCarSlots}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Bike Slots <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMotorcycle className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="totalBikeSlots"
                    value={formData.totalBikeSlots}
                    onChange={handleChange}
                    min="0"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.totalBikeSlots ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Number of bike slots"
                  />
                </div>
                {errors.totalBikeSlots && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalBikeSlots}</p>
                )}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Price per Hour ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  min="0"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.pricePerHour ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="5.00"
                />
              </div>
              {errors.pricePerHour && (
                <p className="mt-1 text-sm text-red-600">{errors.pricePerHour}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Adding Parking Location...
                </>
              ) : (
                'Add Parking Location'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddParking;