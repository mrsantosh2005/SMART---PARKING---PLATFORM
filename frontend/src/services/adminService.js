import api from './api';

export const adminService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getPendingOwners: async () => {
    try {
      const response = await api.get('/admin/pending-owners');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending owners:', error);
      throw error;
    }
  },

  approveOwner: async (ownerId) => {
    try {
      const response = await api.put(`/admin/approve-owner/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error('Error approving owner:', error);
      throw error;
    }
  },

  getAllParkings: async () => {
    try {
      const response = await api.get('/admin/parkings');
      return response.data;
    } catch (error) {
      console.error('Error fetching parkings:', error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
};