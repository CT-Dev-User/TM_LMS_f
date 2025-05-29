import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { server } from "../main";

const InsLectures = ({ courseId }) => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLectures = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/course/${courseId}/lectures`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setLectures(data.lectures || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching lectures."
      );
      setError("Failed to fetch lectures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Course Lectures
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-gray-600">{error}</div>
      ) : lectures.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {lectures.map((lecture) => (
            <div
              key={lecture._id}
              className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
            >
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                {lecture.title}
              </h3>
              <video
                controls
                src={lecture.video}
                className="w-full rounded-md shadow-sm"
                style={{ maxHeight: "300px" }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No videos uploaded</p>
          <p className="text-gray-500">
            Contact your admin to upload lectures
          </p>
        </div>
      )}
    </div>
  );
};

export default InsLectures;