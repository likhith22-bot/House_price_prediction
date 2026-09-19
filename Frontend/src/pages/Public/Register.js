import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/signup', formData);
      alert('Registration Successful! You can now login with your username or email.');
      navigate('/login');
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message || 'Registration failed';
      alert(`Registration Failed: ${errorMsg}. Username or email may already exist.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-indigo-50">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create User Account</h2>
          <p className="text-gray-500">Register as Buyer / Seller / Investor to access the full User Portal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition transform active:scale-95 shadow-lg">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

