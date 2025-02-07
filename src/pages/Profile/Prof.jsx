
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { FaTrash } from 'react-icons/fa';
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/Sidebar/Sidebar";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import { server } from '../../main';

const ProfileSettings = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || "",
    lastName: user?.name?.split(' ')[1] || "",
    email: user?.email || ""
  });
  const { mycourse: myCourses, fetchMyCourse } = CourseData();
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!myCourses || myCourses.length === 0) {
      fetchMyCourse().catch(() => setError("Failed to load your courses"));
    }
  }, [fetchMyCourse, myCourses]);

  useEffect(() => {
    if (user) {
      const names = user.name?.split(' ') || ['', ''];
      setFormData({
        firstName: names[0] || "",
        lastName: names[1] || "",
        email: user.email || ""
      });
      
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [user]);

  const navigate = useNavigate();

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5000000) {
          toast.error("Image size should be less than 5MB");
          return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageData = e.target.result;
          try {
            const updatedData = {
              name: `${formData.firstName} ${formData.lastName}`.trim(),
              profileImage: imageData,
              profileComplete: true
            };

            const token = localStorage.getItem("token");
            const response = await axios.put(
              `${server}/api/user/update-profile`,
              updatedData,
              {
                headers: { 
                  token,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            if (response.data.success) {
              setProfileImage(imageData);
              const updatedUser = { 
                ...user, 
                name: updatedData.name,
                profileImage: imageData 
              };
              setUser(updatedUser);
              localStorage.setItem('profileImage', imageData);
              localStorage.setItem('user', JSON.stringify(updatedUser));
              toast.success("Profile photo updated successfully");
            }
          } catch (error) {
            toast.error("Failed to update profile photo");
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemoveImage = async (e) => {
    e.stopPropagation();
    try {
      const updatedData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        profileImage: null,
        profileComplete: true
      };

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${server}/api/user/update-profile`,
        updatedData,
        {
          headers: { 
            token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setProfileImage(null);
        const updatedUser = { 
          ...user, 
          name: updatedData.name,
          profileImage: null 
        };
        setUser(updatedUser);
        localStorage.removeItem('profileImage');
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success("Profile photo removed successfully");
      }
    } catch (error) {
      toast.error("Failed to remove profile photo");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      profileImage: profileImage,
      profileComplete: true
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${server}/api/user/update-profile`,
        updatedData,
        {
          headers: {
            token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const updatedUser = { 
          ...user, 
          name: updatedData.name,
          profileImage: profileImage 
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success("Profile updated successfully");
        navigate("/profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);
    toast.success("Logout Successfully");
    navigate("/");
  };

  if (!myCourses) {
    return (
      <div className="h-screen flex items-center justify-center animate-pulse">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center animate-pulse">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex flex-col">
      <div className="flex flex-grow relative">
        <div
          className={`custom-margin w-full sm:w-[16%] md:w-[10%] lg:w-[1%] xl:w-[1%] ${isSidebarOpen || isLargeScreen ? "block" : "hidden"}`}
        >
          <Sidebar
            isSidebarOpen={isSidebarOpen || isLargeScreen}
            setIsSidebarOpen={setIsSidebarOpen}
            user={user}
            course={myCourses}
          />
        </div>
        <main
          className={`flex-grow p-4 animate-fadeIn ${isSidebarOpen || isLargeScreen ? "lg:ml-[17%]" : ""}`}
        >
          <div className="container flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="card bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
              <div className="header text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
                <p className="text-gray-500 mb-4">Tell us more about yourself</p>
              </div>
              <div className="profile-picture-container flex flex-col items-center mb-8">
                <div className="profile-picture relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="rounded-full w-full h-full object-cover cursor-pointer"
                      onClick={handleImageClick}
                    />
                  ) : (
                    <div 
                      className="profile-initials rounded-full w-full h-full flex items-center justify-center bg-blue-500 text-white text-2xl md:text-3xl lg:text-4xl cursor-pointer"
                      onClick={handleImageClick}
                    >
                      {getInitials(formData.firstName, formData.lastName)}
                    </div>
                  )}
                  {profileImage && (
                    <button
                      className="delete-image-btn absolute bottom-1 right-1 bg-red-500 text-white border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-800 hover:scale-110 shadow-sm"
                      onClick={handleRemoveImage}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <span className="Profile-picture-text text-center text-sm text-gray-600 mt-4">
                  Profile Photo
                  <span className="block text-xs text-gray-400">Click to update your profile picture</span>
                </span>
              </div>
              <form className="form grid gap-4" onSubmit={handleSubmit}>
                <div className="spacing mb-6">
                  <label className="text-sm text-gray-600">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div className="spacing mb-6">
                  <label className="text-sm text-gray-600">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div className="full-width">
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800  focus:outline-none"
                  />
                </div>
                <div className="button-container flex flex-col sm:flex-row justify-center gap-4">
                  <button type="submit" className="button bg-indigo-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors duration-300 hover:bg-indigo-700 w-full sm:w-auto">
                    Save Changes
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="button bg-red-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors duration-300 hover:bg-red-600 flex items-center justify-center w-full sm:w-auto"
                  >
                    <IoMdLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;