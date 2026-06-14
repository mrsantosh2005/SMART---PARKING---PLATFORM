import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { FaCheckCircle, FaUser, FaCar, FaClock, FaMapMarkerAlt, FaRupeeSign, FaSync } from 'react-icons/fa';
import toast from 'react-hot-toast';

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [scanning, setScanning] = useState(true);
  const [lastScanned, setLastScanned] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const handleScan = async (result) => {
    if (result && !verifying) {
      setVerifying(true);
      try {
        let bookingId = result;
        try {
          const parsed = JSON.parse(result);
          bookingId = parsed.bookingId || parsed._id || result;
        } catch (e) {}

        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
        
        const response = await fetch(`${API_URL}/bookings/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ bookingId })
        });

        const data = await response.json();

        if (data.success) {
          setLastScanned(data.data);
          setScanning(false);
          toast.success(`✅ Booking verified!`);
          if (onScanSuccess) onScanSuccess(data.data);
        } else {
          toast.error(data.error || 'Invalid booking');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Failed to verify booking');
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleError = (error) => {
    console.error('Scanner error:', error);
    setCameraError(error?.message || 'Camera access denied');
    if (onScanError) onScanError(error);
  };

  const startNewScan = () => {
    setScanning(true);
    setLastScanned(null);
    setCameraError(null);
  };

  if (!scanning && lastScanned) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center">
          <div className="bg-green-100 p-3 rounded-full inline-flex mb-4">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Verified!</h3>
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-4">
            <p><strong>Customer:</strong> {lastScanned.user?.name || 'N/A'}</p>
            <p><strong>Vehicle:</strong> {lastScanned.vehicleNumber}</p>
            <p><strong>Parking:</strong> {lastScanned.parking?.name || lastScanned.parkingName}</p>
            <p><strong>Time:</strong> {new Date(lastScanned.startTime).toLocaleString()}</p>
            <p><strong>Amount:</strong> ₹{lastScanned.totalAmount}</p>
          </div>
          <button onClick={startNewScan} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FaSync className="inline mr-2" /> Scan Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <h3 className="text-white font-semibold text-lg">QR Code Scanner</h3>
        <p className="text-blue-100 text-sm">Position QR code in front of camera</p>
      </div>
      <div className="p-4">
        {cameraError ? (
          <div className="text-center py-8 text-red-500">
            <p>Camera Error: {cameraError}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Retry
            </button>
          </div>
        ) : (
          <Scanner
            onScan={handleScan}
            onError={handleError}
            constraints={{ facingMode: 'environment' }}
          />
        )}
        {verifying && (
          <div className="text-center mt-4 text-gray-500">
            <div className="animate-spin inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
            Verifying...
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;