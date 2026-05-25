import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { FaDownload, FaPrint, FaShare, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const QRCodeDisplay = ({ booking, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (booking) {
      generateQRCode();
    }
  }, [booking]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      
      const qrData = {
        bookingId: booking._id,
        userId: booking.userId?._id || booking.userId,
        userName: booking.userId?.name || 'User',
        userEmail: booking.userId?.email || '',
        userPhone: booking.userId?.phone || '',
        vehicleNumber: booking.vehicleNumber,
        vehicleType: booking.vehicleType,
        parkingName: booking.parkingId?.name,
        parkingAddress: booking.parkingId?.address,
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalAmount: booking.totalAmount,
        status: booking.status,
        createdAt: booking.createdAt,
        timestamp: new Date().toISOString()
      };

      const qrString = JSON.stringify(qrData);
      const qrImage = await QRCode.toDataURL(qrString, {
        width: 350,
        margin: 2,
        color: {
          dark: '#1e3a8a',
          light: '#ffffff'
        }
      });
      
      setQrCodeUrl(qrImage);
    } catch (error) {
      console.error('QR Generation Error:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `parking_booking_${booking._id}.png`;
    link.href = qrCodeUrl;
    link.click();
    toast.success('QR Code downloaded!');
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Parking Booking QR Code</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              font-family: 'Segoe UI', Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              text-align: center;
              background: white;
              padding: 30px;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 500px;
            }
            h1 {
              color: #1e3a8a;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              margin-bottom: 20px;
            }
            img {
              width: 280px;
              height: 280px;
              margin: 20px auto;
              border: 3px solid #1e3a8a;
              border-radius: 20px;
            }
            .info {
              text-align: left;
              background: #f8fafc;
              padding: 15px;
              border-radius: 10px;
              margin-top: 20px;
            }
            .info p {
              margin: 8px 0;
              font-size: 14px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🅿️ ParkShare</h1>
            <div class="subtitle">Parking Booking Pass</div>
            <img src="${qrCodeUrl}" />
            <div class="info">
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Parking:</strong> ${booking.parkingId?.name || 'N/A'}</p>
              <p><strong>Vehicle:</strong> ${booking.vehicleNumber} (${booking.vehicleType})</p>
              <p><strong>Start Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
              <p><strong>End Time:</strong> ${new Date(booking.endTime).toLocaleString()}</p>
              <p><strong>Amount:</strong> ₹${booking.totalAmount}</p>
            </div>
            <div class="footer">Show this QR code at the parking entrance</div>
          </div>
        </body>
      </html>
    `);
    printWindow.print();
    printWindow.close();
  };

  const shareOnWhatsApp = () => {
    const text = `🅿️ *ParkShare Booking Confirmation*\n\nBooking ID: ${booking._id}\nParking: ${booking.parkingId?.name}\nVehicle: ${booking.vehicleNumber}\nTime: ${new Date(booking.startTime).toLocaleString()}\nAmount: ₹${booking.totalAmount}\n\nShow this QR code at the entrance.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Generating QR Code...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
        <p className="text-gray-500 text-sm">Your parking slot has been booked successfully</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <img 
          src={qrCodeUrl} 
          alt="Booking QR Code" 
          className="w-64 h-64 border-4 border-blue-500 rounded-xl shadow-lg"
        />
      </div>

      {/* Booking Details */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-gray-500">Booking ID:</p>
          <p className="text-gray-800 font-mono text-xs">{booking._id?.slice(-8)}</p>
          
          <p className="text-gray-500">Parking:</p>
          <p className="text-gray-800 font-medium">{booking.parkingId?.name}</p>
          
          <p className="text-gray-500">Vehicle:</p>
          <p className="text-gray-800">{booking.vehicleNumber} ({booking.vehicleType})</p>
          
          <p className="text-gray-500">Date:</p>
          <p className="text-gray-800">{new Date(booking.startTime).toLocaleDateString()}</p>
          
          <p className="text-gray-500">Time:</p>
          <p className="text-gray-800">{new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}</p>
          
          <p className="text-gray-500">Amount:</p>
          <p className="text-gray-800 font-bold text-blue-600">₹{booking.totalAmount}</p>
          
          <p className="text-gray-500">Status:</p>
          <p className="text-green-600 font-semibold">{booking.status}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={downloadQRCode}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaDownload /> Download
        </button>
        <button
          onClick={printQRCode}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          <FaPrint /> Print
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={shareOnWhatsApp}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <FaWhatsapp /> WhatsApp
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Show this QR code at the parking entrance for verification
      </p>
    </div>
  );
};

export default QRCodeDisplay;