// src/pages/LandingPage.jsx
import React from 'react';
import Header from '../components/Header';
import GradientButton from '../components/Button'; // or Button
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';  

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <Header>
        <GradientButton to="/convert">Convert Currency</GradientButton>
        <GradientButton to="/about">About Us</GradientButton>
      </Header>
      <main className="flex-grow flex flex-col">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
