import api from './api';

export const kycService = {
  // Submit KYC documents
  submitKYC: async (formData) => {
    try {
      const response = await api.post('/kyc/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting KYC:', error);
      throw error;
    }
  },
  
  // Get KYC status
  getKYCStatus: async () => {
    try {
      const response = await api.get('/kyc/status');
      return response.data;
    } catch (error) {
      console.error('Error getting KYC status:', error);
      throw error;
    }
  },
  
  // Admin: Get pending KYC
  getPendingKYC: async () => {
    try {
      const response = await api.get('/kyc/admin/pending');
      return response.data;
    } catch (error) {
      console.error('Error getting pending KYC:', error);
      throw error;
    }
  },
  
  // Admin: Verify KYC
  verifyKYC: async (userId, approved, rejectionReason = null, verifiedBadge = 'basic') => {
    try {
      const response = await api.put(`/kyc/admin/verify/${userId}`, {
        approved,
        rejectionReason,
        verifiedBadge
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying KYC:', error);
      throw error;
    }
  },
  
  // Get verified owners
  getVerifiedOwners: async () => {
    try {
      const response = await api.get('/kyc/verified-owners');
      return response.data;
    } catch (error) {
      console.error('Error getting verified owners:', error);
      throw error;
    }
  }
};