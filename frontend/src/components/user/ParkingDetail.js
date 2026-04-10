import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { FaCar, FaMotorcycle, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaClock } from 'react-icons/fa';
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

  useEffect(() => {
    loadParking();
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
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateHours = () => {
    if (bookingData.startTime && bookingData.endTime) {
      const start = new Date(bookingData.startTime);
      const end = new Date(bookingData.endTime);
      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      return hours > 0 ? hours : 0;
    }
    return 0;
  };

  const calculateTotal = () => {
    const hours = calculateHours();
    return hours * parking.pricePerHour;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to book a parking slot');
      navigate('/login');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only users can book parking slots');
      return;
    }

    const hours = calculateHours();
    if (hours <= 0) {
      toast.error('Please select valid start and end times');
      return;
    }

    try {
      const bookingPayload = {
        parkingId: id,
        ...bookingData,
        startTime: new Date(bookingData.startTime).toISOString(),
        endTime: new Date(bookingData.endTime).toISOString(),
      };

      await bookingService.createBooking(bookingPayload);
      toast.success('Booking confirmed successfully!');
      navigate('/user/bookings');
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
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Parking not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{parking.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Parking Info */}
            <div>
              <div className="flex items-start mb-4">
                <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2" />
                <p className="text-gray-600">{parking.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaCar className="text-blue-600 mr-2" />
                    <span className="font-semibold">Car Slots</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {parking.availableCarSlots}/{parking.totalCarSlots}
                  </p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaMotorcycle className="text-green-600 mr-2" />
                    <span className="font-semibold">Bike Slots</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {parking.availableBikeSlots}/{parking.totalBikeSlots}
                  </p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-2">
                  <FaDollarSign className="text-yellow-600 mr-2" />
                  <span className="font-semibold">Price</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  ${parking.pricePerHour}/hour
                </p>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Book a Slot</h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="vehicleType"
                        value="car"
                        checked={bookingData.vehicleType === 'car'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <FaCar className="text-blue-600 mr-1" />
                      Car
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="vehicleType"
                        value="bike"
                        checked={bookingData.vehicleType === 'bike'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <FaMotorcycle className="text-green-600 mr-1" />
                      Bike
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={bookingData.vehicleNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ABC-1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={bookingData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={bookingData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {bookingData.startTime && bookingData.endTime && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Duration:</span>
                      <span className="font-semibold">{calculateHours()} hours</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">${calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
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