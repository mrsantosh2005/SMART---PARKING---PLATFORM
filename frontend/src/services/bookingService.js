import api from './api';

export const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
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

  // ✅ Verify booking by QR code (owner/admin only)
  verifyBooking: async (bookingId) => {
    try {
      const response = await api.post('/bookings/verify', { bookingId });
      return response.data;
    } catch (error) {
      console.error('Error verifying booking:', error);
      throw error;
    }
  },

  // ✅ Verify booking by QR data (alternative method)
  verifyQRData: async (qrData) => {
    try {
      const response = await api.post('/bookings/verify-qr', { qrData });
      return response.data;
    } catch (error) {
      console.error('Error verifying QR data:', error);
      throw error;
    }
  },
};