import React from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import Logo from '../../assets/logo.jpg'; // Adjust path if needed

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r bg-[#8a5baf] text-white py-10 px-6 text-center shadow-lg animate-[fadeIn_1s_ease-in-out]">
      <div className="container mx-auto flex flex-col items-center justify-between gap-8 p-8 sm:flex-row sm:gap-0">
        {/* Logo Section */}
        <a href="/" className="group relative">
          <img
            className="w-20 h-20 rounded-full object-cover border-2 border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            src={Logo}
            alt="TechMomentum Logo"
            onError={(e) => console.error('Failed to load logo:', e)}
          />
          <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </a>

        {/* Copyright Text */}
        <p className="text-sm font-light tracking-wider opacity-90 transition-all duration-300 hover:opacity-100 hover:scale-105">
          © 2025 TechMomentum. All Rights Reserved.
        </p>

        {/* Social Icons */}
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/company/techmomentum/"
            className="text-white transition-all duration-300 hover:text-white/80 hover:scale-125"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={26} />
          </a>
          <a
            href="https://www.instagram.com/techmomentum_learning/"
            className="text-white transition-all duration-300 hover:text-white/80 hover:scale-125"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={26} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;