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
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-lg p-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-gray-900">
              About Currency Hub
            </h1>
            <p className="text-lg md:text-xl text-gray-700 font-medium mb-8 text-center">
              We built <span className="font-bold text-blue-700">Currency Hub</span> to make currency conversion easy, accurate, and fast for everyone.
            </p>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center md:text-left">Our Mission</h2>
                <p className="text-gray-700 mb-4 text-center md:text-left">
                  To provide a seamless experience for users who need to convert currencies and track exchange rates.
                </p>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center md:text-left">Features</h2>
                <ul className="text-gray-700 space-y-2 list-disc list-inside text-center md:text-left">
                  <li>Instant currency conversion</li>
                  <li>30-day exchange rate trends</li>
                  <li>Real-time data from trusted sources</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
