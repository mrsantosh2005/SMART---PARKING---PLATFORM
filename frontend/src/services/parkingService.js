import api from './api';

export const parkingService = {
  getParkings: async (lat, lng, radius = 5000) => {
    try {
      let url = '/parking';
      if (lat && lng) {
        url += `?lat=${lat}&lng=${lng}&radius=${radius}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching parkings:', error);
      throw error;
    }
  },

  getParking: async (id) => {
    try {
      const response = await api.get(`/parking/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parking:', error);
      throw error;
    }
  },

  addParking: async (parkingData) => {
    try {
      const response = await api.post('/parking', parkingData);
      return response.data;
    } catch (error) {
      console.error('Error adding parking:', error);
      throw error;
    }
  },

  updateParking: async (id, parkingData) => {
    try {
      const response = await api.put(`/parking/${id}`, parkingData);
      return response.data;
    } catch (error) {
      console.error('Error updating parking:', error);
      throw error;
    }
  },

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