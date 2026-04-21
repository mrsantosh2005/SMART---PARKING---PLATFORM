import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaEnvelope, 
  FaLock, 
  FaArrowRight,
  FaGoogle,
  FaFacebookF,
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaParking,
  FaShieldAlt,
  FaUserPlus
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const LoginCSS = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sky Blue Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-sky-500 to-blue-500">
        {/* Animated Clouds */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute animate-cloud" style={{ top: '10%', left: '-10%', width: '300px', height: '100px', background: 'rgba(255,255,255,0.3)', borderRadius: '50px' }}></div>
          <div className="absolute animate-cloud-delay" style={{ top: '30%', left: '-20%', width: '400px', height: '120px', background: 'rgba(255,255,255,0.2)', borderRadius: '60px' }}></div>
          <div className="absolute animate-cloud" style={{ top: '60%', left: '-15%', width: '350px', height: '90px', background: 'rgba(255,255,255,0.25)', borderRadius: '45px' }}></div>
        </div>

        {/* Sun */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-70 animate-pulse"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-sky-600 via-transparent to-transparent"></div>
      </div>

      {/* Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8 animate-float">
          <div className="inline-flex items-center justify-center mb-4 relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
              <FaParking className="text-white text-4xl" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Welcome Back
          </h2>
          <p className="text-white/80 drop-shadow-md">
            Sign in to continue your parking journey
          </p>
        </div>

        {/* Trust Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-lg">
            <FaShieldAlt className="text-green-300 mr-2 text-sm animate-pulse" />
            <span className="text-white/90 text-xs font-medium">Secure Login • 256-bit Encryption</span>
          </div>
        </div>

        {/* Glass Card */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-white/60 group-focus-within:text-blue-300 transition-colors" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-white/60 group-focus-within:text-blue-300 transition-colors" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-white/60 hover:text-white/90 transition-colors" />
                    ) : (
                      <FaEye className="h-5 w-5 text-white/60 hover:text-white/90 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 bg-white/20 border-white/30 rounded text-blue-500 focus:ring-blue-400"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-lg transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center px-6 py-3">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span className="text-white font-semibold">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="text-white font-semibold">Sign In</span>
                    <FaArrowRight className="ml-2 text-white group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Social Login */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/70">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <FaGoogle className="text-white text-xl" />
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <FaFacebookF className="text-white text-xl" />
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <FaGithub className="text-white text-xl" />
            </button>
          </div>

          {/* Sign Up Button - YEH ADD KIYA HAI */}
          <div className="mt-6">
            <Link 
              to="/register"
              className="flex items-center justify-center w-full px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <FaUserPlus className="mr-2 text-white group-hover:rotate-12 transition-transform" />
              <span className="text-white font-semibold">Create New Account</span>
              <FaArrowRight className="ml-2 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Alternative Sign Up Text Link */}
          <p className="mt-4 text-center text-white/70 text-sm">
            New to SmartPark?{' '}
            <Link 
              to="/register" 
              className="text-white font-semibold hover:text-blue-200 transition-colors underline decoration-white/30 hover:decoration-white"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes floatCloud {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 20%)); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-cloud {
          animation: floatCloud 20s linear infinite;
        }
        
        .animate-cloud-delay {
          animation: floatCloud 25s linear infinite;
          animation-delay: -10s;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoginCSS;