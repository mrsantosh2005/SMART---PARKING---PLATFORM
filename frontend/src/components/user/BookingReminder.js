import React, { useState, useEffect } from 'react';
import { FaBell, FaClock, FaTrafficLight, FaExtend } from 'react-icons/fa';

const BookingReminder = ({ booking, onExtend }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showExtend, setShowExtend] = useState(false);
  const [extendHours, setExtendHours] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);
      
      if (now < start) {
        const minsLeft = Math.ceil((start - now) / (1000 * 60));
        setTimeRemaining({ type: 'start', value: minsLeft });
      } else if (now < end) {
        const minsLeft = Math.ceil((end - now) / (1000 * 60));
        setTimeRemaining({ type: 'end', value: minsLeft });
        
        // Show extend option when 30 minutes remaining
        if (minsLeft <= 30 && !showExtend) {
          setShowExtend(true);
        }
      } else {
        setTimeRemaining(null);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [booking]);

  const handleExtend = () => {
    onExtend(booking._id, extendHours);
    setShowExtend(false);
  };

  if (!timeRemaining) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg">
      <div className="flex items-start gap-3">
        <FaBell className="text-yellow-600 mt-1" />
        <div className="flex-1">
          {timeRemaining.type === 'start' ? (
            <p className="text-yellow-800">
              ⏰ Your parking starts in <strong>{timeRemaining.value} minutes</strong>
            </p>
          ) : (
            <p className="text-yellow-800">
              ⏰ Your parking ends in <strong>{timeRemaining.value} minutes</strong>
            </p>
          )}
          
          {showExtend && (
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <p className="text-sm mb-2">Need more time? Extend your booking:</p>
              <div className="flex gap-2">
                <select
                  value={extendHours}
                  onChange={(e) => setExtendHours(parseInt(e.target.value))}
                  className="px-3 py-1 border rounded"
                >
                  <option value={1}>+1 hour</option>
                  <option value={2}>+2 hours</option>
                  <option value={3}>+3 hours</option>
                  <option value={4}>+4 hours</option>
                </select>
                <button
                  onClick={handleExtend}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <FaExtend /> Extend
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingReminder;