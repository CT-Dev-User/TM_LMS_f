import React from "react";
import "./account.css";
import { MdDashboard } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);

    toast.success("Logout Successfully");
    navigate("/login");
  };
  // Handler for navigating to dashboard
  const dashboardHandler = () => {
    navigate("/dashboard");
  };
  return (
    <div>
      {user && (
        <div className="profile">
          <h2> My Profile</h2>
          <div className="profile-info">
            <p>
              <strong>Name - {user.name}</strong>
            </p>
            <p>
              <strong>E-Mail - {user.email}</strong>
            </p>
            <button className="common-btn" onClick={dashboardHandler}>
              <MdDashboard />
              Dashboard
            </button>

            <br />

            <button
              onClick={logoutHandler}
              className="common-btn"
              style={{ backgroundColor: "red" }}
            >
              <IoMdLogOut />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
