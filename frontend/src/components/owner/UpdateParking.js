import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { FaCar, FaMotorcycle, FaDollarSign, FaMapMarkerAlt, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const UpdateParking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalCarSlots: '',
    totalBikeSlots: '',
    pricePerHour: '',
    availableCarSlots: '',
    availableBikeSlots: '',
  });

  useEffect(() => {
    if (id) {
      loadParkingDetails();
    } else {
      toast.error('Invalid parking ID');
      navigate('/owner/dashboard');
    }
  }, [id]);

  const loadParkingDetails = async () => {
    try {
      setLoading(true);
      const response = await parkingService.getParking(id);
      const parking = response.data;
      setFormData({
        name: parking.name || '',
        address: parking.address || '',
        totalCarSlots: parking.totalCarSlots || 0,
        totalBikeSlots: parking.totalBikeSlots || 0,
        pricePerHour: parking.pricePerHour || 0,
        availableCarSlots: parking.availableCarSlots || 0,
        availableBikeSlots: parking.availableBikeSlots || 0,
      });
    } catch (error) {
      console.error('Error loading parking:', error);
      toast.error(error.response?.data?.error || 'Failed to load parking details');
      navigate('/owner/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const updateData = {
        totalCarSlots: parseInt(formData.totalCarSlots),
        totalBikeSlots: parseInt(formData.totalBikeSlots),
        pricePerHour: parseFloat(formData.pricePerHour),
      };

      await parkingService.updateParking(id, updateData);
      toast.success('Parking updated successfully!');
      navigate('/owner/dashboard');
    } catch (error) {
      console.error('Update error:', error);
      
      if (error.response) {
        toast.error(error.response.data?.error || 'Failed to update parking');
      } else if (error.request) {
        toast.error('No response from server. Check your connection.');
      } else {
        toast.error(error.message || 'Failed to update parking');
      }
    } finally {
      setSubmitting(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/owner/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">✏️ Update Parking</h1>
          <p className="text-gray-600 mt-1">Update your parking slot details</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parking Name (Read Only) */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Parking Name
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-xl text-gray-600">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>{formData.name}</span>
              </div>
            </div>

            {/* Address (Read Only) */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Address
              </label>
              <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                {formData.address}
              </div>
            </div>

            {/* Current Slots Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-600">Current Car Slots</p>
                <p className="text-lg font-semibold text-blue-600">
                  Available: {formData.availableCarSlots} / Total: {formData.totalCarSlots}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Bike Slots</p>
                <p className="text-lg font-semibold text-green-600">
                  Available: {formData.availableBikeSlots} / Total: {formData.totalBikeSlots}
                </p>
              </div>
            </div>

            {/* Total Car Slots */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaCar className="inline mr-2 text-blue-600" />
                Total Car Slots
              </label>
              <input
                type="number"
                name="totalCarSlots"
                value={formData.totalCarSlots}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Current available: {formData.availableCarSlots} car slots
              </p>
            </div>

            {/* Total Bike Slots */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaMotorcycle className="inline mr-2 text-green-600" />
                Total Bike Slots
              </label>
              <input
                type="number"
                name="totalBikeSlots"
                value={formData.totalBikeSlots}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <FaDollarSign className="inline mr-2 text-yellow-600" />
                Price per Hour (₹)
              </label>
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                min="0"
                step="0.5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave /> Update Parking
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/owner/dashboard')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateParking;