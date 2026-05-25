import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { FaCamera, FaCheckCircle, FaUser, FaCar, FaClock, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import { bookingService } from '../../services/bookingService';
import toast from 'react-hot-toast';

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [scanning, setScanning] = useState(true);
  const [lastScanned, setLastScanned] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleScan = async (data) => {
    if (data && data.text && !verifying) {
      try {
        setVerifying(true);
        const bookingData = JSON.parse(data.text);
        
        // ✅ Use bookingService to verify
        const result = await bookingService.verifyBooking(bookingData.bookingId);
        
        if (result.success) {
          setLastScanned({ ...bookingData, ...result.data });
          setScanning(false);
          toast.success(`✅ Booking verified for ${bookingData.userName || 'User'}`);
          
          if (onScanSuccess) {
            onScanSuccess(bookingData);
          }
        } else {
          toast.error('❌ Invalid or expired booking!');
        }
      } catch (error) {
        console.error('Invalid QR data:', error);
        toast.error(error.response?.data?.error || 'Invalid QR code');
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleError = (err) => {
    console.error('Scanner error:', err);
    if (onScanError) {
      onScanError(err);
    }
  };

  const startNewScan = () => {
    setScanning(true);
    setLastScanned(null);
  };

  const previewStyle = {
    height: 400,
    width: '100%',
    objectFit: 'cover'
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <h3 className="text-white font-semibold flex items-center gap-2 text-lg">
          <FaCamera /> Scan QR Code
        </h3>
        <p className="text-blue-100 text-sm">Position the QR code in front of the camera to verify customer</p>
      </div>

      {scanning ? (
        <div className="relative">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
            constraints={{
              video: { facingMode: 'environment' }
            }}
          />
          <div className="absolute inset-0 border-4 border-blue-500 pointer-events-none m-8 rounded-lg animate-pulse"></div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="inline-flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Camera Active
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {lastScanned && (
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCheckCircle className="text-green-500 text-5xl" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-center text-green-600 mb-2">Verified!</h4>
              <p className="text-center text-gray-500 mb-4">Customer booking confirmed</p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Customer Name</p>
                    <p className="font-semibold">{lastScanned.user?.name || lastScanned.userName || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCar className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Vehicle Details</p>
                    <p className="font-semibold">{lastScanned.vehicleNumber} ({lastScanned.vehicleType})</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FaMapMarkerAlt className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Parking Location</p>
                    <p className="font-semibold">{lastScanned.parking?.name || lastScanned.parkingName || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <FaClock className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Booking Time</p>
                    <p className="font-semibold">{new Date(lastScanned.startTime).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <FaRupeeSign className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount Paid</p>
                    <p className="font-semibold text-lg text-green-600">₹{lastScanned.totalAmount}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={startNewScan}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
              >
                Scan Another QR Code
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRScanner;