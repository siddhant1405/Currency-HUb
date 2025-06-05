import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HeroAnimations.css'; // Import CSS for dollar animations

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center flex-grow min-h-[70vh] bg-gradient-to-b from-black via-gray-900 to-gray-800 text-center overflow-hidden">

      {/* Floating dollar icons */}
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className={`dollar-icon left-[${Math.random() * 100}%] animation-delay-${i}`}
          style={{ left: `${Math.random() * 100}%` }}
        >
          💲
        </span>
      ))}

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold text-white mb-6 z-10"
      >
        <TypeAnimation
          sequence={['Currency Hub', 2000]}
          wrapper="span"
          cursor={true}
          speed={5}
          style={{ display: 'inline-block' }}
        />
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-xl md:text-2xl text-gray-300 font-medium mb-8 z-10"
      >
        Convert currencies instantly and smartly.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="z-10"
      >
        <Link
          to="/convert"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-semibold shadow-lg transition-transform hover:scale-105"
        >
          Get Started
        </Link>
      </motion.div>
    </section>
  );
}
