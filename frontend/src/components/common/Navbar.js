import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaParking, 
  FaUser, 
  FaSignOutAlt, 
  FaSearch, 
  FaTachometerAlt, 
  FaPlusCircle, 
  FaBookmark,
  FaCrown,
  FaBell,
  FaBars,
  FaTimes,
  FaChevronDown
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Agar user nahi hai to navbar mat dikhao
  if (!user) {
    return null;
  }

  // Animation variants
  const navVariants = {
    initial: { y: -100 },
    animate: { 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
        duration: 0.5 
      }
    }
  };

  const logoVariants = {
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const linkVariants = {
    hover: { 
      scale: 1.05,
      color: "#BFDBFE",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.15 }
    }
  };

  const notificationVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: { 
        duration: 1,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  const getNavLinks = () => {
    const links = [
      { to: "/parkings", label: "Find Parking", icon: <FaSearch className="mr-2" />, role: "all" }
    ];

    if (user.role === 'owner') {
      links.push(
        { to: "/owner/dashboard", label: "Dashboard", icon: <FaTachometerAlt className="mr-2" />, role: "owner" },
        { to: "/owner/add-parking", label: "Add Parking", icon: <FaPlusCircle className="mr-2" />, role: "owner" }
      );
    }

    if (user.role === 'admin') {
      links.push(
        { to: "/admin/dashboard", label: "Admin Panel", icon: <FaCrown className="mr-2" />, role: "admin" }
      );
    }

    if (user.role === 'user') {
      links.push(
        { to: "/user/bookings", label: "My Bookings", icon: <FaBookmark className="mr-2" />, role: "user" }
      );
    }

    return links;
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="initial"
      animate="animate"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gradient-to-r from-blue-700 to-blue-800 shadow-2xl' 
          : 'bg-gradient-to-r from-blue-600 to-blue-700'
      } text-white`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.5
                }}
              >
                <FaParking className="text-2xl group-hover:text-yellow-300 transition-colors" />
              </motion.div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                SmartPark
              </span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {getNavLinks().map((link) => (
              <motion.div
                key={link.to}
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link 
                  to={link.to} 
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'bg-white/20 text-white shadow-md'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Notifications */}
            <motion.div 
              className="relative"
              variants={linkVariants}
              whileHover="hover"
            >
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                <FaBell className="text-xl" />
                {notifications > 0 && (
                  <motion.span
                    variants={notificationVariants}
                    animate="animate"
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {notifications}
                  </motion.span>
                )}
              </button>
            </motion.div>

            {/* User Dropdown */}
            <div className="relative">
              <motion.button
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline">{user.name}</span>
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown className="text-sm" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      {getNavLinks().map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <span className="mr-3 text-gray-400">{link.icon}</span>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <motion.div 
              className="relative"
              variants={linkVariants}
              whileHover="hover"
            >
              <button className="relative p-2">
                <FaBell className="text-xl" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </motion.div>

            <motion.button
              variants={logoVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-white/20">
                {/* User Info Mobile */}
                <div className="flex items-center space-x-3 px-4 py-3 mb-3 bg-white/10 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-blue-200 capitalize">{user.role}</p>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                {getNavLinks().map((link) => (
                  <motion.div
                    key={link.to}
                    variants={mobileItemVariants}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === link.to
                          ? 'bg-white/20'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Logout Mobile */}
                <motion.div variants={mobileItemVariants}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 transition-colors"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Border Bottom */}
      <motion.div 
        className="h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </motion.nav>
  );
};

export default Navbar;