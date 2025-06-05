// src/components/Header.jsx
import React from 'react';
import logo from '../assets/LOGO.jpg'; // Adjust the path as needed

export default function Header({ children }) {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-black bg-opacity-80 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Currency Hub logo" className="h-11 w-11 rounded" />
        <span className="text-2xl font-bold text-white tracking-wider">Currency Hub</span>
      </div>
      <nav className="flex items-center gap-6">
        {children}
      </nav>
    </header>
  );
}
