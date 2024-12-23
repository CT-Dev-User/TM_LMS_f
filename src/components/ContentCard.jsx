/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import img from "../assets/profile.jpg";

function ContentCard({ lectures, isSidebarOpen, isLargeScreen }) {
  return (
    <div
      className={`flex-1 p-8 pt-10 pl-10 transition-all duration-300 ${
        isLargeScreen ? "lg:ml-64" : isSidebarOpen ? "ml-0" : "ml-0"
      }`}
      style={{
        zIndex: isSidebarOpen && !isLargeScreen ? 10 : 1, // Allow overlap only for small screens
      }}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Use grid layout for responsive behavior */}
        <div className="pl-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lectures.map((lecture, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transform transition-all duration-300 w-full"
            >
              <img
                src={
                  lecture.image ||
                  "https://media.istockphoto.com/id/2012275348/photo/view-of-planet-earth-china-and-surrounding-countries-from-space.jpg?s=2048x2048&w=is&k=20&c=6GhVkxUbWCX50oeHLpPsh6jx1MJ_o16fefjc5OKxPgc="
                }
                alt={lecture.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-indigo-700">
                  {lecture.title}
                </h3>
                <p className="text-gray-500 mt-2">{lecture.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContentCard;
