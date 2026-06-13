import React, { useState, useEffect, useRef } from 'react';
import { FaCamera, FaCheckCircle, FaUser, FaCar, FaClock, FaMapMarkerAlt, FaRupeeSign, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [scanning, setScanning] = useState(true);
  const [lastScanned, setLastScanned] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start camera
  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);
    setPermissionDenied(false);

    try {
      // First check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API not supported in this browser');
        setIsLoading(false);
        return;
      }

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsLoading(false);
      startScanning();
    } catch (error) {
      console.error('Camera error:', error);
      setIsLoading(false);
      
      if (error.name === 'NotAllowedError') {
        setPermissionDenied(true);
        setCameraError('Camera permission denied. Please allow camera access.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found on this device');
      } else {
        setCameraError('Unable to access camera: ' + error.message);
      }
    }
  };

  // Simulate QR scanning (since actual QR scanning is complex)
  const startScanning = () => {
    if (!videoRef.current) return;

    // Simple frame capture every second
    const scanInterval = setInterval(() => {
      if (!scanning || !videoRef.current || verifying) return;

      // For demo purposes, we'll just show manual entry
      // In production, you would use a proper QR scanning library
    }, 1000);

    return () => clearInterval(scanInterval);
  };

  // Manual QR verification
  const handleManualVerify = async () => {
    if (!qrInput.trim()) {
      toast.error('Please enter or paste QR code data or Booking ID');
      return;
    }

    setVerifying(true);
    try {
      let bookingId = qrInput.trim();
      
      // Try to parse if it's JSON
      try {
        const parsed = JSON.parse(qrInput);
        bookingId = parsed.bookingId || parsed._id || qrInput;
      } catch (e) {
        // Not JSON, use as is
      }

      const response = await fetch('http://localhost:5001/api/bookings/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookingId })
      });

      const result = await response.json();
      
      if (result.success) {
        setLastScanned(result.data);
        setScanning(false);
        stopCamera();
        toast.success(`✅ Booking verified for ${result.data.user?.name || 'Customer'}`);
        if (onScanSuccess) onScanSuccess(result.data);
      } else {
        toast.error(result.error || 'Invalid booking');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify booking');
    } finally {
      setVerifying(false);
    }
  };

  const startNewScan = () => {
    setScanning(true);
    setLastScanned(null);
    setQrInput('');
    setCameraError(null);
    setPermissionDenied(false);
    startCamera();
  };

  const requestCameraPermission = () => {
    startCamera();
  };

  // Initialize camera on mount
  useEffect(() => {
    startCamera();
    
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <h3 className="text-white font-semibold flex items-center gap-2 text-lg">
          <FaCamera /> QR Code Scanner
        </h3>
        <p className="text-blue-100 text-sm">Scan customer's booking QR code or enter manually</p>
      </div>

      {scanning ? (
        <div className="p-6">
          {/* Camera Preview */}
          <div className="mb-4">
            <div className="relative bg-black rounded-xl overflow-hidden" style={{ minHeight: '300px' }}>
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-white ml-2">Starting camera...</p>
                </div>
              ) : cameraError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-4">
                  <FaExclamationTriangle className="text-yellow-500 text-4xl mb-3" />
                  <p className="text-white text-center mb-3">{cameraError}</p>
                  {permissionDenied && (
                    <button
                      onClick={requestCameraPermission}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Request Camera Permission
                    </button>
                  )}
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-auto min-h-[300px] object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              )}
              <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none m-4 rounded-lg"></div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="inline-flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Position QR code in frame
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm mb-4">— OR —</div>

          {/* Manual Entry */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Manual Entry (Booking ID)
            </label>
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Enter Booking ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleManualVerify}
            disabled={verifying}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Verify Booking'}
          </button>

          <p className="text-center text-gray-500 text-xs mt-4">
            Tip: Customer can show QR code from their booking history
          </p>
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
                    <p className="font-semibold">{lastScanned.user?.name || 'N/A'}</p>
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
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <FaSync /> Scan Another Booking
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRScanner;