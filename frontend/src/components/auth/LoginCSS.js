import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import ElectricBorder from '../common/ElectricBorder'; // ✅ Import karo
import { 
  FaEnvelope, FaLock, FaArrowRight, FaGoogle, 
  FaFacebookF, FaGithub, FaEye, FaEyeSlash, 
  FaParking, FaShieldAlt, FaUserPlus 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const LoginCSS = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful! Welcome back! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background - same as before */}
      <div className="absolute inset-0 gradient-bg">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Floating bubbles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 10 + 's'
            }}
          />
        ))}
      </div>

      {/* Login Card with Electric Border */}
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          {/* ✅ ElectricBorder Wrapper - Login Card Ke Around */}
          <ElectricBorder
            color="#7df9ff"
            speed={1}
            chaos={0.15}
            thickness={3}
            style={{ borderRadius: '32px' }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              {/* Logo Section */}
              <div className="text-center mb-8">
                <motion.div 
                  className="inline-flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full shadow-2xl">
                      <FaParking className="text-white text-4xl" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.h2 
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome Back
                </motion.h2>
                
                <motion.p 
                  className="text-white/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Sign in to continue your parking journey
                </motion.p>
              </div>

              {/* Trust Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-lg">
                  <FaShieldAlt className="text-green-300 mr-2 text-sm animate-pulse" />
                  <span className="text-white/90 text-xs font-medium">Secure Login • 256-bit Encryption</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition"></div>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition"></div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <FaEyeSlash className="text-white/50" /> : <FaEye className="text-white/50" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-white/70">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-white/70 hover:text-white">Forgot password?</a>
                </div>

                {/* Sign In Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold text-white btn-hover"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">Sign In <FaArrowRight className="ml-2" /></span>
                  )}
                </motion.button>
              </form>

              {/* Social Login */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/60">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[FaGoogle, FaFacebookF, FaGithub].map((Icon, i) => (
                  <motion.button
                    key={i}
                    className="flex items-center justify-center py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="text-white text-xl" />
                  </motion.button>
                ))}
              </div>

              {/* Sign Up Link */}
              <motion.div className="mt-6 text-center">
                <Link to="/register" className="flex items-center justify-center text-white/80 hover:text-white">
                  <FaUserPlus className="mr-2" />
                  Create New Account
                  <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
            </div>
          </ElectricBorder>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginCSS;