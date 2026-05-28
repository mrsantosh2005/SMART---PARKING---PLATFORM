import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { FaCar, FaMotorcycle, FaMapMarkerAlt, FaDollarSign, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ParkingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    vehicleType: 'car',
    vehicleNumber: '',
    startTime: '',
    endTime: '',
  });
  const [minDateTime, setMinDateTime] = useState('');

  useEffect(() => {
    loadParking();
    // Set minimum date to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
  }, [id]);

  const loadParking = async () => {
    try {
      const data = await parkingService.getParking(id);
      setParking(data.data);
    } catch (error) {
      toast.error('Failed to load parking details');
      navigate('/parkings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const calculateHours = () => {
    if (bookingData.startTime && bookingData.endTime) {
      const start = new Date(bookingData.startTime);
      const end = new Date(bookingData.endTime);
      const diffMs = end - start;
      if (diffMs <= 0) return 0;
      return Math.ceil(diffMs / (1000 * 60 * 60));
    }
    return 0;
  };

  const calculateTotal = () => {
    const hours = calculateHours();
    return hours * (parking?.basePricePerHour || 0);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only users can book parking');
      return;
    }

    if (!bookingData.vehicleNumber.trim()) {
      toast.error('Please enter vehicle number');
      return;
    }

    if (!bookingData.startTime || !bookingData.endTime) {
      toast.error('Please select start and end time');
      return;
    }

    const start = new Date(bookingData.startTime);
    const end = new Date(bookingData.endTime);
    const now = new Date();

    if (start < now) {
      toast.error('Start time cannot be in the past');
      return;
    }

    if (end <= start) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      const response = await bookingService.createBooking({
        parkingId: id,
        vehicleType: bookingData.vehicleType,
        vehicleNumber: bookingData.vehicleNumber.toUpperCase(),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
      });

      if (response.success) {
        toast.success('Booking confirmed!');
        navigate('/user/bookings');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!parking) {
    return <div className="text-center py-12">Parking not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{parking.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Info */}
            <div>
              <div className="flex items-start mb-4">
                <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2" />
                <p className="text-gray-600">{parking.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <FaCar className="text-blue-600 text-2xl mb-2" />
                  <p className="text-2xl font-bold">{parking.availableCarSlots}/{parking.totalCarSlots}</p>
                  <p className="text-sm">Car Slots Available</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <FaMotorcycle className="text-green-600 text-2xl mb-2" />
                  <p className="text-2xl font-bold">{parking.availableBikeSlots}/{parking.totalBikeSlots}</p>
                  <p className="text-sm">Bike Slots Available</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">₹{parking.basePricePerHour}/hour</p>
                <p className="text-sm">Price per hour</p>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Book This Slot</h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="vehicleType" value="car" checked={bookingData.vehicleType === 'car'} onChange={handleChange} />
                      <FaCar /> Car
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="vehicleType" value="bike" checked={bookingData.vehicleType === 'bike'} onChange={handleChange} />
                      <FaMotorcycle /> Bike
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={bookingData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="MH12AB1234"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={bookingData.startTime}
                    onChange={handleChange}
                    min={minDateTime}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={bookingData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                {calculateHours() > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>Duration: {calculateHours()} hour(s)</p>
                    <p className="text-xl font-bold">Total: ₹{calculateTotal()}</p>
                  </div>
                )}

                <div className="bg-blue-50 p-3 rounded-lg flex gap-2">
                  <FaInfoCircle className="text-blue-500" />
                  <p className="text-sm text-blue-700">Slot will be held for 15 minutes after start time</p>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetail;