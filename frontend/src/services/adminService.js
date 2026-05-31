import api from './api';

export const adminService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  getPendingOwners: async () => {
    const response = await api.get('/admin/pending-owners');
    return response.data;
  },
  
  approveOwner: async (ownerId) => {
    const response = await api.put(`/admin/approve-owner/${ownerId}`);
    return response.data;
  },
  
  getAllParkings: async () => {
    const response = await api.get('/admin/parkings');
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};