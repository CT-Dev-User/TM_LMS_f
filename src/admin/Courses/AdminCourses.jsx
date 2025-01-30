/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef } from 'react';
import Layout from '../Utils/Layout';
import { CourseData } from '../../context/CourseContext';
import CourseCard from '../../components/courseCard/CourseCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../main';

const categories = [
    "Web Development",
    "App Development",
    "Data Science",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Structure",
];

const AdminCourses = ({ user }) => {
    const navigate = useNavigate();
    if (user && user.role !== "admin") return navigate("/");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [duration, setDuration] = useState("");
    const [image, setImage] = useState("");
    const [imagePrev, setImagePrev] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const formRef = useRef(null); // Reference for scrolling

    const changeImageHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImagePrev(reader.result);
            setImage(file);
        };
    };

    const { courses, fetchCourses } = CourseData();

    const submitHandler = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        const myForm = new FormData();
        myForm.append("title", title);
        myForm.append("description", description);
        myForm.append("category", category);
        myForm.append("price", price);
        myForm.append("createdBy", createdBy);
        myForm.append("duration", duration);
        myForm.append("file", image);

        try {
            const { data } = await axios.post(`${server}/api/course/new`, myForm, {
                headers: {
                    token: localStorage.getItem("token"),
                }
            });
            toast.success(data.message);
            setBtnLoading(false);
            await fetchCourses();
            setImage("");
            setTitle("");
            setDescription("");
            setDuration("");
            setImagePrev("");
            setCreatedBy("");
            setPrice("");
            setCategory("");
            setShowForm(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    };

    return (
        <Layout>
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">All Courses</h1>
                    <button 
                        onClick={() => {
                            setShowForm(!showForm);
                            if (!showForm && formRef.current) {
                                formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }} 
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        {showForm ? "Hide Form" : "New Course"}
                    </button>
                </div>
               

                {showForm && (
                    <div ref={formRef} className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden mb-10">
                        <div className="px-6 py-4">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Course</h2>
                            <form onSubmit={submitHandler} className="space-y-6">
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
                                    {imagePrev && <img src={imagePrev} alt="preview" className="mt-2 w-full h-48 object-cover rounded-md border border-gray-200" />}
                                </div>

                                <button 
                                    type='submit' 
                                    disabled={btnLoading} 
                                    className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {btnLoading ? "Please Wait..." : "Add Course"}
                                </button>
                                
                            </form>
                            
                        </div>
                    </div>
                )}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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