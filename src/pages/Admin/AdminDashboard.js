import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [retraining, setRetraining] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({
    accuracy: 95.0,
    datasetSize: 15000,
    totalUsers: 0,
    totalPredictions: 0,
    version: 'v2026.1.4'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats");
      }
    };
    fetchStats();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const res = await axios.post('http://localhost:8001/retrain');
      setStats({...stats, accuracy: res.data.new_r2_score * 100});
      alert('Model successfully retrained with new data!');
    } catch (err) {
      alert('Error triggering retraining in Python service.');
    }
    setRetraining(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await axios.post('http://localhost:8080/api/admin/chatbot/upload-knowledge', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Successfully loaded chatbot knowledge records. Retraining started in background.');
    } catch (err) {
      alert('Error uploading knowledge CSV.');
    }
    setUploading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Control Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Model Accuracy', val: stats.accuracy.toFixed(2) + '%', color: 'text-green-600' },
          { label: 'Total Users', val: stats.totalUsers, color: 'text-indigo-600' },
          { label: 'Total Predictions', val: stats.totalPredictions, color: 'text-orange-600' },
          { label: 'Active Version', val: stats.version, color: 'text-gray-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            🚀 Model Management
          </h3>
          <p className="text-gray-600 mb-8">
            The system automatically learns from user feedback. You can manually trigger a full retraining cycle.
          </p>
          <button 
            onClick={handleRetrain}
            disabled={retraining}
            className={`w-full py-4 rounded-2xl font-bold text-white transition shadow-lg mb-4 ${
              retraining ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {retraining ? 'Retraining Pipeline Active...' : 'Trigger Auto-Training Engine'}
          </button>
          <div className="relative">
            <input 
              type="file" 
              accept=".csv" 
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('file', file);
                try {
                  await axios.post('http://localhost:8080/api/admin/model/upload-data', formData);
                  alert('Market Data CSV uploaded. Auto-learning initiated.');
                } catch (err) {
                  alert('Error uploading market data.');
                }
              }}
              className="hidden" 
              id="dataUpload"
            />
            <label 
              htmlFor="dataUpload"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
            >
              Upload Market Data CSV 📈
            </label>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            🤖 Chatbot Knowledge Sync
          </h3>
          <p className="text-gray-600 mb-6">
            Upload a bulk set of questions and answers to update the chatbot's NLP brain instantly.
          </p>
          <div className="relative">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload}
              className="hidden" 
              id="csvUpload"
              disabled={uploading}
            />
            <label 
              htmlFor="csvUpload"
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition shadow-lg cursor-pointer ${
                uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {uploading ? 'Processing CSV...' : 'Upload Knowledge CSV 📁'}
            </label>
          </div>
          <p className="mt-4 text-xs text-gray-400 text-center">Format: question, answer (CSV)</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            📋 System Activity Logs
          </h3>
          <div className="space-y-4">
            {[
              { event: 'Knowledge Sync', status: 'Success', date: 'Just now' },
              { event: 'Drift Detected', status: 'Resolved', date: 'Jan 24, 2:15 PM' },
              { event: 'Scheduled Retrain', status: 'Success', date: 'Jan 23, 10:00 AM' }
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4">
                <div>
                  <p className="font-bold text-gray-900">{log.event}</p>
                  <p className="text-xs text-gray-500">{log.date}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
