// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full flex justify-center items-center px-8 py-4 bg-gradient-to-b from-gray-800 via-gray-900 to-black border-t border-gray-700">
      <p className="text-gray-300 text-center w-full">
        &copy; {new Date().getFullYear()} Currency Hub. All rights reserved.
      </p>
    </footer>
  );
}
