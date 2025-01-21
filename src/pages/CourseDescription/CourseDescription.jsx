/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import "./CourseDescription.css"
import { useNavigate, useParams } from 'react-router-dom'
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import { UserData } from '../../context/UserContext';
import Loading from '../../components/loading/loading';
import axios from 'axios';
import toast from 'react-hot-toast';

const CourseDescription = ({ user }) => {

  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)

  const { fetchUser } = UserData();
  const { fetchCourse, course , fetchCourses } = CourseData();


  useEffect(() => {
    fetchCourse(params.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // const checkoutHandler = async () => { 

  //   const token = localStorage.getItem("token");
  //   setLoading(true);
  //   const {data : {order}} = await axios
  //   .post(`${server}/api/course/checkout/${params.id}`, {}, {
  //     headers : {
  //      token,
       
  //     }
  //   })


  //   const options =  {
  //     "key": "rzp_live_gFHhLyF1CHGKSV", // Enter the Key ID generated from the Dashboard
  //   "amount": order.id, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //   "currency": "INR",
  //   "name": "TechMomentum", //your business name
  //   "description": "Learning solutions",
    
  //   "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1



  //   handler : async function(response){
  //     const { razorpay_order_id,
  //       razorpay_payment_id,
  //       razorpay_signature} = response;

  //       try{

  //         const {data} = await axios.post(`${server}/api/verification/${params.id}`, {
  //           razorpay_order_id,
  //           razorpay_payment_id,
  //           razorpay_signature
  //         },

  //         {
  //           headers :{
  //             token,
  //           },
  //         }
  //       );

  //       await fetchUser();
  //       await fetchCourses();
  //       toast.success(data.message);
  //       setLoading(false);
  //       navigate(`/payment-success/${razorpay_payment_id}`)

  //       }catch(error){
  //         toast.error(error.response.data.message);
  //         setLoading(false);
  //       }
  //   },

  //   theme : {
  //      color: "#8a4baf",
  //   },
  //   };

  //   const razorpay = new window.Razorpay(options);
  //   razorpay.open();

  // };
    




  const checkoutHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      
      // Get order from backend
      const { data: { order } } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
        {},
        { headers: { token } }
      );
  
      // Configure Razorpay options
      const options = {
        key: "rzp_live_gFHhLyF1CHGKSV",
        amount: order.id,
        currency: "INR",
        name: "TechMomentum",
        description: "Learning solutions",
        order_id: order.id,
        handler: async function(response) {
          try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
            
            const { data } = await axios.post(
              `${server}/api/verification/${params.id}`,
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
              },
              { headers: { token } }
            );
            
            await fetchUser();
            await fetchCourses();
            toast.success(data.message);
            navigate(`/payment-success/${razorpay_payment_id}`);
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        theme: {
          color: "#8a4baf",
        },
        // Add these recommended options for better error handling
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email
        }
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    }
  };









  return (

     <>
     {
      loading ? ( <Loading /> )
      :
      (
        <>

        {course && <div className="course-description">
  
          <div className="course-header">
            <img
              src={`${server}/${course.image}`}
              alt=""
              className='course-image' />
  
            <div className="course-info">
              <h2>
                {course.title}
              </h2>
              <p>instructor : {course.createdBy}</p>
              <p>Duration : {course.duration}</p>
            </div>
  
          </div>
  


          <p>{course.description}</p>
  
          <p>Let&lsquo;s get satrted with this course at {course.price}</p>
  
          {
            user && user.subscription.includes(course._id) ? (
              <button className='common-btn' onClick={() => navigate(`/course/study/${course._id}`)}>
                Study
              </button>
            ) : (
              <button 
              onClick={checkoutHandler}
              className='common-btn' >
                Buy Now
              </button>
            )
          }
  
  
  
        </div> }
      </>
      )
     }
     </>
  )

};
export default CourseDescription;