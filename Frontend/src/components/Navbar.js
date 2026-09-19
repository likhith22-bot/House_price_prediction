import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
            PROPHET <span className="text-gray-900">AI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition">Home</Link>
            {user ? (
              <>
                <Link 
                  to={user.role === 'ADMIN' ? "/admin" : "/user/dashboard"} 
                  className="text-indigo-600 font-bold bg-indigo-50 px-6 py-2.5 rounded-xl hover:bg-indigo-100 transition"
                >
                  Enter Portal 🚀
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 font-medium transition">Logout</button>
              </>
            ) : (
              <Link to="/login" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">Get Started</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
