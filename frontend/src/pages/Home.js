import React from 'react';
import ParkingList from '../components/user/ParkingList';
import Ballpit from '../components/common/Ballpit';

const Home = () => {
  return (
    <div className="relative min-h-screen">
      {/* Ballpit 3D Background */}
      <Ballpit 
        className="fixed top-0 left-0 w-full h-full"
        followCursor={true}
        colors={[0x3b82f6, 0x8b5cf6, 0xec4899]}
      />
      
      {/* Overlay Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <ParkingList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;