import React, { useState, useEffect } from 'react';
import { kycService } from '../../services/kycService';
import { FaCheckCircle, FaTimesCircle, FaEye, FaUserCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const KYCApproval = () => {
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('basic');

  useEffect(() => {
    loadPendingKYC();
  }, []);

  const loadPendingKYC = async () => {
    try {
      setLoading(true);
      const response = await kycService.getPendingKYC();
      setPendingOwners(response.data);
    } catch (error) {
      toast.error('Failed to load pending KYC');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, approved) => {
    try {
      await kycService.verifyKYC(userId, approved, rejectionReason, selectedBadge);
      toast.success(approved ? 'KYC approved!' : 'KYC rejected');
      loadPendingKYC();
      setSelectedOwner(null);
      setRejectionReason('');
    } catch (error) {
      toast.error('Failed to process KYC');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6">KYC Verification Requests</h2>
      
      {pendingOwners.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No pending KYC requests
        </div>
      ) : (
        <div className="space-y-4">
          {pendingOwners.map((owner) => (
            <div key={owner._id} className="border rounded-xl p-4 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{owner.name}</h3>
                  <p className="text-gray-500">{owner.email}</p>
                  <p className="text-gray-500">{owner.phone}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Submitted: {new Date(owner.kycSubmittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOwner(owner)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaEye /> Review
                  </button>
                </div>
              </div>
              
              {/* Documents Preview */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  {owner.kycDocuments?.aadharCard?.number ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-gray-300" />}
                  <span>Aadhar: {owner.kycDocuments?.aadharCard?.number ? 'Submitted' : 'Missing'}</span>
                </div>
                <div className="flex items-center gap-1">
                  {owner.kycDocuments?.panCard?.number ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-gray-300" />}
                  <span>PAN: {owner.kycDocuments?.panCard?.number ? 'Submitted' : 'Missing'}</span>
                </div>
                <div className="flex items-center gap-1">
                  {owner.kycDocuments?.gstCertificate?.number ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-gray-300" />}
                  <span>GST: {owner.kycDocuments?.gstCertificate?.number || 'Optional'}</span>
                </div>
                <div className="flex items-center gap-1">
                  {owner.kycDocuments?.propertyProof?.image ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-gray-300" />}
                  <span>Property: {owner.kycDocuments?.propertyProof?.image ? 'Submitted' : 'Missing'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Review Modal */}
      {selectedOwner && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold mb-4">Review KYC Documents</h3>
            
            <div className="space-y-4">
              <div className="border-b pb-3">
                <p><strong>Name:</strong> {selectedOwner.name}</p>
                <p><strong>Email:</strong> {selectedOwner.email}</p>
                <p><strong>Phone:</strong> {selectedOwner.phone}</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Aadhar Card</h4>
                <p>Number: {selectedOwner.kycDocuments?.aadharCard?.number}</p>
                <p>Name: {selectedOwner.kycDocuments?.aadharCard?.name}</p>
              </div>
              
              <div>
                <h4 className="font-semibold">PAN Card</h4>
                <p>Number: {selectedOwner.kycDocuments?.panCard?.number}</p>
                <p>Name: {selectedOwner.kycDocuments?.panCard?.name}</p>
              </div>
              
              {selectedOwner.kycDocuments?.gstCertificate?.number && (
                <div>
                  <h4 className="font-semibold">GST Certificate</h4>
                  <p>Number: {selectedOwner.kycDocuments?.gstCertificate?.number}</p>
                  <p>Business: {selectedOwner.kycDocuments?.gstCertificate?.businessName}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold">Verification Badge</h4>
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full"
                >
                  <option value="basic">Basic 🥉</option>
                  <option value="silver">Silver 🥈</option>
                  <option value="gold">Gold 🥇</option>
                  <option value="platinum">Platinum 👑</option>
                </select>
              </div>
              
              <div>
                <label className="block font-semibold mb-1">Rejection Reason (if rejecting)</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                  rows="2"
                  placeholder="Enter reason for rejection..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleVerify(selectedOwner._id, true)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FaUserCheck /> Approve KYC
                </button>
                <button
                  onClick={() => handleVerify(selectedOwner._id, false)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <FaTimesCircle /> Reject
                </button>
                <button
                  onClick={() => setSelectedOwner(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCApproval;