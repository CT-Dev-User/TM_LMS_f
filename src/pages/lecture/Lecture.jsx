import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/loading/Loading.jsx';
import { server } from "../../main";

const Lecture = ({ user }) => {
    const [lectures, setLectures] = useState([]);
    const [lecture, setLecture] = useState({});
    const [loading, setLoading] = useState(true);
    const [lecLoading, setLecLoading] = useState(false);
    const [showAddLectureForm, setShowAddLectureForm] = useState(false);
    const [meetingFormVisible, setMeetingFormVisible] = useState(false);
    const [meetingLink, setMeetingLink] = useState("");
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [platform, setPlatform] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [courseMeetings, setCourseMeetings] = useState([]);

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
            navigate("/");
        }
    }, [user, params.id, navigate]);

    const fetchLectures = async () => {
        try {
            const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
                headers: { token: localStorage.getItem("token") },
            });
            setLectures(data.lectures);
            await fetchCourseMeetings();
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch lectures:", error);
            toast.error("Error fetching lectures.");
            setLoading(false);
        }
    };

    const fetchCourseMeetings = async () => {
        try {
            const { data } = await axios.get(`${server}/api/course/${params.id}/meetings`, {
                headers: { token: localStorage.getItem("token") },
            });
            setCourseMeetings(data.meetings);
        } catch (error) {
            console.error("Failed to fetch meetings:", error);
            toast.error("Error fetching meetings.");
        }
    };

    const fetchLecture = async (id) => {
        setLecLoading(true);
        try {
            const { data } = await axios.get(`${server}/api/lecture/${id}`, {
                headers: { token: localStorage.getItem("token") },
            });
            setLecture(data.lecture);
        } catch (error) {
            console.error("Failed to fetch lecture:", error);
            toast.error("Error fetching lecture.");
        } finally {
            setLecLoading(false);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result);
                setVideo(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitLecture = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("file", video);

        try {
            const { data } = await axios.post(`${server}/api/course/${params.id}`, formData, {
                headers: { token: localStorage.getItem("token") },
            });
            toast.success(data.message);
            setShowAddLectureForm(false);
            fetchLectures();
            resetLectureForm();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while adding the lecture.");
        } finally {
            setBtnLoading(false);
        }
    };

    const handleDeleteLecture = async (id) => {
        if (confirm("Are you sure you want to delete this lecture?")) {
            try {
                const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
                    headers: { token: localStorage.getItem("token") },
                });
                toast.success(data.message);
                fetchLectures();
            } catch (error) {
                toast.error(error.response?.data?.message || "An error occurred while deleting the lecture.");
            }
        }
    };

    const handleSubmitMeeting = async (e) => {
        e.preventDefault();
        const meetingData = { platform, meetingDate, meetingTime, meetingLink };

        try {
            const response = await axios.post(`${server}/api/course/${params.id}/meeting`, meetingData, {
                headers: { token: localStorage.getItem("token") },
            });
            toast.success(response.data.message);
            setMeetingFormVisible(false);
            resetMeetingForm();
            fetchCourseMeetings();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while creating the meeting.");
        }
    };
    const handleDeleteMeeting = async (id) => {
        if (confirm("Are you sure you want to delete this meeting?")) {
            try {
                const { data } = await axios.delete(`${server}/api/course/${params.id}/meeting/${id}`, {
                    headers: { token: localStorage.getItem("token") },
                });
                toast.success(data.message);
                fetchCourseMeetings();
            } catch (error) {
                toast.error(error.response?.data?.message || "An error occurred while deleting the meeting.");
            }
        }
    };

    const resetLectureForm = () => {
        setTitle("");
        setDescription("");
        setVideo(null);
        setVideoPreview("");
    };

    const resetMeetingForm = () => {
        setMeetingLink("");
        setMeetingDate("");
        setMeetingTime("");
        setPlatform("");
    };

    useEffect(() => {
        fetchLectures();
    }, []);

    const convertTo12Hour = (time24) => {
        const [hours, minutes] = time24.split(':');
        let period = 'AM';
        let hours12 = parseInt(hours);

        if (hours12 >= 12) {
            period = 'PM';
            if (hours12 > 12) hours12 -= 12;
        }
        if (hours12 === 0) hours12 = 12;

        return `${hours12}:${minutes} ${period}`;
    };


    return (
        <div className="container mx-auto p-6 min-h-screen overflow-y-auto pb-20">
            {loading ? (
                <Loading />
            ) : (
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Section - Lecture Content */}
                    <div className="w-full md:w-2/3 p-6 bg-white rounded-lg shadow-md">
                        {lecLoading ? (
                            <Loading />
                        ) : (
                            <>
                                {lecture.video ? (
                                    <div className="mb-6">
                                        <video
                                            src={`${server}/${lecture.video}`}
                                            className="w-full rounded-md mb-4"
                                            controls
                                        />
                                        <h2 className="text-3xl font-semibold text-gray-800">{lecture.title}</h2>
                                        <p className="text-lg text-gray-600">{lecture.description}</p>
                                    </div>
                                ) : (
                                    <h2 className="text-xl font-semibold text-gray-800">Select a Lecture to View</h2>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Section - Admin Controls */}
                    <div className="w-full md:w-1/3 space-y-6">
                        {user && user.role === "admin" && (
                            <>
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => setShowAddLectureForm(!showAddLectureForm)}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        {showAddLectureForm ? "Close" : "Add Lecture"}
                                    </button>
                                </div>

                                {showAddLectureForm && (
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-2xl font-semibold mb-4">Add New Lecture</h3>
                                        <form onSubmit={handleSubmitLecture}>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Lecture Title"
                                                className="w-full p-3 mb-4 border rounded-md shadow-sm"
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Lecture Description"
                                                className="w-full p-3 mb-4 border rounded-md shadow-sm"
                                                required
                                            />
                                            <input
                                                type="file"
                                                onChange={handleVideoChange}
                                                className="w-full mb-4"
                                                required
                                            />
                                            {videoPreview && (
                                                <video src={videoPreview} className="w-1/3 mb-4" controls />
                                            )}
                                            <button
                                                type="submit"
                                                disabled={btnLoading}
                                                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                                            >
                                                {btnLoading ? "Please Wait..." : "Add Lecture"}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                <button
                                    onClick={() => setMeetingFormVisible(!meetingFormVisible)}
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                                >
                                    {meetingFormVisible ? "Close Meeting Form" : "Add Meeting"}
                                </button>
                                {meetingFormVisible && (
                                    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full mx-auto">
                                        <h3 className="text-2xl font-semibold mb-4">Create Meeting</h3>
                                        <form onSubmit={handleSubmitMeeting} className="space-y-4">
                                            {/* Platform Input */}
                                            <div className="w-full">
                                                <input
                                                    type="text"
                                                    value={platform}
                                                    onChange={(e) => setPlatform(e.target.value)}
                                                    placeholder="Platform"
                                                    className="w-full p-3 mb-4 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
                                                    required
                                                />
                                            </div>

                                            {/* Date Input */}
                                            <div className="w-full">
                                                <input
                                                    type="date"
                                                    value={meetingDate}
                                                    onChange={(e) => setMeetingDate(e.target.value)}
                                                    className="w-full p-3 mb-4 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
                                                    required
                                                />
                                            </div>

                                            {/* Time Input */}
                                            <div className="w-full">
                                                <input
                                                    type="time"
                                                    value={meetingTime}
                                                    onChange={(e) => setMeetingTime(e.target.value)}
                                                    className="w-full p-3 mb-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                                    required
                                                    step="60"
                                                />
                                            </div>

                                            {/* Meeting Link Input */}
                                            <div className="w-full">
                                                <input
                                                    type="url"
                                                    value={meetingLink}
                                                    onChange={(e) => setMeetingLink(e.target.value)}
                                                    placeholder="Meeting Link"
                                                    className="w-full p-3 mb-4 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
                                                    required
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex justify-center">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                                                >
                                                    Create Meeting
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}


                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Lectures</h3>
                                    {lectures.length ? (
                                        lectures.map((lec, i) => (
                                            <div key={lec._id} className="flex justify-between items-center mb-4">
                                                <div
                                                    onClick={() => fetchLecture(lec._id)}
                                                    className={`cursor-pointer px-4 py-2 rounded-md hover:bg-gray-100 ${i === 0 ? "bg-blue-100" : "bg-gray-50"
                                                        }`}
                                                >
                                                    {lec.title}
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteLecture(lec._id)}
                                                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No lectures available</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Meetings</h3>
                                    {courseMeetings.length ? (
                                        courseMeetings.map((meeting) => (
                                            <div key={meeting._id} className="flex justify-between items-center mb-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{meeting.platform}</span>
                                                    <span>Date: {new Date(meeting.meetingDate).toLocaleDateString()}</span>
                                                    <span>Time: {convertTo12Hour(meeting.meetingTime)}</span>
                                                    <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                                        Join Meeting
                                                    </a>
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteMeeting(meeting._id)}
                                                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No meetings scheduled</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lecture;
