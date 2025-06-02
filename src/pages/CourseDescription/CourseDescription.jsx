import React, { useEffect, useState } from 'react';
import './CourseDescription.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import { UserData } from '../../context/UserContext';
import Loading from '../../components/loading/Loading';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const CourseDescription = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  const [courseDescriptionRef, courseDescriptionInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    fetchCourse(id);
  }, [id]);

  const checkoutHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      
      if (course.price === 0) {
        // If the course is free, simulate a purchase
        const { data } = await axios.post(
          `${server}/api/course/checkout/${id}`,
          {},
          { headers: { token } }
        );
        
        await fetchUser();
        await fetchCourses();
        await fetchMyCourse();

        toast.success("Course subscribed successfully!");
        navigate(`/course/study/${course._id}`);
      } else {
        // For paid courses
        const { data: { order } } = await axios.post(
          `${server}/api/course/checkout/${id}`,
          {},
          { headers: { token } }
        );

        const options = {
          key: "rzp_live_gFHhLyF1CHGKSV",
          amount: order.id,
          currency: "INR",
          name: "TechMomentum",
          description: "Learning solutions",
          order_id: order.id,
          handler: async function(response) {
            try {
              const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

              const { data } = await axios.post(
                `${server}/api/verification/${id}`,
                {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature
                },
                { headers: { token } }
              );

              await fetchUser();
              await fetchCourses();
              await fetchMyCourse();

              toast.success(data.message);
              navigate(`/payment-success/${razorpay_payment_id}`);
            } catch (error) {
              toast.error(error.response?.data?.message || "Payment verification failed");
            }
          },
          theme: {
            color: "#8a4baf",
          },
          prefill: {
            name: user?.name,
            email: user?.email
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!course) return null;

  // Check if the user has access to the course (admin or subscribed)
  const hasAccess = user && (user.role === "admin" || user.subscription?.includes(course._id));

  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={courseDescriptionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: courseDescriptionInView ? 1 : 0, y: courseDescriptionInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <div className="relative">
            <motion.img 
              src={course.image}
              alt={course.title}
              className="w-full h-96 object-cover rounded-lg shadow-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
              <motion.span 
                className="text-white text-sm font-semibold uppercase bg-blue-600 px-2 py-1 rounded-lg"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {course.category}
              </motion.span>
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight capitalize">{course.title}</h1>
            <div className="text-gray-600 text-sm sm:text-base">
              <p><strong>Instructor:</strong> {course.createdBy}</p>
              <p><strong>Duration:</strong> {course.duration} Weeks</p>
            </div>
            <p className="text-gray-700 text-base sm:text-lg">{course.description}</p>
            <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">
              ₹{course.price}
            </div>
            <motion.div 
              className="mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {hasAccess ? (
                <button 
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-600 hover:to-blue-700"
                >
                  Start Learning
                </button>
              ) : (
                <button 
                  onClick={checkoutHandler}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-600 hover:to-blue-700"
                >
                  {course.price === 0 ? "Subscribe Now" : "Enroll Now"}
                </button>
              )}
            </motion.div>
          </div>
        </motion.div>

        <motion.section 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Introduction to Key Concepts</li>
            <li>Mastering Advanced Techniques</li>
            <li>Real-World Applications</li>
          </ul>
        </motion.section>

        <motion.section 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of This Course</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            Dive into a comprehensive learning experience with expert-led sessions, interactive modules, and hands-on projects designed to elevate your skills.
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default CourseDescription;