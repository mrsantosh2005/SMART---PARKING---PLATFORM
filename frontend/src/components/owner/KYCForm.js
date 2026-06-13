import React, { useState, useEffect } from 'react';
import { kycService } from '../../services/kycService';
import { FaCheckCircle, FaClock, FaIdCard, FaFileAlt, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';

const KYCForm = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    aadharNumber: '', aadharName: '',
    panNumber: '', panName: ''
  });
  const [files, setFiles] = useState({
    aadharFront: null, aadharBack: null, panImage: null
  });

  useEffect(() => { loadKYCStatus(); }, []);

  const loadKYCStatus = async () => {
    try {
      const response = await kycService.getKYCStatus();
      setStatus(response.data);
    } catch (error) { console.error(error); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) submitData.append(key, formData[key]);
    });
    Object.keys(files).forEach(key => {
      if (files[key]) submitData.append(key, files[key]);
    });
    
    try {
      await kycService.submitKYC(submitData);
      toast.success('KYC submitted successfully!');
      loadKYCStatus();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  if (status?.kycStatus === 'verified') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold">KYC Verified! ✅</h2>
        <p className="text-gray-600">Your account is verified. Badge: {status.verifiedBadge}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">KYC Verification</h2>
      <p className="text-gray-500 mb-6">Submit your documents for verification</p>

      {status?.kycStatus === 'submitted' && (
        <div className="bg-yellow-100 p-4 rounded-lg mb-6 flex items-center gap-2">
          <FaClock /> KYC submitted. Awaiting admin approval.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Aadhar Section */}
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><FaIdCard className="text-blue-600" /> Aadhar Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="aadharNumber" placeholder="Aadhar Number" onChange={handleChange} className="border rounded-lg p-2" required />
            <input name="aadharName" placeholder="Name on Aadhar" onChange={handleChange} className="border rounded-lg p-2" required />
            <div><label className="text-sm">Front Side</label><input type="file" name="aadharFront" onChange={handleFileChange} className="border rounded-lg p-2 w-full" /></div>
            <div><label className="text-sm">Back Side</label><input type="file" name="aadharBack" onChange={handleFileChange} className="border rounded-lg p-2 w-full" /></div>
          </div>
        </div>

        {/* PAN Section */}
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><FaFileAlt className="text-orange-600" /> PAN Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="panNumber" placeholder="PAN Number" onChange={handleChange} className="border rounded-lg p-2" required />
            <input name="panName" placeholder="Name on PAN" onChange={handleChange} className="border rounded-lg p-2" required />
            <div className="col-span-2"><input type="file" name="panImage" onChange={handleFileChange} className="border rounded-lg p-2 w-full" /></div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
          {loading ? 'Submitting...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  );
};

export default KYCForm;