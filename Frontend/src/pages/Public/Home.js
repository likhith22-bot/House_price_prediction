import React from 'react';

const Home = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16 pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-6">
            2026 Ready Edition
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Intelligent House Price Prediction <br />
            <span className="text-indigo-600">Powered by Explainable AI</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Experience the future of real estate analytics. Our system uses auto-learning ML and conversational analytics to provide transparent, real-time property valuations.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="/login" className="rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition">
              Login
            </a>
            <a href="/register" className="text-lg font-semibold leading-6 text-gray-900">
              Register <span aria-hidden="true">→</span>
            </a>
            <a href="/demo" className="text-sm font-medium text-indigo-500 underline">
              Try Demo Prediction
            </a>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Auto-Learning ML', desc: 'Models automatically retrain with new user and market data.', icon: '🤖' },
            { title: 'Explainable AI', desc: 'Understand exactly why a price was predicted using SHAP.', icon: '🔍' },
            { title: 'Real-Time Insights', desc: 'Predict prices for Hyderabad hotspots like Gachibowli instantly.', icon: '⚡' }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
