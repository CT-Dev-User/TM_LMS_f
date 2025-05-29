// import React from 'react';
// import { FaArrowUp, FaInstagram, FaLinkedin } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import Logo from '../../assets/logo.jpg';

// const Footer = () => {
//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth'
//     });
//   };

//   return (
//     <footer className="bg-gradient-to-r from-[#7a4b9e] to-[#8a5baf] text-white py-4 px-6">
//       <div className="max-w-5xl mx-auto flex items-center justify-between">
//         {/* Left side - Logo and copyright */}
//         <div className="flex items-center gap-4">
//           <Link to="/" aria-label="Go to home page" className="hover:opacity-90 transition-opacity">
//             <img
//               className="w-8 h-8 rounded-full object-cover border-2 border-purple-200"
//               src={Logo}
//               alt="TechMomentum Logo"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = 'https://via.placeholder.com/32?text=TM';
//               }}
//             />
//           </Link>
//           <span className="text-sm text-purple-100">© {new Date().getFullYear()} TechMomentum</span>
//         </div>

//         {/* Center - Navigation links */}
//         <div className="flex gap-6 text-sm">
//           <Link 
//             to="/" 
//             className="text-purple-50 hover:text-white transition-colors font-medium"
//           >
//             Home
//           </Link>
//           <Link 
//             to="/courses" 
//             className="text-purple-50 hover:text-white transition-colors font-medium"
//           >
//             Courses
//           </Link>
//           <Link 
//             to="/about" 
//             className="text-purple-50 hover:text-white transition-colors font-medium"
//           >
//             About
//           </Link>
//         </div>

//         {/* Right side - Socials */}
//         <div className="flex items-center gap-4">
//           <div className="flex gap-3">
//             <a
//               href="https://www.linkedin.com/company/techmomentum/"
//               className="p-2 rounded-full bg-white/10 hover:bg-[#0077B5] hover:bg-opacity-90 transition-all"
//               aria-label="LinkedIn"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <FaLinkedin size={14} className="text-blue-100" />
//             </a>
//             <a
//               href="https://www.instagram.com/techmomentum_learning/"
//               className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all"
//               aria-label="Instagram"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <FaInstagram size={14} className="text-pink-100" />
//             </a>
//           </div>
          
//           {/* Back-to-top button - now at far right */}
//           <button
//             onClick={scrollToTop}
//             className="flex items-center justify-center bg-gradient-to-br from-purple-300 to-purple-400 hover:from-purple-200 hover:to-purple-300 w-8 h-8 rounded-full transition-all shadow-sm hover:shadow-purple-200/50 ml-4"
//             aria-label="Scroll to top"
//           >
//             <FaArrowUp size={14} className="text-purple-800" />
//           </button>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


// //////////////////////   MULTIPEL CONTENT   /////////////////////////


import React from 'react';
import { FaArrowUp, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.jpg';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleHomeClick = (e) => {
    // If already on home page, scroll to top
    if (window.location.pathname === '/') {
      e.preventDefault();
      scrollToTop();
    }

  };

  return (
    <footer className="bg-gradient-to-r from-[#6a3d8e] to-[#7d4ca5] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              src={Logo}
              alt="TechMomentum Logo"
            />
            <h3 className="text-xl font-bold bg-clip-text text-transparent ">
              TechMomentum
            </h3>
          </div>
          <p className="text-purple-100 text-sm">
            Accelerating tech education for the next generation of innovators.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="https://linkedin.com" className="text-purple-100 hover:text-[#0077b5] transition-colors">
              <FaLinkedin size={18} />
            </a>
            <a href="https://instagram.com" className="text-purple-100 hover:text-[#E1306C] transition-colors">
              <FaInstagram size={18} />
            </a>
            <a href="https://twitter.com" className="text-purple-100 hover:text-[#1DA1F2] transition-colors">
              <FaTwitter size={18} />
            </a>
            <a href="https://youtube.com" className="text-purple-100 hover:text-[#FF0000] transition-colors">
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Explore</h4>
          <ul className="space-y-3">
            <li>
              <Link 
                to="/" 
                onClick={handleHomeClick}
                className="text-purple-100 hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li><Link to="/courses" className="text-purple-100 hover:text-white transition-colors">Courses</Link></li>
            <li><Link to="/about" className="text-purple-100 hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/blog" className="text-purple-100 hover:text-white transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
          <ul className="space-y-3">
            <li><Link to="/faq" className="text-purple-100 hover:text-white transition-colors">FAQ</Link></li>
            <li><Link to="/contact" className="text-purple-100 hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="text-purple-100 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-purple-100 hover:text-white transition-colors">Terms</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Stay Connected</h4>
          <div className="flex items-center gap-3 mb-4">
            <HiOutlineMail size={20} className="text-purple-200" />
            <span>hello@techmomentum.com</span>
          </div>
          <Link 
            to="/" 
            onClick={handleHomeClick}
            className="inline-block bg-white text-purple-700 hover:bg-purple-100 px-6 py-2 rounded-full font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-purple-300/20 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-purple-100 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TechMomentum. All rights reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 bg-purple-400 hover:bg-purple-500 px-4 py-2 rounded-full transition-all text-white"
            aria-label="Scroll to top"
          >
            <span className="text-sm">Back to top</span>
            <FaArrowUp size={14} className="text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;