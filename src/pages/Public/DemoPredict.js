import React, { useState } from 'react';
import axios from 'axios';

const DemoPredict = () => {
  const [form, setForm] = useState({
    location: 'Gachibowli',
    total_sqft: 1200,
    bhk: 2,
    bath: 2,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const locations = ['Gachibowli', 'Kukatpally', 'Madhapur', 'Miyapur', 'Banjara Hills'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/predictions/predict', form);
      setResult(res.data);
    } catch (e) {
      alert('Demo service not reachable. Please ensure backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Demo House Price Estimator</h1>
      <p className="text-gray-500 text-center mb-10">Quick estimation for guests. Login for full Explainable AI and history.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow p-8 space-y-6 border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              className="w-full border rounded-xl p-3"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
              <input
                type="number"
                className="w-full border rounded-xl p-3"
                value={form.total_sqft}
                onChange={(e) => setForm({ ...form, total_sqft: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BHK</label>
              <select
                className="w-full border rounded-xl p-3"
                value={form.bhk}
                onChange={(e) => setForm({ ...form, bhk: Number(e.target.value) })}
              >
                {[1,2,3,4].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <select
              className="w-full border rounded-xl p-3"
              value={form.bath}
              onChange={(e) => setForm({ ...form, bath: Number(e.target.value) })}
            >
              {[1,2,3].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? 'Estimating...' : 'Estimate Price'}
          </button>
        </form>

        <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 flex flex-col justify-center">
          {result ? (
            <>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-2">Estimated Price</p>
              <h2 className="text-4xl font-black text-indigo-900 mb-4">₹ {result.predicted_price} L</h2>
              <p className="text-gray-600 text-sm mb-4">
                Confidence score: <span className="font-semibold">{(result.confidence_score * 100).toFixed(1)}%</span>
              </p>
              <p className="text-xs text-gray-400">
                Login to see full Explainable AI breakdown (SHAP) and store this prediction to your history.
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              Fill the form and click <strong>Estimate Price</strong> to see a quick guest prediction.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoPredict;

