const Booking = require('../models/Booking');
const User = require('../models/User');
const Parking = require('../models/Parking');
const cron = require('node-cron');

// Send booking reminders (SMS/Email/WhatsApp)
const sendReminder = async (booking, type) => {
  try {
    const user = await User.findById(booking.userId);
    const parking = await Parking.findById(booking.parkingId);
    
    if (!user || !parking) return false;
    
    console.log(`📧 Reminder to ${user.email}: ${type} for booking ${booking._id}`);
    console.log(`   Parking: ${parking.name}, Time: ${new Date(booking.startTime).toLocaleString()}`);
    
    // In production, integrate with actual APIs:
    // - Email: nodemailer
    // - SMS: Twilio
    // - WhatsApp: WhatsApp Business API
    
    // Example email template (would use nodemailer)
    // await sendEmail(user.email, `Parking Reminder`, emailHtml);
    
    return true;
  } catch (error) {
    console.error('Send reminder error:', error);
    return false;
  }
};

// ✅ EXTEND BOOKING FUNCTION
const extendBooking = async (req, res) => {
  try {
    const { bookingId, additionalHours } = req.body;
    
    if (!bookingId || !additionalHours) {
      return res.status(400).json({ 
        success: false, 
        error: 'Booking ID and additional hours are required' 
      });
    }
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    // Check if booking is confirmed
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ 
        success: false, 
        error: 'Only confirmed bookings can be extended' 
      });
    }
    
    const newEndTime = new Date(booking.endTime);
    newEndTime.setHours(newEndTime.getHours() + additionalHours);
    
    const parking = await Parking.findById(booking.parkingId);
    if (!parking) {
      return res.status(404).json({ success: false, error: 'Parking not found' });
    }
    
    const additionalAmount = additionalHours * parking.pricePerHour;
    
    // Update booking
    booking.endTime = newEndTime;
    booking.totalAmount += additionalAmount;
    booking.extendRequested = true;
    booking.extendDuration = additionalHours;
    booking.extendedEndTime = newEndTime;
    
    await booking.save();
    
    // Send confirmation
    await sendReminder(booking, `Booking extended by ${additionalHours} hours`);
    
    res.json({
      success: true,
      message: `Booking extended by ${additionalHours} hours`,
      data: {
        bookingId: booking._id,
        newEndTime: booking.endTime,
        additionalAmount,
        totalAmount: booking.totalAmount
      }
    });
  } catch (error) {
    console.error('Extend booking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ TRAFFIC DELAY ALERT FUNCTION
const sendTrafficAlert = async (req, res) => {
  try {
    const { bookingId, delayMinutes } = req.body;
    
    if (!bookingId || !delayMinutes) {
      return res.status(400).json({ 
        success: false, 
        error: 'Booking ID and delay minutes are required' 
      });
    }
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    const user = await User.findById(booking.userId);
    const parking = await Parking.findById(booking.parkingId);
    
    if (!user || !parking) {
      return res.status(404).json({ success: false, error: 'User or Parking not found' });
    }
    
    // Send traffic alert notification
    await sendReminder(booking, `🚦 Traffic alert! You may be ${delayMinutes} minutes late to ${parking.name}`);
    
    booking.trafficAlertSent = true;
    await booking.save();
    
    res.json({
      success: true,
      message: 'Traffic alert sent to user',
      data: { bookingId, delayMinutes }
    });
  } catch (error) {
    console.error('Traffic alert error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ START REMINDER SCHEDULER
const startReminderScheduler = () => {
  console.log('⏰ Starting reminder scheduler...');
  
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000);
      const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000);
      
      // 30 minutes before booking starts
      const bookings30Min = await Booking.find({
        startTime: { $lte: thirtyMinutesLater, $gt: now },
        status: 'confirmed',
        reminder30MinSent: { $ne: true }
      });
      
      for (const booking of bookings30Min) {
        await sendReminder(booking, '⏰ Your parking starts in 30 minutes');
        booking.reminder30MinSent = true;
        await booking.save();
        console.log(`✅ 30-min reminder sent for booking ${booking._id}`);
      }
      
      // 15 minutes before booking ends
      const bookings15Min = await Booking.find({
        endTime: { $lte: fifteenMinutesLater, $gt: now },
        status: 'confirmed',
        reminder15MinSent: { $ne: true }
      });
      
      for (const booking of bookings15Min) {
        await sendReminder(booking, '⚠️ Your parking ends in 15 minutes. You can extend now!');
        booking.reminder15MinSent = true;
        await booking.save();
        console.log(`✅ 15-min reminder sent for booking ${booking._id}`);
      }
      
      // Handle expired bookings (auto-complete)
      const expiredBookings = await Booking.find({
        endTime: { $lt: now },
        status: 'confirmed'
      });
      
      for (const booking of expiredBookings) {
        booking.status = 'completed';
        booking.completedAt = now;
        await booking.save();
        console.log(`✅ Booking ${booking._id} automatically completed (expired)`);
      }
      
    } catch (error) {
      console.error('Reminder scheduler error:', error);
    }
  });
  
  console.log('✅ Reminder scheduler started successfully');
};

// ✅ GET UPCOMING REMINDERS FOR USER
const getUserReminders = async (req, res) => {
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60000);
    
    const upcomingBookings = await Booking.find({
      userId: req.user.id,
      startTime: { $gt: now, $lt: oneHourLater },
      status: 'confirmed',
      reminder30MinSent: false
    }).populate('parkingId', 'name address');
    
    res.json({
      success: true,
      count: upcomingBookings.length,
      data: upcomingBookings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ MANUALLY TRIGGER REMINDER (for testing)
const triggerReminder = async (req, res) => {
  try {
    const { bookingId, reminderType } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    let message = '';
    switch(reminderType) {
      case '30min':
        message = 'Your parking starts in 30 minutes';
        break;
      case '15min':
        message = 'Your parking ends in 15 minutes';
        break;
      case 'traffic':
        message = 'Traffic delay expected on your route';
        break;
      default:
        message = 'Parking reminder';
    }
    
    await sendReminder(booking, message);
    
    res.json({
      success: true,
      message: `Reminder sent successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { 
  startReminderScheduler, 
  extendBooking, 
  sendTrafficAlert,
  getUserReminders,
  triggerReminder
};