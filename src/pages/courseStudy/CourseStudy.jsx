import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import { motion } from 'framer-motion';

const CourseStudy = ({ user }) => {
    const params = useParams();
    const { fetchCourse, course } = CourseData();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourse(params.id);
    }, [params.id]);

    if (!course) return null;

    // Check if the user has access to the course (admin or subscribed)
    const hasAccess = user && (user.role === "admin" || user.subscription?.includes(course._id));

    if (user && !hasAccess) {
        navigate("/");
        return null;
    }

    // Animation variants
    const cardVariants = {
        offscreen: {
            y: 30,
            opacity: 0
        },
        onscreen: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 0.8
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.8 }}
                >
                    <motion.div 
                        className="bg-white rounded-3xl shadow-xl overflow-hidden relative"
                        variants={cardVariants}
                    >
                        <motion.img 
                            src={course.image}
                            alt={course.title}
                            className="w-full h-auto max-h-[500px] object-cover"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                            <span className="text-white text-lg font-bold bg-blue-600 px-3 py-1 rounded-full">
                                {course.category}
                            </span>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
                        variants={cardVariants}
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight capitalize">{course.title}</h1>
                        <div className="text-gray-700 text-base">
                            <p><strong className="text-blue-600">Instructor:</strong> {course.createdBy}</p>
                            <p><strong className="text-blue-600">Duration:</strong> {course.duration} Weeks</p>
                        </div>
                        <p className="text-gray-600 text-lg">{course.description}</p>

                        <div className="mt-6">
                            <Link 
                                to={`/lectures/${course._id}`}
                                className="inline-block bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:from-purple-600 hover:to-blue-700"
                            >
                                <motion.span 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Admin Lectures
                                </motion.span>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default CourseStudy;