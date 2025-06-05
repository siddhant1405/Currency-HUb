import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button'; 
import Footer from '../components/Footer';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <Header>
        <Button to="/convert">Convert Currency</Button>
        <Button to="/">Home</Button>
      </Header>
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          About Us
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-medium mb-8 max-w-2xl">
          We built Currency Hub to make currency conversion easy, accurate, and fast for everyone.
        </p>
        <div className="bg-gray-900 bg-opacity-50 p-6 rounded-xl shadow-lg max-w-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 mb-4">
            To provide a seamless experience for users who need to convert currencies and track exchange rates.
          </p>
          <h2 className="text-2xl font-semibold text-white mb-4">Features</h2>
          <ul className="text-gray-300 space-y-2 text-left">
            <li>Instant currency conversion</li>
            <li>30-day exchange rate trends</li>
            <li>Real-time data from trusted sources</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
