const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Smart Parking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

// Send booking confirmation
const sendBookingConfirmation = async (user, booking, parking) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">✅ Booking Confirmed!</h2>
      <p>Dear ${user.name},</p>
      <p>Your parking slot has been successfully booked.</p>
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">Booking Details:</h3>
        <p><strong>Parking:</strong> ${parking.name}</p>
        <p><strong>Address:</strong> ${parking.address}</p>
        <p><strong>Vehicle:</strong> ${booking.vehicleNumber} (${booking.vehicleType})</p>
        <p><strong>Time:</strong> ${new Date(booking.startTime).toLocaleString()} - ${new Date(booking.endTime).toLocaleString()}</p>
        <p><strong>Amount:</strong> ₹${booking.totalAmount}</p>
      </div>
      
      <p>Please show this email or your QR code at the entrance.</p>
      <p>Thank you for choosing Smart Parking!</p>
    </div>
  `;
  
  return await sendEmail(user.email, 'Booking Confirmation - Smart Parking', html);
};

// Send booking cancellation
const sendCancellationEmail = async (user, booking, parking) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444;">❌ Booking Cancelled</h2>
      <p>Dear ${user.name},</p>
      <p>Your booking has been cancelled successfully.</p>
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">Cancelled Booking:</h3>
        <p><strong>Parking:</strong> ${parking.name}</p>
        <p><strong>Date:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
        <p><strong>Refund Amount:</strong> ₹${booking.totalAmount}</p>
      </div>
      
      <p>Refund will be processed within 5-7 business days.</p>
      <p>We hope to serve you again!</p>
    </div>
  `;
  
  return await sendEmail(user.email, 'Booking Cancelled - Smart Parking', html);
};

module.exports = { sendBookingConfirmation, sendCancellationEmail };