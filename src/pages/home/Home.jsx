/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from "../../components/courseCard/CourseCard";
import { CourseData } from "../../context/CourseContext";
import { useInView } from 'react-intersection-observer';
import img from '../../assets/img1 .webp'

const Home = () => {
  const navigate = useNavigate();
  const { courses } = CourseData();

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // For hero text
  const [heroTextRef, heroTextInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // For hero image
  const [heroImageRef, heroImageInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // For courses section
  const [coursesSectionRef, coursesSectionInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (courses) {
      setIsLoading(true);
      const delay = setTimeout(() => {
        const newFilteredCourses = courses.filter(course => 
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(newFilteredCourses);
        setIsLoading(false);
      }, 1000); // Simulating a delay for loading animation

      return () => clearTimeout(delay);
    }
  }, [courses, searchTerm]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="hero-section flex flex-col md:flex-row items-center justify-between p-6 md:p-12 lg:p-16 ipadpro:p-10 ipadpro-landscape:p-8 relative overflow-hidden">
        <div 
          ref={heroTextRef} 
          className={`hero-text max-w-lg md:max-w-xl lg:max-w-2xl ipadpro:max-w-xl ipadpro-landscape:max-w-full mb-6 md:mb-0 z-10 transition-all duration-1000 ease-in-out ${heroTextInView ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'} md:w-1/2 lg:w-5/12 ipadpro:w-2/3 ipadpro-landscape:w-full`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl ipadpro:text-5xl ipadpro-landscape:text-4xl font-bold text-gray-800 mb-4">
            Start Learning From <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Best Platform</span>
          </h1>
          <p className="text-gray-600 mb-6 text-base md:text-lg lg:text-xl ipadpro:text-lg ipadpro-landscape:text-base">
            Study any topic, anytime, explore thousands of courses for the lowest price ever!
          </p>
          <div className="search-bar flex items-center mb-6 shadow-lg rounded-full overflow-hidden">
            <label htmlFor="search" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">Q. What do you want to learn</label>
            <input 
              type="text" 
              id="search" 
              placeholder="Search courses" 
              className="px-4 py-2 border-none focus:outline-none focus:ring-0 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="stats flex flex-col md:flex-row gap-4 mb-6">
            <div className="stat-item flex items-center gap-2 text-gray-800 bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl">📚</span> <span className="font-bold">2000+</span> Online Courses
            </div>
            <div className="stat-item flex items-center gap-2 text-gray-800 bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl">🎓</span> <span className="font-bold">25k+</span> Happy Students
            </div>
            <div className="stat-item flex items-center gap-2 text-gray-800 bg-white p-4 rounded-lg shadow-md">
              <span className="text-2xl">🤖</span> AI Powered
            </div>
          </div>
          <button onClick={() => navigate("/courses")} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">Get Started</button>
        </div>
        <div 
          ref={heroImageRef} 
          className={`ml-[2%] hero-image max-w-md md:max-w-full relative z-10 transition-all duration-1000 ease-in-out ${heroImageInView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} md:w-1/2 lg:w-7/12 ipadpro:w-1/3 ipadpro-landscape:w-full md:-mt-24 lg:-mt-24 xl:mt-16 ipadpro:-mt-20 ipadpro-landscape:mt-0`}
        >
          <img src={img} alt="Student with books" className="rounded-lg shadow-2xl w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-25 rounded-lg"></div>
        </div>
        <div className="absolute inset-0 bg-purple-100 animate-pulse opacity-25"></div>
        <div className="guarantee absolute top-4 right-4 md:top-6 md:right-6 ipadpro:top-5 ipadpro:right-5 ipadpro-landscape:top-4 ipadpro-landscape:right-4 z-20"></div>
      </div>
      <div 
        ref={coursesSectionRef} 
        className={`courses-section px-4 sm:px-6 lg:px-[10%] mt-8 transition-all duration-1000 ease-in-out ${coursesSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6 md:text-2xl lg:text-3xl ipadpro:text-2xl ipadpro-landscape:text-xl">
          Available Courses
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 sm:gap-6 lg:gap-8 ipadpro:grid-cols-2 ipadpro-landscape:grid-cols-1 ipadpro:gap-4 ipadpro-landscape:gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <div className="spinner border-t-4 border-blue-500 border-solid rounded-full animate-spin h-16 w-16"></div>
            </div>
          ) : (
            filteredCourses && filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <CourseCard key={course._id} course={course} className={`mb-10 transition-all duration-1000 ease-in-out rounded-3xl ${coursesSectionInView ? 'translate-y-0 opacity-100' : `translate-y-10 opacity-0 delay-${index * 100}`}`} />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No Courses match your search
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;