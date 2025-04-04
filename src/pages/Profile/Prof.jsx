import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Layout from "../../admin/Utils/Layout.jsx";
import UserSidebar from "../../components/Sidebar/Sidebar"; // Renamed import to avoid conflict
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import InstructorSidebar from "../../instructor/Sidebar.jsx";
import { server } from "../../main";

const ProfileSettings = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
  });

  const { mycourse: myCourses, fetchMyCourse } = CourseData();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!myCourses || myCourses.length === 0) {
      fetchMyCourse().catch(() => setError("Failed to load your courses"));
    }
  }, [fetchMyCourse, myCourses]);

  useEffect(() => {
    if (user) {
      const names = user.name?.split(" ") || ["", ""];
      setFormData({
        firstName: names[0] || "",
        lastName: names[1] || "",
        email: user.email || "",
      });

      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
          profileComplete: true,
        };

        const token = localStorage.getItem("token");
        const response = await axios.put(`${server}/api/user/update-profile`, updatedData, {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          setProfileImage(imageData);
          const updatedUser = { ...user, profileImage: imageData };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          toast.success("Profile photo updated successfully");
        }
      } catch (error) {
        toast.error("Failed to update profile photo");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    try {
      const updatedData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        profileImage: null,
        profileComplete: true,
      };

      const token = localStorage.getItem("token");
      const response = await axios.put(`${server}/api/user/update-profile`, updatedData, {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setProfileImage(null);
        const updatedUser = { ...user, profileImage: null };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
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
      profileComplete: true,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${server}/api/user/update-profile`, updatedData, {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        const updatedUser = { ...user, name: updatedData.name, profileImage };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully");
        navigate("/profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);
    toast.success("Logout Successfully");
    navigate("/");
  };

  // For admin users, use the Layout component
  if (user?.role === "admin") {
    return (
      <Layout user={user} title="Profile Settings">
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mx-auto my-10">
          <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">Complete Your Profile</h1>

          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6 p-4">
            <label htmlFor="profileImage" className="relative w-24 h-24 cursor-pointer">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="rounded-full w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center rounded-full w-full h-full bg-indigo-500 text-white text-2xl">
                  {(formData.firstName.charAt(0) || "").toUpperCase()}
                  {(formData.lastName.charAt(0) || "").toUpperCase()}
                </div>
              )}
              <input type="file" id="profileImage" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {profileImage && (
              <button onClick={handleRemoveImage} className="text-red-500 text-sm mt-2 flex items-center">
                <FaTrash className="mr-2" /> Remove Photo
              </button>
            )}
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" placeholder="First Name" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" placeholder="Last Name" />
            <input type="email" value={formData.email} readOnly className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed" />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Save Changes</button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center"><IoMdLogOut className="mr-2" /> Logout</button>
            </div>
          </form>
        </div>
      </Layout>
    );
  }

  // For user and instructor roles
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar for user and instructor - using the original sidebar's responsive behavior */}
      {user?.role === "user" && <UserSidebar user={user} course={myCourses} />}
      {user?.role === "instructor" && <InstructorSidebar user={user} />}

      {/* Main content */}
      <main className="flex-grow flex justify-center items-center p-4 md:p-10">
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">Complete Your Profile</h1>

          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6 p-4">
            <label htmlFor="profileImage" className="relative w-24 h-24 cursor-pointer">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="rounded-full w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center rounded-full w-full h-full bg-indigo-500 text-white text-2xl">
                  {(formData.firstName.charAt(0) || "").toUpperCase()}
                  {(formData.lastName.charAt(0) || "").toUpperCase()}
                </div>
              )}
              <input type="file" id="profileImage" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {profileImage && (
              <button onClick={handleRemoveImage} className="text-red-500 text-sm mt-2 flex items-center">
                <FaTrash className="mr-2" /> Remove Photo
              </button>
            )}
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" placeholder="First Name" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" placeholder="Last Name" />
            <input type="email" value={formData.email} readOnly className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed" />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Save Changes</button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center"><IoMdLogOut className="mr-2" /> Logout</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
