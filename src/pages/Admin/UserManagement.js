import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/users');
        setUsers(res.data);
      } catch (e) {
        console.error('Failed to load users', e);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 text-slate-100">
      <h1 className="text-2xl font-black tracking-wide mb-2">User Management</h1>
      <p className="text-sm text-slate-400 mb-4">View all registered buyers, sellers, and investors on the platform.</p>

      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Password</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined On</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-700/60 hover:bg-slate-800/60">
                <td className="px-6 py-3 text-slate-400 text-xs">#{u.id}</td>
                <td className="px-6 py-3 font-bold text-slate-100">{u.username}</td>
                <td className="px-6 py-3 text-slate-300">{u.email}</td>
                <td className="px-6 py-3 text-slate-300 font-mono text-xs">{u.password || 'N/A'}</td>
                <td className="px-6 py-3 text-xs">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-black">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-xs text-slate-500">
                  {u.createdAt?.replace('T', ' ').substring(0, 19)}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-slate-500 text-sm">
                  No users registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

