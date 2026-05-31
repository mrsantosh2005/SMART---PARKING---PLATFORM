import React, { useState, useEffect } from 'react';
import { kycService } from '../../services/kycService';
import { FaCheckCircle, FaClock, FaIdCard, FaFileAlt, FaBuilding, FaHome, FaUpload, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const KYCForm = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    aadharNumber: '', aadharName: '',
    panNumber: '', panName: '',
    gstNumber: '', businessName: '',
    propertyType: '', propertyNumber: ''
  });
  const [files, setFiles] = useState({
    aadharFront: null, aadharBack: null, panImage: null,
    gstImage: null, propertyImage: null
  });
  const [uploadedFiles, setUploadedFiles] = useState({});

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
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [e.target.name]: file });
      setUploadedFiles({ ...uploadedFiles, [e.target.name]: file.name });
    }
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
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {status.documents?.aadhar?.submitted && <div className="bg-green-50 p-2 rounded">✅ Aadhar Verified</div>}
          {status.documents?.pan?.submitted && <div className="bg-green-50 p-2 rounded">✅ PAN Verified</div>}
          {status.documents?.gst?.submitted && <div className="bg-green-50 p-2 rounded">✅ GST Submitted</div>}
          {status.documents?.property?.submitted && <div className="bg-green-50 p-2 rounded">✅ Property Submitted</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">KYC Verification</h2>
      <p className="text-gray-500 mb-6">Submit your documents for verification (All in one form)</p>

      {status?.kycStatus === 'submitted' && (
        <div className="bg-yellow-100 p-4 rounded-lg mb-6 flex items-center gap-2">
          <FaClock /> KYC submitted. Awaiting admin approval.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Aadhar Card Section */}
        <div className="border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><FaIdCard className="text-blue-600" /> Aadhar Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="aadharNumber" placeholder="Aadhar Number" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="aadharName" placeholder="Name on Aadhar" onChange={handleChange} className="border rounded-lg p-2" />
            <div><label className="text-sm block mb-1">Front Side</label><input type="file" name="aadharFront" onChange={handleFileChange} className="border rounded-lg p-2 w-full" /></div>
            <div><label className="text-sm block mb-1">Back Side</label><input type="file" name="aadharBack" onChange={handleFileChange} className="border rounded-lg p-2 w-full" /></div>
          </div>
        </div>

        {/* PAN Card Section */}
        <div className="border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><FaFileAlt className="text-orange-600" /> PAN Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="panNumber" placeholder="PAN Number" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="panName" placeholder="Name on PAN" onChange={handleChange} className="border rounded-lg p-2" />
            <div className="md:col-span-2"><label className="text-sm block mb-1">PAN Image</label><input type="file" name="panImage" onChange={handleFileChange} className="border rounded-lg p-2 w-full" /></div>
          </div>
        </div>

        {/* GST Section (Optional) */}
        <div className="border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><FaBuilding className="text-green-600" /> GST Certificate (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="gstNumber" placeholder="GST Number" onChange={handleChange} className="border rounded-lg p-2" />
            <input name="businessName" placeholder="Business Name" onChange={handleChange} className="border rounded-lg p-2" />
            <div className="md:col-span-2"><label className="text-sm block mb-1">GST Image</label><input type="file" name="gstImage" onChange={handleFileChange} className="border rounded-lg p-2 w-full" /></div>
          </div>
        </div>

        {/* Property Proof Section (Optional) */}
        <div className="border rounded-xl p-5">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><FaHome className="text-purple-600" /> Property Proof (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="propertyType" onChange={handleChange} className="border rounded-lg p-2">
              <option value="">Select Property Type</option>
              <option value="rent_agreement">Rent Agreement</option>
              <option value="ownership_deed">Ownership Deed</option>
              <option value="shop_license">Shop License</option>
            </select>
            <input name="propertyNumber" placeholder="Document Number" onChange={handleChange} className="border rounded-lg p-2" />
            <div className="md:col-span-2"><label className="text-sm block mb-1">Property Document Image</label><input type="file" name="propertyImage" onChange={handleFileChange} className="border rounded-lg p-2 w-full" /></div>
          </div>
        </div>

        {/* Single Submit Button */}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
          {loading ? 'Submitting...' : <><FaSave /> Submit KYC Documents</>}
        </button>
      </form>
    </div>
  );
};

export default KYCForm;