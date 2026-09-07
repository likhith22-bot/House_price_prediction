import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrainingLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/model/logs');
        setLogs(res.data.reverse());
      } catch (e) {
        console.error('Failed to load retraining logs', e);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 text-slate-100">
      <h1 className="text-2xl font-black tracking-wide mb-2">Auto-Training Logs</h1>
      <p className="text-sm text-slate-400 mb-4">Every manual or drift-based retraining event is tracked here for governance.</p>

      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-3">Trigger</th>
              <th className="px-6 py-3">Old → New Version</th>
              <th className="px-6 py-3">Accuracy</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-slate-700/60 hover:bg-slate-800/60">
                <td className="px-6 py-3 font-bold text-sky-400">{log.triggerType}</td>
                <td className="px-6 py-3 text-slate-200">{log.oldVersion} → {log.newVersion}</td>
                <td className="px-6 py-3 text-emerald-400 text-xs font-bold">
                  {log.oldAccuracy && log.newAccuracy
                    ? `${(log.oldAccuracy * 100).toFixed(1)}% → ${(log.newAccuracy * 100).toFixed(1)}%`
                    : '--'}
                </td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-xs text-slate-400">
                  {log.timestamp?.replace('T', ' ').substring(0, 19)}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-slate-500 text-sm">
                  No retraining events recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingLogs;

