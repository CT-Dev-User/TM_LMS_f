// eslint-disable-next-line no-unused-vars
import React from 'react'
import './index.css'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import About from './pages/About/About';
import Header from './components/header/Header'
import Login from './pages/auth/Login'
import Register from './pages/auth/register'
import Verify from './pages/auth/Verify'
import Footer from './components/footer/Footer'
import Account from './pages/Account/Account'
import { UserData } from './context/UserContext';
import Loading from './components/loading/loading';
import DashboardPage from './pages/courses/DashboardPage'
import PlaylistDetail from './components/VideoFunctionality/PlaylistDetail'
import PurchaseHistory from './pages/Purchase History/page'
import CalenderComponent from './pages/Calender/CalenderComponent'

const App = () => {
  const { isAuth, user, loading } = UserData();

  return (   
    <>
   
   {
    loading ?   (
      <Loading /> 

    ) : (
    <BrowserRouter>
      <Header isAuth={isAuth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='calendar' element={<CalenderComponent/>} />
        <Route path='/purchase-history' element={<PurchaseHistory/>} />
        <Route path="/courses" element={<DashboardPage />} />  

        <Route path="/:courseTitle/lectures/:courseId" element={<PlaylistDetail />} />
        
        <Route
          path="/account"
          element={isAuth ? <Account user={user} /> : <Login />}
        />
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/register" element={isAuth ? <Home /> : <Register />} />
        <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />

        
      </Routes>
      <Footer />
    </BrowserRouter> )
}

    </>
  );
}

  export default App