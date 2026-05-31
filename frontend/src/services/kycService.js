import api from './api';

export const kycService = {
  submitKYC: async (formData) => {
    const response = await api.post('/kyc/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  getKYCStatus: async () => {
    const response = await api.get('/kyc/status');
    return response.data;
  },
  
  getPendingKYC: async () => {
    const response = await api.get('/kyc/admin/pending');
    return response.data;
  },
  
  getKYCDetails: async (userId) => {
    const response = await api.get(`/kyc/admin/details/${userId}`);
    return response.data;
  },
  
  verifyKYC: async (userId, approved, rejectionReason, verifiedBadge) => {
    const response = await api.put(`/kyc/admin/verify/${userId}`, {
      approved,
      rejectionReason,
      verifiedBadge
    });
    return response.data;
  }
};