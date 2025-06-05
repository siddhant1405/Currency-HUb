// src/components/GradientButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function GradientButton({ children, to, className = "", ...props }) {
  const baseClasses = `bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
}
