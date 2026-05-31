import api from './api';

export const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    try {
      console.log('Sending booking data to backend:', bookingData);
      
      const payload = {
        parkingId: bookingData.parkingId,
        vehicleType: bookingData.vehicleType,
        vehicleNumber: bookingData.vehicleNumber,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        totalAmount: bookingData.totalAmount || 0,
      };
      
      const response = await api.post('/bookings', payload);
      console.log('Booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user's bookings
  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get parking bookings (owner only)
  getParkingBookings: async (parkingId) => {
    try {
      const response = await api.get(`/bookings/parking/${parkingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parking bookings:', error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  // Complete booking (owner only)
  completeBooking: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error completing booking:', error);
      throw error;
    }
  },
};