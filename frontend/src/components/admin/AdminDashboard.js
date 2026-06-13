import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserTie, FaParking, FaDollarSign, FaCheck, FaIdCard, FaEye, FaTimes } from 'react-icons/fa';
import { adminService } from '../../services/adminService';
import { kycService } from '../../services/kycService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingOwners, setPendingOwners] = useState([]);
  const [pendingKYC, setPendingKYC] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kyc');
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('basic');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, pendingData, kycData] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingOwners(),
        kycService.getPendingKYC()
      ]);
      setStats(statsData.data);
      setPendingOwners(pendingData.data);
      setPendingKYC(kycData.data || []);
      console.log('Pending KYC:', kycData.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOwner = async (ownerId) => {
    try {
      await adminService.approveOwner(ownerId);
      toast.success('Owner approved successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to approve owner');
    }
  };

  const handleViewKYCDetails = async (userId) => {
    try {
      const response = await kycService.getKYCDetails(userId);
      setSelectedKYC(response.data);
    } catch (error) {
      toast.error('Failed to load KYC details');
    }
  };

  const handleVerifyKYC = async (approved) => {
    try {
      await kycService.verifyKYC(selectedKYC._id, approved, rejectionReason, selectedBadge);
      toast.success(approved ? 'KYC approved!' : 'KYC rejected');
      setSelectedKYC(null);
      loadData();
    } catch (error) {
      toast.error('Failed to process KYC');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 rounded-xl p-6 text-white"><div><p className="text-sm">Total Users</p><p className="text-3xl font-bold">{stats.totalUsers}</p></div></div>
          <div className="bg-green-500 rounded-xl p-6 text-white"><div><p className="text-sm">Total Owners</p><p className="text-3xl font-bold">{stats.totalOwners}</p></div></div>
          <div className="bg-purple-500 rounded-xl p-6 text-white"><div><p className="text-sm">Total Parkings</p><p className="text-3xl font-bold">{stats.totalParkings}</p></div></div>
          <div className="bg-yellow-500 rounded-xl p-6 text-white"><div><p className="text-sm">Total Revenue</p><p className="text-3xl font-bold">₹{stats.totalRevenue}</p></div></div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button onClick={() => setActiveTab('kyc')} className={`px-6 py-2 ${activeTab === 'kyc' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
          KYC Verification ({pendingKYC.length})
        </button>
        <button onClick={() => setActiveTab('owner')} className={`px-6 py-2 ${activeTab === 'owner' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
          Owner Approval ({pendingOwners.length})
        </button>
      </div>

      {/* KYC Tab */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending KYC Submissions</h2>
          {pendingKYC.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pending KYC submissions</div>
          ) : (
            pendingKYC.map((owner) => (
              <div key={owner._id} className="bg-white rounded-xl shadow p-4 border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{owner.name}</h3>
                    <p className="text-gray-600">{owner.email}</p>
                    <p className="text-gray-500 text-sm">{owner.phone}</p>
                  </div>
                  <button onClick={() => handleViewKYCDetails(owner._id)} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1">
                    <FaEye /> Review
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-400">Submitted: {new Date(owner.kycSubmittedAt).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Owner Approval Tab */}
      {activeTab === 'owner' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Owner Approvals</h2>
          {pendingOwners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pending owner approvals</div>
          ) : (
            pendingOwners.map((owner) => (
              <div key={owner._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                <div><h3 className="font-semibold">{owner.name}</h3><p>{owner.email}</p><p>{owner.phone}</p></div>
                <button onClick={() => handleApproveOwner(owner._id)} className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
                  <FaCheck /> Approve Owner
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* KYC Details Modal */}
      {selectedKYC && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">KYC Details</h2>
              <button onClick={() => setSelectedKYC(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p><strong>Name:</strong> {selectedKYC.name}</p>
              <p><strong>Email:</strong> {selectedKYC.email}</p>
              <p><strong>Phone:</strong> {selectedKYC.phone}</p>
            </div>
            
            {selectedKYC.documents?.aadhar?.submitted && (
              <div className="border p-4 rounded-lg mb-3">
                <h3 className="font-semibold">Aadhar Card</h3>
                <p>Number: {selectedKYC.documents.aadhar.number}</p>
                <p>Name: {selectedKYC.documents.aadhar.name}</p>
              </div>
            )}
            
            {selectedKYC.documents?.pan?.submitted && (
              <div className="border p-4 rounded-lg mb-3">
                <h3 className="font-semibold">PAN Card</h3>
                <p>Number: {selectedKYC.documents.pan.number}</p>
                <p>Name: {selectedKYC.documents.pan.name}</p>
              </div>
            )}
            
            <div className="mt-4">
              <label className="font-semibold">Verification Badge</label>
              <select value={selectedBadge} onChange={(e) => setSelectedBadge(e.target.value)} className="w-full border rounded-lg p-2 mt-1">
                <option value="basic">Basic 🥉</option>
                <option value="silver">Silver 🥈</option>
                <option value="gold">Gold 🥇</option>
                <option value="platinum">Platinum 👑</option>
              </select>
            </div>
            
            <div className="mt-3">
              <label className="font-semibold">Rejection Reason</label>
              <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full border rounded-lg p-2 mt-1" rows="2" placeholder="Enter reason for rejection..."></textarea>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => handleVerifyKYC(true)} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Approve KYC</button>
              <button onClick={() => handleVerifyKYC(false)} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;