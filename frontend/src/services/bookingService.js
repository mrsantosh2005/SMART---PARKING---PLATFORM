import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      console.log('Booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error.response?.data || error.message);
      throw error;
    }
  },

  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  completeBooking: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error completing booking:', error);
      throw error;
    }
  }
};