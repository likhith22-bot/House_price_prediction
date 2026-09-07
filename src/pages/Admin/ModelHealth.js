import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ModelHealth = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/stats');
        setStats(res.data);
      } catch (e) {
        console.error('Failed to load admin stats', e);
      }
    };
    fetchStats();
  }, []);

  const historyData = [
    { name: 'v2026.1.1', acc: 96.2 },
    { name: 'v2026.1.2', acc: 97.5 },
    { name: 'v2026.1.3', acc: 98.7 },
    { name: 'v2026.1.4', acc: stats ? stats.accuracy.toFixed(2) : 95.0 },
  ];

  return (
    <div className="space-y-8 text-slate-100">
      <h1 className="text-2xl font-black tracking-wide mb-2">Model Health Overview</h1>
      <p className="text-sm text-slate-400 mb-6">Track accuracy, data growth, and active version of the Auto-Learning Engine.</p>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
            <p className="text-xs uppercase text-slate-400 font-bold mb-1">Current Accuracy</p>
            <p className="text-3xl font-black text-emerald-400">{stats.accuracy.toFixed(2)}%</p>
          </div>
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
            <p className="text-xs uppercase text-slate-400 font-bold mb-1">Active Version</p>
            <p className="text-2xl font-black text-indigo-400">{stats.version}</p>
          </div>
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
            <p className="text-xs uppercase text-slate-400 font-bold mb-1">Total Users</p>
            <p className="text-2xl font-black text-sky-400">{stats.totalUsers}</p>
          </div>
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
            <p className="text-xs uppercase text-slate-400 font-bold mb-1">Total Predictions</p>
            <p className="text-2xl font-black text-amber-400">{stats.totalPredictions}</p>
          </div>
        </div>
      )}

      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          📈 Accuracy Over Versions
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="acc" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ModelHealth;

