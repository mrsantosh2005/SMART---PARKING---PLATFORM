import React, { useState } from 'react';
import { FaCar, FaMotorcycle, FaBus, FaTruck, FaChargingStation } from 'react-icons/fa';

const vehicleTypes = [
  { value: 'hatchback', label: 'Hatchback Car', icon: FaCar, price: 'standard' },
  { value: 'sedan', label: 'Sedan Car', icon: FaCar, price: 'standard' },
  { value: 'suv', label: 'SUV', icon: FaCar, price: 'premium' },
  { value: 'bike', label: 'Bike', icon: FaMotorcycle, price: 'standard' },
  { value: 'scooter', label: 'Scooter', icon: FaMotorcycle, price: 'standard' },
  { value: 'bus', label: 'Bus', icon: FaBus, price: 'heavy' },
  { value: 'truck', label: 'Truck', icon: FaTruck, price: 'heavy' },
  { value: 'ev', label: 'Electric Vehicle', icon: FaChargingStation, price: 'ev' },
];

const BookingForm = ({ parking, onSubmit }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('hatchback');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState('weekly');
  const [selectedDays, setSelectedDays] = useState([]);
  const [autoRenew, setAutoRenew] = useState(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getPrice = () => {
    const vehicle = vehicleTypes.find(v => v.value === selectedVehicle);
    if (vehicle?.price === 'premium') return parking.suvPrice || parking.pricePerHour * 1.5;
    if (vehicle?.price === 'heavy') return parking.truckPrice || parking.pricePerHour * 2;
    if (vehicle?.value === 'ev') return parking.evPrice || parking.pricePerHour;
    return parking.pricePerHour;
  };

  const calculateTotal = () => {
    if (!startTime || !endTime) return 0;
    const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    return hours * getPrice();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const bookingData = {
      parkingId: parking._id,
      vehicleType: selectedVehicle,
      vehicleNumber,
      startTime,
      endTime,
      totalAmount: calculateTotal(),
    };
    
    if (isRecurring) {
      bookingData.isRecurring = true;
      bookingData.frequency = recurringType;
      bookingData.recurrenceDays = selectedDays;
      bookingData.autoRenew = autoRenew;
    }
    
    onSubmit(bookingData);
  };

  const toggleDay = (dayIndex) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(d => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vehicle Type Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Vehicle Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {vehicleTypes.map((vehicle) => {
            const Icon = vehicle.icon;
            return (
              <button
                key={vehicle.value}
                type="button"
                onClick={() => setSelectedVehicle(vehicle.value)}
                className={`p-3 border rounded-lg text-center transition ${
                  selectedVehicle === vehicle.value
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="mx-auto text-xl mb-1" />
                <span className="text-xs">{vehicle.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicle Number */}
      <div>
        <label className="block text-sm font-medium mb-2">Vehicle Number</label>
        <input
          type="text"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
          placeholder="MH12AB1234"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      {/* Time Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
      </div>

      {/* Recurring Booking Option */}
      <div className="border-t pt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-medium">Make this a recurring booking</span>
        </label>

        {isRecurring && (
          <div className="mt-4 space-y-4 pl-6">
            {/* Frequency Selection */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="daily"
                  checked={recurringType === 'daily'}
                  onChange={(e) => setRecurringType(e.target.value)}
                />
                Daily
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="weekly"
                  checked={recurringType === 'weekly'}
                  onChange={(e) => setRecurringType(e.target.value)}
                />
                Weekly
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="monthly"
                  checked={recurringType === 'monthly'}
                  onChange={(e) => setRecurringType(e.target.value)}
                />
                Monthly
              </label>
            </div>

            {/* Weekly Days Selection */}
            {recurringType === 'weekly' && (
              <div>
                <label className="block text-sm mb-2">Select Days</label>
                <div className="flex gap-2">
                  {daysOfWeek.map((day, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`w-10 h-10 rounded-full text-sm transition ${
                        selectedDays.includes(idx)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-renew Option */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
              />
              <span>Auto-renew this subscription</span>
            </label>
          </div>
        )}
      </div>

      {/* Price Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <span>Rate:</span>
          <span className="font-semibold">₹{getPrice()}/hour</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount:</span>
          <span className="text-blue-600">₹{calculateTotal()}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </form>
  );
};

export default BookingForm;