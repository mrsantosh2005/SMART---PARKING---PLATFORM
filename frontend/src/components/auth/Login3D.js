import React, { useState, Suspense } from 'react';
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
  FaShieldAlt
} from 'react-icons/fa';
import { ThreeDBackground } from '../3d/ThreeDBackground';
import toast from 'react-hot-toast';

const Login3D = () => {
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
      {/* 3D Background */}
      <Suspense fallback={<div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-indigo-900"></div>}>
        <ThreeDBackground />
      </Suspense>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

      {/* Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo with 3D Effect */}
        <div className="text-center mb-8 animate-float">
          <div className="inline-flex items-center justify-center mb-4 relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-50 animate-pulse group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
              <FaParking className="text-white text-4xl" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg animate-slideIn">
            Welcome Back
          </h2>
          <p className="text-white/80 drop-shadow-md">
            Sign in to continue your parking journey
          </p>
        </div>

        {/* Trust Badge */}
        <div className="flex justify-center mb-6 animate-slideIn delay-100">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-lg">
            <FaShieldAlt className="text-green-400 mr-2 text-sm animate-pulse" />
            <span className="text-white/90 text-xs font-medium">Secure Login • 256-bit Encryption</span>
          </div>
        </div>

        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl animate-slideIn delay-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="transform hover:scale-105 transition-transform duration-300">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="transform hover:scale-105 transition-transform duration-300">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                      <FaEyeSlash className="h-5 w-5 text-white/50 hover:text-white/80 transition-colors" />
                    ) : (
                      <FaEye className="h-5 w-5 text-white/50 hover:text-white/80 transition-colors" />
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
                  className="h-4 w-4 bg-white/10 border-white/20 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300"></div>
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
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/60">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <FaGoogle className="text-white text-xl" />
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <FaFacebookF className="text-white text-xl" />
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <FaGithub className="text-white text-xl" />
            </button>
          </div>

          <p className="mt-6 text-center text-white/70">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-white hover:text-blue-300 transition-colors group"
            >
              Sign up now
              <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white/50 text-xs">
          <a href="#" className="hover:text-white/80 transition-colors mx-2">Terms</a>
          <span>•</span>
          <a href="#" className="hover:text-white/80 transition-colors mx-2">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-white/80 transition-colors mx-2">Security</a>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default Login3D;