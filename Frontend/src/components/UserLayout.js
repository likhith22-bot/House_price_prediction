import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

const UserLayout = ({ user, setUser }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-8">
          <Link to="/user/dashboard" className="text-2xl font-black tracking-tighter">
            PROPHET <span className="text-indigo-400 text-sm italic">User</span>
          </Link>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          {[
            { name: 'Dashboard', path: '/user/dashboard', icon: '📊' },
            { name: 'Predict Price', path: '/user/predict', icon: '🏠' },
            { name: 'Comparison', path: '/user/compare', icon: '⚖️' },
            { name: 'Feedback Loop', path: '/user/feedback', icon: '🤖' },
          ].map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition font-medium"
            >
              <span>{item.icon}</span> {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full p-3 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition">
            Logout 🚪
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">Welcome, {user?.username} 👋</h2>
          <div className="flex items-center gap-4">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              Verified {user?.role}
            </span>
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className="flex-grow p-8 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default UserLayout;
