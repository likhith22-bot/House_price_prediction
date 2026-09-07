import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Compare = () => {
  const [loc1, setLoc1] = useState('Gachibowli');
  const [loc2, setLoc2] = useState('Kukatpally');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const locations = ['Gachibowli', 'Kukatpally', 'Madhapur', 'Miyapur', 'Banjara Hills', 'Jubilee Hills', 'Kondapur', 'Manikonda', 'Uppal', 'Ameerpet'];

  const handleCompare = async () => {
    setLoading(true);
    try {
      // We'll call predict for both with standard parameters (1200 sqft, 2BHK, 2 Bath)
      const standardParams = { total_sqft: 1200, bhk: 2, bath: 2 };
      
      const res1 = await axios.post('http://localhost:8080/api/predictions/predict', { ...standardParams, location: loc1 });
      const res2 = await axios.post('http://localhost:8080/api/predictions/predict', { ...standardParams, location: loc2 });
      
      setComparison([
        { name: loc1, price: res1.data.predicted_price, confidence: res1.data.confidence_score * 100 },
        { name: loc2, price: res2.data.predicted_price, confidence: res2.data.confidence_score * 100 }
      ]);
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error fetching comparison data.';
      alert(`Error fetching comparison data: ${errorMsg}`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Location Comparison</h1>
      <p className="text-gray-500 mb-8">Compare market values between two major Hyderabad hubs (Standard: 1200sqft, 2BHK).</p>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location 1</label>
            <select 
              className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={loc1}
              onChange={(e) => setLoc1(e.target.value)}
            >
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="text-center text-gray-300 font-black text-2xl hidden md:block">VS</div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location 2</label>
            <select 
              className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={loc2}
              onChange={(e) => setLoc2(e.target.value)}
            >
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <button 
          onClick={handleCompare}
          disabled={loading}
          className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Generate Comparison Report'}
        </button>
      </div>

      {comparison && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Price Comparison (₹ Lakhs)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparison}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="price" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            {comparison.map((item, i) => (
              <div key={i} className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-400">{item.name}</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-indigo-600">Market Leader</span>
                </div>
                <h4 className="text-4xl font-black text-indigo-900 mb-1">₹ {item.price} L</h4>
                <p className="text-sm text-indigo-500">Predicted for 1200 sqft Modern Apartment</p>
                <div className="mt-4 pt-4 border-t border-indigo-100 flex justify-between text-xs font-bold">
                  <span>Growth Index: High</span>
                  <span>Confidence: {item.confidence.toFixed(1)}%</span>
                </div>
              </div>
            ))}
            
            <div className="bg-gray-900 text-white p-6 rounded-3xl">
              <h4 className="font-bold mb-2">AI Verdict 🧠</h4>
              <p className="text-sm text-gray-400">
                {comparison[0].price > comparison[1].price 
                  ? `${comparison[0].name} commands a ${((comparison[0].price/comparison[1].price - 1)*100).toFixed(1)}% premium over ${comparison[1].name} due to higher IT hub proximity.`
                  : `${comparison[1].name} commands a ${((comparison[1].price/comparison[0].price - 1)*100).toFixed(1)}% premium over ${comparison[0].name} due to higher IT hub proximity.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
