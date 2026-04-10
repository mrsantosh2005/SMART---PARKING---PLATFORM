import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaParking, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FaParking className="text-2xl" />
            <span className="font-bold text-xl">SmartPark</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/parkings" className="hover:text-blue-200">
              Find Parking
            </Link>

            {user ? (
              <>
                {user.role === 'owner' && (
                  <>
                    <Link to="/owner/dashboard" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link to="/owner/add-parking" className="hover:text-blue-200">
                      Add Parking
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="hover:text-blue-200">
                    Admin Panel
                  </Link>
                )}

                {user.role === 'user' && (
                  <Link to="/user/bookings" className="hover:text-blue-200">
                    My Bookings
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <FaUser />
                  <span>{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                >
                  <FaUserPlus />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;