/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'; // Added useEffect
import { CourseData } from '../../context/CourseContext';
import CourseCard from '../../components/courseCard/CourseCard';

const Course = () => {
  const { courses, fetchCourses, loading } = CourseData(); // Added loading state

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="courses">
        <h2 className="mt-[5%] text-center text-2xl font-semibold text-gray-700 mb-6">
          Available Courses
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading courses...</p>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 justify-center lg:gap-8">
            {courses.map((e) => (
              <CourseCard key={e._id} course={e} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center col-span-full">No Courses yet</p>
        )}
      </div>
    </div>
  );
};

export default Course;