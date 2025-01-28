import React, { useEffect, useState } from 'react';
import './CourseDescription.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import { UserData } from '../../context/UserContext';
import Loading from '../../components/loading/loading';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  const [courseDescriptionRef, courseDescriptionInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  const checkoutHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      const { data: { order } } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
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
              `${server}/api/verification/${params.id}`,
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
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    }
  };

  if (loading) return <Loading />;
  if (!course) return null;

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={courseDescriptionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: courseDescriptionInView ? 1 : 0, y: courseDescriptionInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="relative">
            <motion.img 
              src={`${server}/${course.image}`}
              alt={course.title}
              className="w-full h-96 md:h-[400px] object-cover rounded-2xl shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div 
              className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-br-xl"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {course.category}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 rounded-2xl"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{course.title}</h1>
            <div className="text-gray-600">
              <p><strong>Instructor:</strong> {course.createdBy}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
            </div>
            <p className="text-gray-700 text-lg">{course.description}</p>
            <div className="text-2xl font-bold text-blue-600 mb-4">
              {course.price}
            </div>
            <motion.div 
              className="mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {user && user.subscription.includes(course._id) ? (
                <button 
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-600 hover:to-blue-700"
                >
                  Study Now
                </button>
              ) : (
                <button 
                  onClick={checkoutHandler}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-600 hover:to-blue-700"
                >
                  Buy Now
                </button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Module 1: Introduction to the Topic</li>
            <li>Module 2: Advanced Techniques</li>
            <li>Module 3: Practical Application</li>
          </ul>
        </motion.div>

        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Benefits</h2>
          <p className="text-gray-700 text-lg">
            This course offers comprehensive learning materials, expert guidance, and practical exercises to ensure you master the subject.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDescription;