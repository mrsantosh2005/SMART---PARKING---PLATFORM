import React from 'react';
import { Link } from 'react-router-dom';
import { FaParking, FaArrowRight, FaUserPlus, FaSignInAlt, FaShieldAlt, FaStar } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      
      {/* ========== NAVIGATION BAR ========== */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <FaParking className="text-white text-2xl" />
          </div>
          <span className="text-white text-2xl font-bold">Park<span className="text-blue-400">Share</span></span>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            to="/login" 
            className="px-5 py-2 border border-white/30 rounded-xl text-white hover:bg-white/10 transition flex items-center gap-2"
          >
            <FaSignInAlt /> Login
          </Link>
          <Link 
            to="/register" 
            className="px-5 py-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaUserPlus /> Sign Up
          </Link>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-20">
        
        {/* Badge */}
        <div className="inline-flex items-center bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-yellow-400/30">
          <span className="text-yellow-300 text-sm font-medium">⚠️ STOP GETTING PARKING CHALLANS!</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Stop Wasting Hours<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Find Parking in Minutes
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 px-4">
          Book safe, verified parking spots at homes, shops, and offices near you. 
          No more circling, no more challans, no more stress.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/register" 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 flex items-center justify-center gap-2 group"
          >
            Find Parking Now 
            <FaArrowRight className="group-hover:translate-x-1 transition" />
          </Link>
          <Link 
            to="/register?role=owner" 
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold text-lg hover:bg-white/20 transition flex items-center justify-center gap-2"
          >
            List Your Space → Earn ₹10k/month
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
            <div className="text-gray-400 text-sm">Parking Spots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">10k+</div>
            <div className="text-gray-400 text-sm">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">₹50k+</div>
            <div className="text-gray-400 text-sm">Hosts Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">99%</div>
            <div className="text-gray-400 text-sm">Safe Bookings</div>
          </div>
        </div>
      </div>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <div className="py-16 px-4 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            How <span className="text-blue-400">ParkShare</span> Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
              <div className="text-4xl text-blue-400 mb-4">📍</div>
              <h3 className="text-xl font-bold text-white mb-2">1. Find a Spot</h3>
              <p className="text-gray-400">Search by location, see available spots near you</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
              <div className="text-4xl text-blue-400 mb-4">📅</div>
              <h3 className="text-xl font-bold text-white mb-2">2. Book Instantly</h3>
              <p className="text-gray-400">Reserve your spot with secure payment</p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
              <div className="text-4xl text-blue-400 mb-4">🅿️</div>
              <h3 className="text-xl font-bold text-white mb-2">3. Park Safely</h3>
              <p className="text-gray-400">Drive to the exact location and park with peace of mind</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== FOR HOSTS SECTION ========== */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Turn Your Empty Space into <span className="text-green-400">Passive Income</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Have a driveway, empty plot, or shopfront? List it on ParkShare and earn ₹10,000+ per month!
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-green-500 text-xl">✓</span> ₹0 setup cost - start earning immediately
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-green-500 text-xl">✓</span> Free insurance coverage for your property
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-green-500 text-xl">✓</span> Set your own hours and prices
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-green-500 text-xl">✓</span> Verified guests only - 100% secure
                </li>
              </ul>
              <Link 
                to="/register?role=owner"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 rounded-xl text-white font-semibold hover:bg-green-700 transition transform hover:scale-105"
              >
                Start Earning Today <FaArrowRight />
              </Link>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500 p-2 rounded-lg">
                  <span className="text-white text-xl">💰</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Average Monthly Earnings</p>
                  <p className="text-3xl font-bold text-white">₹12,500</p>
                </div>
              </div>
              <div className="h-32 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">📊 Your earnings chart will appear here</span>
              </div>
              <p className="text-gray-400 text-sm mt-4 text-center">*Based on actual host data</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <div className="py-16 px-4 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Loved by <span className="text-yellow-400">10,000+</span> Users
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-500" />)}
              </div>
              <p className="text-gray-300 mb-4">"Saved 2 hours daily! No more circling for parking near my office."</p>
              <p className="font-semibold text-white">Rahul M.</p>
              <p className="text-gray-500 text-sm">Daily Commuter</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-500" />)}
              </div>
              <p className="text-gray-300 mb-4">"Earning ₹8000/month from my empty driveway. Best decision ever!"</p>
              <p className="font-semibold text-white">Priya S.</p>
              <p className="text-gray-500 text-sm">Homeowner</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-500" />)}
              </div>
              <p className="text-gray-300 mb-4">"My shopfront parking is always booked. Great extra income!"</p>
              <p className="font-semibold text-white">Amit K.</p>
              <p className="text-gray-500 text-sm">Shop Owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== CTA SECTION ========== */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Stop Wasting Time?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of drivers who found their perfect parking spot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition transform hover:scale-105"
              >
                Find Parking Now
              </Link>
              <Link 
                to="/register?role=owner"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition"
              >
                List Your Space
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-950 py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FaParking className="text-white" />
                </div>
                <span className="text-white font-bold text-xl">ParkShare</span>
              </div>
              <p className="text-gray-500 text-sm">India's safest parking marketplace</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li>📞 +91 12345 67890</li>
                <li>✉️ hello@parkshare.com</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-600 text-sm pt-8 border-t border-white/10">
            © 2025 ParkShare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;