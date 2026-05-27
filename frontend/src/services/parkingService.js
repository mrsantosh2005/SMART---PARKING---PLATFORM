import api from './api';

export const parkingService = {
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
  
  getParking: async (id) => {
    const response = await api.get(`/parking/${id}`);
    return response.data;
  },
  
  addParking: async (parkingData) => {
    const response = await api.post('/parking', parkingData);
    return response.data;
  },
  
  updateParking: async (id, parkingData) => {
    const response = await api.put(`/parking/${id}`, parkingData);
    return response.data;
  },
  
  getMyParkings: async () => {
    const response = await api.get('/parking/owner/my-parkings');
    return response.data;
  },
};