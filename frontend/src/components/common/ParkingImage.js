import React, { useState, useEffect } from 'react';

// AI-generated image prompts for different parking types
const getAIParkingImage = (name, parkingId) => {
  // Clean the name for URL
  const cleanName = name.replace(/\s/g, '%20').replace(/[^\w\s%20]/gi, '');
  
  // Different prompts based on first character of ID (for variety)
  const prompts = [
    `modern%20parking%20lot%20with%20${cleanName}%20professional%20photography%20sunny%20day`,
    `underground%20parking%20garage%20with%20${cleanName}%20bright%20LED%20lights%20clean`,
    `smart%20parking%20system%20with%20digital%20display%20${cleanName}%20futuristic`,
    `aerial%20view%20of%20${cleanName}%20parking%20lot%20with%20cars%20organized%20rows`,
    `night%20time%20parking%20garage%20with%20${cleanName}%20neon%20lights%20cinematic`,
    `eco-friendly%20parking%20lot%20with%20${cleanName}%20solar%20panels%20green%20plants`
  ];
  
  // Use parkingId to get consistent image for same parking
  const index = (parkingId?.length || 0) % prompts.length;
  const selectedPrompt = prompts[index];
  
  // Pollinations.ai URL (free, no API key needed)
  return `https://image.pollinations.ai/prompt/${selectedPrompt}?width=800&height=500&nologo=true`;
};

const ParkingImage = ({ parkingId, name, className = '' }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (parkingId && name) {
      const url = getAIParkingImage(name, parkingId);
      setImageUrl(url);
      
      // Preload image to check if it loads
      const img = new Image();
      img.onload = () => setLoading(false);
      img.onerror = () => {
        setError(true);
        setLoading(false);
      };
      img.src = url;
    }
  }, [parkingId, name]);

  // Fallback image if AI image fails
  const fallbackImages = [
    'https://images.unsplash.com/photo-1470224114660-3f6686c56285?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
  ];
  
  const fallbackUrl = fallbackImages[(parkingId?.charCodeAt(0) || 0) % fallbackImages.length];

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={error ? fallbackUrl : imageUrl}
      alt={name}
      className={`w-full h-full object-cover transition-transform duration-300 hover:scale-110 ${className}`}
      onError={(e) => {
        e.target.src = fallbackUrl;
        setError(true);
      }}
    />
  );
};

export default ParkingImage;