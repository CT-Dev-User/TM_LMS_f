import {createContext, useContext, useEffect, useState} from "react";
import { server } from "../main";
import axios from "axios";
import toast , { Toaster } from "react-hot-toast";



const UserContext = createContext();

export const UserContextProvider = ({children}) => { 

    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(false);

   async function loginUser(email,password,navigate){
      setBtnLoading(true);
      try{
        const {data } =  await axios.post(`${server}/api/user/login`, {email,password});

        toast.success(data.message);
        localStorage.setItem("token",data.token);
        setUser(data.user);
        setIsAuth(true);
        setBtnLoading(false);
        navigate("/");

      }
      catch(error){
         setBtnLoading(false);
         setIsAuth(false);
         toast.error(error.response.data.message);
      }
    }
//////////////////////////////////register user/////////////////////////////////////////////////////////////////////////////////

async function registerUser(name , email,password,navigate){
  setBtnLoading(true);
  try{
    const {data } =  await axios.post(`${server}/api/user/register`,
       {
        name,
        email,
        password});

    toast.success(data.message);
    localStorage.setItem("activationToken",data.activationToken);

    setBtnLoading(false);
    navigate("/verify");

  }
  catch(error){
    setBtnLoading(false);
     toast.error(error.response.data.message);
  }
}




/////////////////////////////////verifyOtp////////////////////////////////////////////////////$
 async function verifyOtp(otp,navigate){
   
    const activationToken = localStorage.getItem("activationToken");
  try{
    const {data} = await axios.post(`${server}/api/user/verify`,
    {
      otp,
      activationToken,
    });
    toast.success(data.message);

    navigate("/login");
    localStorage.clear();
  }
  catch(error){
    
    toast.error(error.response.data.message);
  }
 
}



//////////////////////////////////////////////////////////////////////////////////////////////////

  // async function fetchUser(){ 
  //  try{
  //    const {data} = await axios.get(`${server}/api/user/me`,{
  //      headers:{
  //       token : localStorage.getItem("token"),
  //      },

  //    });
  //    setIsAuth(true);
  //    setUser(data.user);
  //    setLoading(false);
  //   }
  //    catch(error){
  // console.log(error);
  // setLoading(false);
     
  //  }

  // }

  // useEffect(()=>{
  //   fetchUser();
  // }, [])








  async function fetchUser() { 
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage.");
      }
      
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: { token },
      });
  
      setIsAuth(true);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error in fetchUser:", error.response?.data?.message || error.message);
      setIsAuth(false);
      setUser(null);
      setLoading(false);
    }
  }
  



    return (
        <UserContext.Provider value={{ user, setUser, isAuth, setIsAuth, btnLoading, setBtnLoading, loginUser,loading ,registerUser,fetchUser,verifyOtp}}>
            {children}
            <Toaster />
        </UserContext.Provider>
    )
}

export const UserData = () => useContext(UserContext);