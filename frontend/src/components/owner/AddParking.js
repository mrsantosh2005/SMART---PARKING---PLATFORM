import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { FaCar, FaMotorcycle, FaBus, FaTruck, FaChargingStation } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AddParking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    
    // Car Slots
    totalCarSlots: 0,
    hatchbackSlots: 0,
    sedanSlots: 0,
    suvSlots: 0,
    
    // Bike Slots
    totalBikeSlots: 0,
    bikeSlots: 0,
    scooterSlots: 0,
    
    // Heavy Vehicles
    busSlots: 0,
    truckSlots: 0,
    
    // EV Charging
    hasEVCharging: false,
    evChargingSlots: 0,
    
    // Pricing
    basePricePerHour: 0,
    carPrice: 0,
    bikePrice: 0,
    hatchbackPrice: 0,
    sedanPrice: 0,
    suvPrice: 0,
    scooterPrice: 0,
    busPrice: 0,
    truckPrice: 0,
    evPrice: 0,
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
    try {
      await parkingService.addParking(formData);
      toast.success('Parking added successfully!');
      navigate('/owner/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add parking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Add New Parking Location</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" placeholder="Parking Name" onChange={handleChange} className="border rounded-lg p-2" required />
            <input name="address" placeholder="Address" onChange={handleChange} className="border rounded-lg p-2" required />
            <input name="latitude" placeholder="Latitude" onChange={handleChange} className="border rounded-lg p-2" required />
            <input name="longitude" placeholder="Longitude" onChange={handleChange} className="border rounded-lg p-2" required />
          </div>
        </div>

        {/* Vehicle Slots Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCar className="text-blue-600" /> Vehicle Slots
          </h2>
          
          {/* Car Variants */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">🚗 Cars</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input name="totalCarSlots" type="number" placeholder="Total Car Slots" onChange={handleChange} className="border rounded-lg p-2" />
              <input name="hatchbackSlots" type="number" placeholder="Hatchback" onChange={handleChange} className="border rounded-lg p-2" />
              <input name="sedanSlots" type="number" placeholder="Sedan" onChange={handleChange} className="border rounded-lg p-2" />
              <input name="suvSlots" type="number" placeholder="SUV" onChange={handleChange} className="border rounded-lg p-2" />
            </div>
          </div>

          {/* Two Wheelers */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">🏍️ Two Wheelers</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input name="totalBikeSlots" type="number" placeholder="Total Bike Slots" onChange={handleChange} className="border rounded-lg p-2" />
              <input name="bikeSlots" type="number" placeholder="Bike" onChange={handleChange} className="border rounded-lg p-2" />
              <input name="scooterSlots" type="number" placeholder="Scooter" onChange={handleChange} className="border rounded-lg p-2" />
            </div>
          </div>

          {/* Heavy Vehicles */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">🚛 Heavy Vehicles</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="busSlots" type="number" placeholder="Bus Slots" onChange={handleChange} className="border rounded-lg p-2" />
              <input name="truckSlots" type="number" placeholder="Truck Slots" onChange={handleChange} className="border rounded-lg p-2" />
            </div>
          </div>

          {/* EV Charging */}
          <div className="mb-6">
            <label className="flex items-center gap-2">
              <input name="hasEVCharging" type="checkbox" onChange={handleChange} className="w-4 h-4" />
              <FaChargingStation className="text-green-600" />
              <span>EV Charging Available</span>
            </label>
            {formData.hasEVCharging && (
              <input name="evChargingSlots" type="number" placeholder="EV Charging Slots" onChange={handleChange} className="border rounded-lg p-2 mt-2 w-full" />
            )}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">💰 Pricing (₹ per hour)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input name="basePricePerHour" type="number" placeholder="Base Price" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="carPrice" type="number" placeholder="Car Price" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="bikePrice" type="number" placeholder="Bike Price" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="hatchbackPrice" type="number" placeholder="Hatchback" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="sedanPrice" type="number" placeholder="Sedan" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="suvPrice" type="number" placeholder="SUV" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="scooterPrice" type="number" placeholder="Scooter" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="busPrice" type="number" placeholder="Bus" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="truckPrice" type="number" placeholder="Truck" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="evPrice" type="number" placeholder="EV" onChange={handleChange} className="border rounded-lg p-2" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
          {loading ? 'Adding...' : 'Add Parking'}
        </button>
      </form>
    </div>
  );
};

export default AddParking;