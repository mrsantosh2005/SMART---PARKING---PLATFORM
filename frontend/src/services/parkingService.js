import api from './api';

export const parkingService = {
  // Get all parkings
  getParkings: async (lat, lng, radius = 5000, vehicleType = 'car') => {
    try {
      let url = '/parking';
      const params = new URLSearchParams();
      if (lat && lng) {
        params.append('lat', lat);
        params.append('lng', lng);
        params.append('radius', radius);
      }
      if (vehicleType) {
        params.append('vehicleType', vehicleType);
      }
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching parkings:', error);
      throw error;
    }
  },

  // Get single parking
  getParking: async (id) => {
    try {
      const response = await api.get(`/parking/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parking:', error);
      throw error;
    }
  },

  // Add new parking
  addParking: async (parkingData) => {
    try {
      console.log('Adding parking with data:', parkingData);
      const response = await api.post('/parking', parkingData);
      console.log('Add parking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding parking:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update parking
  updateParking: async (id, parkingData) => {
    try {
      const response = await api.put(`/parking/${id}`, parkingData);
      return response.data;
    } catch (error) {
      console.error('Error updating parking:', error);
      throw error;
    }
  },

  // Get owner's parkings
  getMyParkings: async () => {
    try {
      const response = await api.get('/parking/owner/my-parkings');
      return response.data;
    } catch (error) {
      console.error('Error fetching my parkings:', error);
      throw error;
    }
  },
};