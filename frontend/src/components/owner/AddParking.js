import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { FaCar, FaMotorcycle, FaChargingStation, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AddParking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    totalCarSlots: 0,
    totalBikeSlots: 0,
    basePricePerHour: 0,
    carPrice: 0,
    bikePrice: 0,
    hasEVCharging: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter parking name');
      setLoading(false);
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter address');
      setLoading(false);
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      toast.error('Please enter latitude and longitude');
      setLoading(false);
      return;
    }
    if (formData.totalCarSlots <= 0 && formData.totalBikeSlots <= 0) {
      toast.error('Please add at least one car or bike slot');
      setLoading(false);
      return;
    }
    if (formData.basePricePerHour <= 0) {
      toast.error('Please enter price per hour');
      setLoading(false);
      return;
    }

    try {
      const response = await parkingService.addParking(formData);
      console.log('Success:', response);
      toast.success('Parking added successfully!');
      navigate('/owner/dashboard');
    } catch (error) {
      console.error('Error:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to add parking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Parking</h1>
          <p className="text-gray-500 mb-6">Fill in the details to list your parking space</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Parking Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Parking Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Downtown Parking, City Center Parking"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                placeholder="Full address with street, city, pin code"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g., 18.5204"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g., 73.8567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Slots */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FaCar className="inline mr-2 text-blue-600" /> Car Slots *
                </label>
                <input
                  type="number"
                  name="totalCarSlots"
                  value={formData.totalCarSlots}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FaMotorcycle className="inline mr-2 text-green-600" /> Bike Slots *
                </label>
                <input
                  type="number"
                  name="totalBikeSlots"
                  value={formData.totalBikeSlots}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FaDollarSign className="inline mr-2 text-yellow-600" /> Base Price per Hour (₹) *
              </label>
              <input
                type="number"
                step="0.5"
                name="basePricePerHour"
                value={formData.basePricePerHour}
                onChange={handleChange}
                min="0"
                placeholder="e.g., 50"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Optional Pricing */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3">Optional: Vehicle-specific Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Car Price (₹/hour)</label>
                  <input
                    type="number"
                    step="0.5"
                    name="carPrice"
                    value={formData.carPrice}
                    onChange={handleChange}
                    placeholder="Leave empty for base price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Bike Price (₹/hour)</label>
                  <input
                    type="number"
                    step="0.5"
                    name="bikePrice"
                    value={formData.bikePrice}
                    onChange={handleChange}
                    placeholder="Leave empty for base price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* EV Charging */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="hasEVCharging"
                checked={formData.hasEVCharging}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <label className="text-gray-700 flex items-center gap-2">
                <FaChargingStation className="text-green-600" />
                EV Charging Available
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Adding Parking...
                </span>
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