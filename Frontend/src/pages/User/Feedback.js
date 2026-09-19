import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const [predictions, setPredictions] = useState([]);
  const [selectedProp, setSelectedProp] = useState(null);
  const [actualPrice, setActualPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user?.username) {
      return;
    }
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:8080/api/predictions/history?username=${user.username}`);
        setPredictions(res.data);
      } catch (err) {
        setError('Unable to load your prediction history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user?.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/feedback/submit', {
        propertyId: selectedProp.property.id,
        actualPrice: parseFloat(actualPrice)
      });
      alert('Thank you! Your feedback helps our AI learn and improve accuracy.');
      setSelectedProp(null);
      setActualPrice('');
    } catch (err) {
      alert('Error submitting feedback.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Us Learn 🤖</h1>
      <p className="text-gray-600 mb-8">Did you recently sell or buy a property? Enter the actual price to improve our 2026 Prediction Engine.</p>

      {!user?.username && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-600 mb-4">Please login to view your prediction history and submit feedback.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      )}

      {user?.username && !selectedProp ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Predicted</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {predictions.map((p) => (
                <tr key={p.id} className="hover:bg-indigo-50/30 transition">
                  <td className="px-6 py-4 font-medium">{p.property.location}</td>
                  <td className="px-6 py-4 text-indigo-600 font-bold">₹ {p.predictedPrice}L</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedProp(p)}
                      className="text-indigo-600 text-sm font-bold hover:underline"
                    >
                      Enter Actual Price
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="p-12 text-center text-gray-500">Loading your prediction history...</div>
          )}
          {!loading && error && (
            <div className="p-12 text-center text-red-500">{error}</div>
          )}
          {!loading && !error && predictions.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <p className="mb-4">No predictions found in your history.</p>
              <button
                onClick={() => navigate('/user/predict')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700"
              >
                Make a Prediction
              </button>
            </div>
          )}
        </div>
      ) : user?.username && selectedProp ? (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-100">
          <button onClick={() => setSelectedProp(null)} className="text-gray-400 mb-4 hover:text-gray-600">← Back</button>
          <h2 className="text-xl font-bold mb-6">Updating {selectedProp.property.location} Property</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actual Sold Price (in Lakhs)</label>
              <input 
                type="number"
                step="0.01"
                required
                className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 85.5"
                value={actualPrice}
                onChange={(e) => setActualPrice(e.target.value)}
              />
            </div>
            <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700">
              Submit Feedback & Train AI
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Feedback;
