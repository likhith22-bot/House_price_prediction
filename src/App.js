import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Public/Home';
import Login from './pages/Public/Login';
import DemoPredict from './pages/Public/DemoPredict';
import Register from './pages/Public/Register';
import UserDashboard from './pages/User/Dashboard';
import Predict from './pages/User/Predict';
import Feedback from './pages/User/Feedback';
import Compare from './pages/User/Compare';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ModelHealth from './pages/Admin/ModelHealth';
import TrainingLogs from './pages/Admin/TrainingLogs';
import UserManagement from './pages/Admin/UserManagement';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import ChatbotWidget from './components/ChatbotWidget';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync user state when localStorage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Routes>
          {/* PUBLIC ROUTES (Guest Portal) */}
          <Route path="/" element={<><Navbar user={user} setUser={setUser}/><Home /></>} />
          <Route 
            path="/login" 
            element={
              <><Navbar user={user} setUser={setUser}/>
                <Login setUser={(newUser) => {
                  setUser(newUser);
                  if (newUser) {
                    localStorage.setItem('user', JSON.stringify(newUser));
                  } else {
                    localStorage.removeItem('user');
                  }
                }} />
              </>
            } 
          />
          <Route path="/register" element={<><Navbar user={user} setUser={setUser}/><Register /></>} />
          <Route path="/demo" element={<><Navbar user={user} setUser={setUser}/><DemoPredict /></>} />

          {/* USER PORTAL ROUTES (Role Protected, Nested) */}
          <Route 
            path="/user/*" 
            element={
              user && ['USER', 'BUYER', 'SELLER', 'INVESTOR'].includes(user.role)
                ? <UserLayout user={user} setUser={setUser} /> 
                : <Navigate to="/login" />
            }
          >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="predict" element={<Predict />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="compare" element={<Compare />} />
          </Route>

          {/* ADMIN PORTAL ROUTES (Role Protected, Nested) */}
          <Route 
            path="/admin/*" 
            element={
              user && user.role === 'ADMIN' 
                ? <AdminLayout user={user} setUser={setUser} />
                : <Navigate to="/login" />
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="model-health" element={<ModelHealth />} />
            <Route path="logs" element={<TrainingLogs />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Routes>
        
        {/* Global Floating Chatbot (Role Aware) */}
        <ChatbotWidget user={user} />
      </div>
    </Router>
  );
}

export default App;
