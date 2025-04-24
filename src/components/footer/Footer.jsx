import React from 'react';
import { AiFillFacebook } from "react-icons/ai";
import { AiOutlineGithub } from "react-icons/ai"; // Assuming you want to use this for GitHub
import { FaReddit } from "react-icons/fa"; // For Reddit icon

const Footer = () => {
  return (
    <footer className="animate-fadeIn bg-[#8a5baf] text-white py-5 px-4 text-center">
      <div className="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 sm:space-y-0 sm:flex-row w-full">
        <a href="#">
          <img className="w-auto h-7" src="path-to-your-logo.svg" alt="TechMomentum Logo" />
        </a>

        <p className="text-sm">© 2025 TechMomentum. All Rights Reserved.</p>

        <div className="flex -mx-2">
          <a href="#" className="mx-2 text-white transition-colors duration-300 hover:text-[#f5f5f5]" aria-label="Reddit">
            <FaReddit size={24} />
          </a>

          <a href="#" className="mx-2 text-white transition-colors duration-300 hover:text-[#f5f5f5]" aria-label="Facebook">
            <AiFillFacebook size={24} />
          </a>

          <a href="#" className="mx-2 text-white transition-colors duration-300 hover:text-[#f5f5f5]" aria-label="GitHub">
            <AiOutlineGithub size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
