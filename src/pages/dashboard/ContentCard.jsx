/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { server } from '../../main'; // Import server base URL

const ContentCard = ({ course, onLectureClick }) => {
  const navigate = useNavigate();

  const handleLectureClick = (course) => {
    if (!course._id || !course.title) {
      console.error('Course ID or title is missing', course);
      return;
    }

    const safeTitle = encodeURIComponent(course.title.replace(/ /g, '-').toLowerCase());

    navigate(`/${safeTitle}/lectures/${course._id}`, {
      state: { course },
    });

    if (onLectureClick) {
      onLectureClick(course);
    }
  };

  const progress = course.progress || 0;

  // Determine the image source dynamically
  const getImageSource = () => {
    if (!course.image) {
      return 'https://via.placeholder.com/150'; // Fallback if no image
    }

    // Check if the image is a Cloudinary URL (starts with http/https)
    if (course.image.startsWith('http://') || course.image.startsWith('https://')) {
      return course.image; // Use Cloudinary URL directly
    }

    // Otherwise, assume it's a local path and prepend the server URL
    return `${server}/${course.image.replace(/\\/g, '/')}`; // Local server path
  };

  return (
    <div
      onClick={() => handleLectureClick(course)}
      className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl duration-300"
      tabIndex="0"
      onKeyDown={(e) => e.key === 'Enter' && handleLectureClick(course)}
      role="button"
      aria-label={`Open course ${course.title}`}
    >
      <img
        src={getImageSource()} // Dynamically determine image source
        alt={course.title || 'Course thumbnail'}
        className="w-full h-48 object-cover rounded-t-lg"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/150'; // Fallback on error
          console.error(`Failed to load image for ${course.title}: ${course.image}`);
        }}
      />

      <div className="p-4">
        <h3 className="text-xl font-semibold text-indigo-700 mb-2 ipadpro:text-lg">
          {course.title || 'Untitled Course'}
        </h3>
        <p className="text-gray-500 text-sm mb-4 ipadpro:text-xs">
          {course.description || 'No description available.'}
        </p>
        <p className="text-gray-500 text-sm mb-4 ipadpro:text-xs">
          Created By: <br />
          <b>{course.createdBy || 'No creator available.'}</b>
        </p>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span className="text-xs font-semibold inline-block py-1 uppercase ipadpro:text-[0.65rem]">
              Progress
            </span>
            <span className="text-xs font-semibold inline-block py-1 uppercase ipadpro:text-[0.65rem]">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;