/* eslint-disable */
// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'BUYER' // Default role
  });
  const navigate = useNavigate();

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        if (!formData.username || !formData.password) {
          alert('Please fill in all fields');
          return;
        }

        const res = await axios.post('http://localhost:8080/api/auth/login', {
          username: formData.username,
          password: formData.password
        });
        
        const userData = {
          username: res.data.username,
          role: res.data.role,
          token: res.data.token
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setFormData({ username: '', email: '', password: '', role: 'BUYER' });
        
        if (userData.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/user/dashboard');
        }
      } else {
        if (!formData.username || !formData.email || !formData.password || !formData.role) {
          alert('Please fill in all fields including your role');
          return;
        }

        await axios.post('http://localhost:8080/api/auth/signup', formData);
        alert('Registration Successful! Please login with your username or email.');
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '', role: 'BUYER' });
      }
    } catch (err) {
      const error = err || {};
      
      // Check if backend responded (even with error) - means backend IS running
      const backendResponded = error.response && error.response.status;
      
      // Only show "backend not running" for genuine connection errors
      const isNetworkError = !backendResponded && (
        error.code === 'ERR_NETWORK' || 
        error.code === 'ECONNREFUSED' ||
        error.code === 'ECONNABORTED' ||
        (error.message && error.message.includes('Network Error')) ||
        (error.message && error.message.includes('timeout')) ||
        (error.message && error.message.includes('Failed to fetch') && !error.response)
      );
      
      if (isNetworkError) {
        alert(
          '⚠️ Backend Server Not Running!\n\n' +
          'Please start the backend:\n' +
          '1. Open terminal in "backend" folder\n' +
          '2. Run: mvn spring-boot:run\n' +
          '3. Wait for "Started HousePriceApplication"\n' +
          '4. Then try login again'
        );
        return;
      }

      // Backend IS running, but returned an error response
      let errorMsg = 'An error occurred';
      if (error.response && error.response.data) {
        errorMsg = error.response.data.message || error.response.data.error || (error.message || errorMsg);
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      if (isLogin) {
        alert(`Login Failed: ${errorMsg}\n\nMake sure:\n- You registered first OR use admin/admin123 for admin access`);
      } else {
        alert(`Registration Failed: ${errorMsg}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-indigo-50">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex mb-6 bg-indigo-50 rounded-full p-1">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-full transition ${isLogin ? 'bg-white text-indigo-600 shadow' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-full transition ${!isLogin ? 'bg-white text-indigo-600 shadow' : 'text-gray-500'}`}
          >
            Register
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'User / Admin Login' : 'Create New User Account'}
          </h2>
          <p className="text-gray-500">
            {isLogin ? 'Login to access role-based portals' : 'Register once and access your personal prediction workspace'}
          </p>
        </div>
        
        <form onSubmit={handleAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <input 
              type="text"
              required
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter username or email"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email"
                  required
                  className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                <select
                  required
                  className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="BUYER">Buyer - Looking to purchase property</option>
                  <option value="SELLER">Seller - Looking to sell property</option>
                  <option value="INVESTOR">Investor - Real estate investment</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Select your role to customize your experience</p>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password"
              required
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition transform active:scale-95 shadow-lg"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-bold hover:underline"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          <p className="mb-2">Admin Access: <strong>admin / admin123</strong></p>
          <p>New User? Click <strong>Register</strong> tab above to create account</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
