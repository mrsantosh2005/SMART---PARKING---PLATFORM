import React, { useState, useEffect } from 'react';
import { kycService } from '../../services/kycService';
import { FaUpload, FaCheckCircle, FaTimesCircle, FaClock, FaIdCard, FaBuilding, FaFileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const KYCForm = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    aadharNumber: '',
    aadharName: '',
    panNumber: '',
    panName: '',
    gstNumber: '',
    businessName: '',
    propertyType: '',
    propertyNumber: ''
  });
  
  const [files, setFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    panImage: null,
    gstImage: null,
    propertyImage: null
  });

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      const response = await kycService.getKYCStatus();
      setStatus(response.data);
    } catch (error) {
      console.error('Error loading KYC status:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submitData = new FormData();
    
    // Add text fields
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        submitData.append(key, formData[key]);
      }
    });
    
    // Add files
    Object.keys(files).forEach(key => {
      if (files[key]) {
        submitData.append(key, files[key]);
      }
    });
    
    try {
      await kycService.submitKYC(submitData);
      toast.success('KYC documents submitted successfully!');
      loadKYCStatus();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!status) return null;
    
    switch(status.kycStatus) {
      case 'verified':
        return (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            <span>✅ KYC Verified! Your account is verified.</span>
          </div>
        );
      case 'submitted':
        return (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <FaClock className="text-yellow-500" />
            <span>⏳ KYC submitted. Awaiting admin verification.</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <FaTimesCircle className="text-red-500" />
            <span>❌ KYC Rejected: {status.rejectionReason}</span>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded-lg">
            <span>📋 Please complete KYC verification to get verified badge.</span>
          </div>
        );
    }
  };

  if (status?.kycStatus === 'verified') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">KYC Verified! ✅</h2>
          <p className="text-gray-600 mb-4">Your account is fully verified.</p>
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
            <span className="text-blue-600 font-semibold">Verified Badge:</span>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">{status.verifiedBadge}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">KYC Verification</h2>
        <p className="text-gray-500">Submit your documents to get verified badge</p>
      </div>
      
      {getStatusBadge()}
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {/* Aadhar Card */}
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FaIdCard className="text-blue-600" /> Aadhar Card
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Number"
              value={formData.aadharNumber}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              name="aadharName"
              placeholder="Name as on Aadhar"
              value={formData.aadharName}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <div>
              <label className="block text-sm text-gray-600 mb-1">Front Side</label>
              <input type="file" name="aadharFront" onChange={handleFileChange} accept="image/*" className="border rounded-lg p-2 w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Back Side</label>
              <input type="file" name="aadharBack" onChange={handleFileChange} accept="image/*" className="border rounded-lg p-2 w-full" />
            </div>
          </div>
        </div>
        
        {/* PAN Card */}
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FaFileAlt className="text-orange-600" /> PAN Card
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="panNumber"
              placeholder="PAN Number"
              value={formData.panNumber}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              name="panName"
              placeholder="Name as on PAN"
              value={formData.panName}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <div className="md:col-span-2">
              <input type="file" name="panImage" onChange={handleFileChange} accept="image/*" className="border rounded-lg p-2 w-full" />
            </div>
          </div>
        </div>
        
        {/* GST Certificate (Optional) */}
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FaBuilding className="text-green-600" /> GST Certificate (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="gstNumber"
              placeholder="GST Number"
              value={formData.gstNumber}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <div className="md:col-span-2">
              <input type="file" name="gstImage" onChange={handleFileChange} accept="image/*" className="border rounded-lg p-2 w-full" />
            </div>
          </div>
        </div>
        
        {/* Property Proof */}
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FaBuilding className="text-purple-600" /> Property Proof
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="propertyType" onChange={handleChange} className="border rounded-lg px-4 py-2">
              <option value="">Select Property Type</option>
              <option value="rent_agreement">Rent Agreement</option>
              <option value="ownership_deed">Ownership Deed</option>
              <option value="shop_license">Shop License</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              name="propertyNumber"
              placeholder="Document Number"
              value={formData.propertyNumber}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />
            <div className="md:col-span-2">
              <input type="file" name="propertyImage" onChange={handleFileChange} accept="image/*" className="border rounded-lg p-2 w-full" />
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit KYC for Verification'}
        </button>
      </form>
    </div>
  );
};

export default KYCForm;