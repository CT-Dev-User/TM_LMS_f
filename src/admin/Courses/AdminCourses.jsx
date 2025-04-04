// src/admin/AdminCourses.jsx
import React, { useState, useRef, useEffect } from 'react';
import Layout from '../Utils/Layout';
import { CourseData } from '../../context/CourseContext';
import CourseCard from '../../components/courseCard/CourseCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../main';

const categories = [
  'Web Development',
  'App Development',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Data Structure',
];

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);
  const [imagePrev, setImagePrev] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const formRef = useRef(null);
  const { courses, fetchCourses, loading } = CourseData();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const changeImageHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePrev(reader.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append('title', title);
    myForm.append('description', description);
    myForm.append('category', category);
    myForm.append('price', price);
    myForm.append('createdBy', createdBy);
    myForm.append('duration', duration);
    if (image) myForm.append('file', image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(data.message);
      await fetchCourses();
      resetForm();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add course';
      toast.error(errorMsg);
    } finally {
      setBtnLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setPrice('');
    setCreatedBy('');
    setDuration('');
    setImage(null);
    setImagePrev('');
    setShowForm(false);
  };

  // return (
  //   <Layout>
  //     <div className="ml-[17%] sm:ml-[17%] md:ml-[15%] lg:ml-[17%] xl:ml-[20%] ipadpro:ml-[24%] ipadpro-landscape:ml-[20%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
  //       <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">
  //         All Courses
  //       </h2>
  //       <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
  //         <button
  //           onClick={() => {
  //             setShowForm(!showForm);
  //             if (!showForm && formRef.current) {
  //               formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //             }
  //           }}
  //           className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
  //         >
  //           {showForm ? 'Hide Form' : 'New Course'}
  //         </button>
  //       </div>

  //       {showForm && (
  //         <div ref={formRef} className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden mb-10">
  //           <div className="px-4 py-4 sm:px-6">
  //             <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
  //               Add Course
  //             </h2>
  //             <form onSubmit={submitHandler} className="space-y-4 sm:space-y-6">
  //               {[
  //                 { label: 'Title', state: title, setState: setTitle, type: 'text' },
  //                 { label: 'Description', state: description, setState: setDescription, type: 'text' },
  //                 { label: 'Price', state: price, setState: setPrice, type: 'number' },
  //                 { label: 'Created By', state: createdBy, setState: setCreatedBy, type: 'text' },
  //                 { label: 'Duration', state: duration, setState: setDuration, type: 'text' },
  //               ].map(({ label, state, setState, type }) => (
  //                 <div key={label}>
  //                   <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-700 mb-2">
  //                     {label}
  //                   </label>
  //                   <input
  //                     type={type}
  //                     value={state}
  //                     onChange={(e) => setState(e.target.value)}
  //                     required
  //                     className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
  //                   />
  //                 </div>
  //               ))}

  //               <div>
  //                 <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
  //                   Category
  //                 </label>
  //                 <select
  //                   value={category}
  //                   onChange={(e) => setCategory(e.target.value)}
  //                   required
  //                   className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
  //                 >
  //                   <option value="">Select Category</option>
  //                   {categories.map((cat) => (
  //                     <option key={cat} value={cat}>
  //                       {cat}
  //                     </option>
  //                   ))}
  //                 </select>
  //               </div>

  //               <div>
  //                 <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
  //                   Image
  //                 </label>
  //                 <input
  //                   type="file"
  //                   onChange={changeImageHandler}
  //                   required
  //                   accept="image/*"
  //                   className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
  //                 />
  //                 {imagePrev && (
  //                   <img
  //                     src={imagePrev}
  //                     alt="Preview"
  //                     className="mt-2 w-full h-48 sm:h-64 object-cover rounded-md border border-gray-200"
  //                   />
  //                 )}
  //               </div>

  //               <button
  //                 type="submit"
  //                 disabled={btnLoading}
  //                 className="w-full py-2 px-4 sm:py-3 sm:px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
  //               >
  //                 {btnLoading ? 'Please Wait...' : 'Add Course'}
  //               </button>
  //             </form>
  //           </div>
  //         </div>
  //       )}

  //       {loading ? (
  //         <p className="text-center text-gray-600">Loading courses...</p>
  //       ) : courses && courses.length > 0 ? (
  //         <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 ipadpro-landscape:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
  //           {courses.map((course) => (
  //             <CourseCard key={course._id} course={course} />
  //           ))}
  //         </div>
  //       ) : (
  //         <p className="text-center col-span-full text-gray-600">No Courses Yet</p>
  //       )}
  //     </div>
  //   </Layout>
  // );


  return (
    <Layout>
<div className=" xl:ml-[20%] ipadpro:ml-[24%] ipadpro-landscape:ml-[20%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"><h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">All Courses</h2>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <button 
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm && formRef.current) {
                            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }} 
                    className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                    {showForm ? "Hide Form" : "New Course"}
                </button>
            </div>

            {showForm && (
                <div ref={formRef} className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden mb-10">
                    <div className="px-4 py-4 sm:px-6">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Add Course</h2>
                        <form onSubmit={submitHandler} className="space-y-4 sm:space-y-6">
                            {[
                                { label: 'Title', state: title, setState: setTitle, type: 'text' },
                                { label: 'Description', state: description, setState: setDescription, type: 'text' },
                                { label: 'Price', state: price, setState: setPrice, type: 'number' },
                                { label: 'Created By', state: createdBy, setState: setCreatedBy, type: 'text' },
                                { label: 'Duration', state: duration, setState: setDuration, type: 'text' },
                            ].map(({ label, state, setState, type }) => (
                                <div key={label}>
                                    <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                                    <input 
                                        type={type} 
                                        value={state} 
                                        onChange={(e) => setState(e.target.value)} 
                                        required 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            ))}

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)} 
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                <input 
                                    type="file" 
                                    required 
                                    onChange={changeImageHandler} 
                                    className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                {imagePrev && <img src={imagePrev} alt="preview" className="mt-2 w-full h-48 sm:h-64 object-cover rounded-md border border-gray-200" />}
                            </div>

                            <button 
                                type='submit' 
                                disabled={btnLoading} 
                                className="w-full py-2 px-4 sm:py-3 sm:px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {btnLoading ? "Please Wait..." : "Add Course"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 ipadpro-landscape:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                {courses && courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard key={course._id} course={course} />
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-600">No Courses Yet</p>
                )}
            </div>
        </div>
    </Layout>
);



};

export default AdminCourses;