import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', price: 45 },
  { name: 'Tue', price: 52 },
  { name: 'Wed', price: 48 },
  { name: 'Thu', price: 61 },
  { name: 'Fri', price: 55 },
  { name: 'Sat', price: 67 },
  { name: 'Sun', price: 63 },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's your real estate overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Market Status</p>
          <span className="text-green-500 font-bold flex items-center gap-1 justify-end">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Bullish (+2.4%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Chart Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Price Trends (Hyderabad IT Corridor)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Recent Predictions</h3>
            <div className="space-y-4">
              {[
                { loc: 'Gachibowli', price: '82.4L', date: '2 hours ago', conf: '94%' },
                { loc: 'Kondapur', price: '75.1L', date: 'Yesterday', conf: '91%' },
                { loc: 'Manikonda', price: '62.8L', date: '3 days ago', conf: '88%' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">🏠</div>
                    <div>
                      <p className="font-bold text-gray-900">{item.loc}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-indigo-600">₹ {item.price}</p>
                    <p className="text-[10px] text-green-500 font-bold uppercase">{item.conf} Confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Location Intel</h3>
              <p className="text-indigo-200 text-sm mb-6">Curious how different areas stack up? Use our comparison engine.</p>
              <a href="/user/compare" className="bg-white text-indigo-900 px-6 py-2 rounded-xl font-bold text-sm inline-block">Start Comparison</a>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-800 rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Popular Areas</h3>
            <div className="space-y-4">
              {['Madhapur', 'Jubilee Hills', 'Financial District'].map(area => (
                <div key={area} className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">{area}</span>
                  <span className="text-green-500 text-sm font-bold">↑ High</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
