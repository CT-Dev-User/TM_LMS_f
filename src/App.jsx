/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminCourses from './admin/Courses/AdminCourses';
import AdminDashboard from './admin/Dashboard/AdminDashboard';
import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Loading from './components/loading/Loading';
import PlaylistDetail from './components/VideoFunctionality/PlaylistDetail';
import { UserData } from './context/UserContext';
import About from './pages/About/About';
// import Account from './pages/Account/Account';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Verify from './pages/auth/Verify';
import CourseDescription from './pages/CourseDescription/CourseDescription';
import CourseStudy from './pages/courseStudy/CourseStudy';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import Lecture from './pages/lecture/Lecture';
import Paymentsuccess from './pages/paymentSuccess/Paymentsuccess';
import Prof from './pages/Profile/Prof.jsx';
import PurchaseHistory from './pages/PurchaseHistory/PurcHis.jsx';


import AdminUsers from './admin/Users/AdminUsers';


const App = () => {
  const { isAuth, user, loading } = UserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Header isAuth={isAuth} />
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/courses" element={isAuth ? <Dashboard user={user} /> : <Login />} />
            <Route path="/my-courses" element={isAuth ? <Dashboard user={user} /> : <Login />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/account" element={isAuth ? <Account user={user} /> : <Login />} /> */}
            <Route path="/login" element={isAuth ? <Home user={user} /> : <Login />} />
            <Route path="/register" element={isAuth ? <Home user={user} /> : <Register />} />
            <Route path="/verify" element={isAuth ? <Home user={user} /> : <Verify />} />
            <Route path="/course/:id" element={isAuth ? <CourseDescription user={user} /> : <Login />} />
            <Route path="/:courseTitle/lectures/:courseId" element={<PlaylistDetail />} />
            <Route path="/purchase-history" element={<PurchaseHistory />} />
            <Route path="/payment-success/:id" element={isAuth ? <Paymentsuccess user={user} /> : <Login />} />
            <Route path="/:id/dashboard" element={isAuth ? <Dashboard user={user} /> : <Login />} />
            <Route path="/course/study/:id" element={isAuth ? <CourseStudy user={user} /> : <Login />} />
            <Route path="/lectures/:id" element={isAuth ? <Lecture user={user} /> : <Login />} />
            <Route path="/admin/dashboard" element={isAuth ? <AdminDashboard user={user} /> : <Login />} />
            <Route path="/admin/course" element={isAuth ? <AdminCourses user={user} /> : <Login />} />
            <Route path="/admin/users" element={isAuth ? <AdminUsers user={user} /> : <Login />} />
            <Route path="/profile" element={isAuth ? <Prof user={user} /> : <Navigate to="/login" />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
