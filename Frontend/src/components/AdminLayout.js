import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

const AdminLayout = ({ user, setUser }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-100 font-sans">
      {/* ADMIN SIDEBAR */}
      <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-2xl font-black tracking-tighter text-indigo-500">
            PROPHET <span className="text-white">COMMAND</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[4px] text-slate-500 mt-1 font-bold">2026 Admin Portal</p>
        </div>
        
        <nav className="flex-grow py-8 px-4 space-y-2">
          {[
            { name: 'Admin Dashboard', path: '/admin', icon: '🛡️' },
            { name: 'Model Health', path: '/admin/model-health', icon: '❤️' },
            { name: 'Retraining Logs', path: '/admin/logs', icon: '📝' },
            { name: 'User Access', path: '/admin/users', icon: '👥' },
          ].map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-600/20 hover:text-indigo-400 transition font-bold text-slate-400"
            >
              <span>{item.icon}</span> {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-8">
          <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-red-600/10 text-red-500 border border-red-600/20 font-black hover:bg-red-600 hover:text-white transition shadow-lg">
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* ADMIN TOPBAR */}
        <header className="h-24 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between px-12">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">System Control Unit</h2>
            <p className="text-xs text-slate-500 font-bold">Real-time Model Version: v2026.1.4</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-slate-500 font-black uppercase">Service Status</p>
              <span className="text-emerald-400 font-black flex items-center gap-2 justify-end">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span> ONLINE
              </span>
            </div>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] rotate-3">
              A
            </div>
          </div>
        </header>

        {/* ADMIN PAGE CONTENT */}
        <section className="flex-grow p-12 overflow-y-auto bg-slate-900">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
