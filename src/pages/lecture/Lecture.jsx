import React, { useEffect, useState } from 'react';
import "./Lecture.css";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from "../../main";
import Loading from '../../components/loading/loading';
import toast from 'react-hot-toast';

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
    return navigate("/");
  }

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.log("error");
      setLecLoading(false);
    }
  }

  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        }
      });
      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }
  }

  const changeVideoHandler = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);
    try {
      const { data } = await axios.post(`${server}/api/course/${params.id}`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this lecture?")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchLectures();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-6">
                {lecLoading ? (
                  <Loading />
                ) : (
                  lecture.video ? (
                    <>
                      <video 
                        src={`${server}/${lecture.video}`}
                        width="100%"
                        controls
                        controlsList='nodownload noremoteplayback'
                        disablePictureInPicture
                        disableRemotePlayback
                        autoPlay
                        className="mb-4 rounded-lg shadow"
                      />
                      <h1 className="text-2xl font-bold mb-2">{lecture.title}</h1>
                      <h3 className="text-lg text-gray-700">{lecture.description}</h3>
                    </>
                  ) : (
                    <h1 className="text-2xl font-bold">Please Select a Lecture</h1>
                  )
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                {user && user.role === "admin" && (
                  <button 
                    className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    onClick={() => setShow(!show)}
                  >
                    {show ? "Close" : "Add Lecture"}
                  </button>
                )}

                {show && (
                  <div className="lecture-form mb-6">
                    <h2 className="text-xl font-semibold mb-4">Add Lecture</h2>
                    <form onSubmit={submitHandler}>
                      <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input 
                          type="text" 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          required 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <input 
                          type="text" 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          required 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>

                      <div className="mb-4">
                        <input 
                          type="file"
                          onChange={changeVideoHandler} 
                          required 
                          className="mt-1 block w-full"
                        />
                        {videoPrev && (
                          <video 
                            src={videoPrev} 
                            width={300} 
                            controls 
                            className="mt-2"
                          />
                        )}
                      </div>

                      <button 
                        disabled={btnLoading}
                        type='submit' 
                        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 disabled:opacity-50"
                      >
                        {btnLoading ? "Please Wait" : "Add"}
                      </button>
                    </form>
                  </div>
                )}

                {lectures && lectures.length > 0 ? (
                  lectures.map((e, i) => (
                    <div key={i} className="mb-4">
                      <div 
                        onClick={() => fetchLecture(e._id)}
                        className={`p-3 cursor-pointer rounded-lg ${lecture._id === e._id ? 'bg-blue-200' : 'bg-gray-200'} hover:bg-blue-300 transition duration-300`}
                      >
                        {i + 1}. {e.title}
                      </div>
                      {user && user.role === "admin" && (
                        <button 
                          className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                          onClick={() => deleteHandler(e._id)}
                        >
                          Delete {e.title}
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No Lectures Yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lecture;