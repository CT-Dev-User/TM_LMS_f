import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../main";
import CourseQuestions from "./AnswerForm.jsx";
import Sidebar from "./Sidebar";

const InstructorCourseManagement = ({ user }) => {
  const [courseMeetings, setCourseMeetings] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    deadline: "",
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState({
    type: "free-text",
    questionText: "",
    options: [],
    maxMarks: 1,
  });
  const [submissions, setSubmissions] = useState({});
  const [editingMarks, setEditingMarks] = useState({});

  const params = useParams();
  const navigate = useNavigate();

  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    navigate("/login");
    return null;
  }

  const fetchCourseMeetings = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/course/${params.id}/meetings`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setCourseMeetings(data.meetings);
    } catch (error) {
      toast.error("Error fetching meetings.");
      setError("Failed to fetch meetings.");
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/course/${params.id}/assignments`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setAssignments(data.assignments);
      const submissionsData = {};
      for (const assignment of data.assignments) {
        try {
          const { data: subData } = await axios.get(
            `${server}/api/assignment/${assignment._id}/submissions`,
            { headers: { token: localStorage.getItem("token") } }
          );
          submissionsData[assignment._id] = subData;
        } catch (subError) {
          
          submissionsData[assignment._id] = { submissions: [] };
        }
      }
      setSubmissions(submissionsData);
    } catch (error) {
      toast.error("Error fetching assignments.");
      setError("Failed to fetch assignments.");
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    if (assignmentData.questions.length === 0) {
      toast.error("Please add at least one question.");
      return;
    }

    const formattedData = {
      ...assignmentData,
      deadline: assignmentData.deadline
        ? new Date(assignmentData.deadline).toISOString()
        : null,
    };

    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}/assignment`,
        formattedData,
        { headers: { token } }
      );
      toast.success(data.message);
      setAssignments([...assignments, data.assignment]);
      setSubmissions({
        ...submissions,
        [data.assignment._id]: { submissions: [] },
      });
      setShowAssignmentForm(false);
      setAssignmentData({
        title: "",
        description: "",
        deadline: "",
        questions: [],
      });
      setNewQuestion({
        type: "free-text",
        questionText: "",
        options: [],
        maxMarks: 1,
      });
    } catch (error) {
      
      toast.error(
        error.response?.data?.message || "Error creating assignment."
      );
    }
  };

  const deleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;
    try {
      const { data } = await axios.delete(
        `${server}/api/assignment/${assignmentId}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      toast.success(data.message);
      setAssignments(
        assignments.filter((assignment) => assignment._id !== assignmentId)
      );
      const updatedSubmissions = { ...submissions };
      delete updatedSubmissions[assignmentId];
      setSubmissions(updatedSubmissions);
    } catch (error) {
      
      toast.error(
        error.response?.data?.message || "Error deleting assignment."
      );
    }
  };

  const updateMarks = async (assignmentId, submissionId, newMarks) => {
    try {
      const { data } = await axios.put(
        `${server}/api/assignment/${assignmentId}/submission/${submissionId}`,
        { marks: newMarks },
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success(data.message);
      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: {
          ...prev[assignmentId],
          submissions: prev[assignmentId].submissions.map((sub) =>
            sub._id === submissionId ? { ...sub, marks: newMarks } : sub
          ),
        },
      }));
      setEditingMarks((prev) => ({ ...prev, [submissionId]: false }));
    } catch (error) {
      
      toast.error(error.response?.data?.message || "Error updating marks.");
    }
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { text: "", isCorrect: false }],
    });
  };

  const updateOption = (index, field, value) => {
    const updatedOptions = newQuestion.options.map((opt, i) =>
      i === index
        ? { ...opt, [field]: field === "isCorrect" ? !opt.isCorrect : value }
        : opt
    );
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addQuestion = () => {
    if (!newQuestion.questionText) {
      toast.error("Please enter the question text.");
      return;
    }
    if (
      (newQuestion.type === "mcq" || newQuestion.type === "true-false") &&
      (newQuestion.options.length === 0 ||
        newQuestion.options.some((opt) => !opt.text))
    ) {
      toast.error("Please fill out all options for the question.");
      return;
    }
    if (
      (newQuestion.type === "mcq" || newQuestion.type === "true-false") &&
      !newQuestion.options.some((opt) => opt.isCorrect)
    ) {
      toast.error("Please mark at least one option as correct.");
      return;
    }
    if (newQuestion.type === "true-false" && newQuestion.options.length !== 2) {
      toast.error("True/False questions must have exactly 2 options.");
      return;
    }
    setAssignmentData({
      ...assignmentData,
      questions: [...assignmentData.questions, newQuestion],
    });
    setNewQuestion({
      type: "free-text",
      questionText: "",
      options: [],
      maxMarks: 1,
    });
  };

  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    let period = "AM";
    let hours12 = parseInt(hours);
    if (hours12 >= 12) {
      period = "PM";
      if (hours12 > 12) hours12 -= 12;
    }
    if (hours12 === 0) hours12 = 12;
    return `${hours12}:${minutes} ${period}`;
  };

  useEffect(() => {
    fetchCourseMeetings();
    fetchAssignments();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-r from-indigo-50 to-blue-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-hidden p-6  lg:ml-64 animate-fadeIn">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-600">{error}</div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:shadow-xl">
              <h1 className="text-2xl font-semibold text-indigo-800">
                Course Management
              </h1>
              <button
                onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                {showAssignmentForm ? "Cancel" : "Create Assignment"}
              </button>
            </div>

            {/* Assignment Form */}
            {showAssignmentForm && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Create New Assignment
                </h2>
                <form onSubmit={createAssignment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={assignmentData.title}
                      onChange={(e) =>
                        setAssignmentData({
                          ...assignmentData,
                          title: e.target.value,
                        })
                      }
                      className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={assignmentData.description}
                      onChange={(e) =>
                        setAssignmentData({
                          ...assignmentData,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={assignmentData.deadline}
                      onChange={(e) =>
                        setAssignmentData({
                          ...assignmentData,
                          deadline: e.target.value,
                        })
                      }
                      className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  {/* Questions Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Add Questions
                    </h3>
                    {assignmentData.questions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700">
                          Added Questions:
                        </h4>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                          {assignmentData.questions.map((q, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              <span className="font-semibold">
                                [ {q.type} ]{" "}
                              </span>{" "}
                              {q.questionText} (Max Marks: {q.maxMarks})
                              <button
                                type="button"
                                onClick={() => {
                                  setAssignmentData({
                                    ...assignmentData,
                                    questions: assignmentData.questions.filter(
                                      (_, i) => i !== index
                                    ),
                                  });
                                }}
                                className="ml-2 text-red-500 text-xs"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Question Type
                      </label>
                      <select
                        value={newQuestion.type}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            type: e.target.value,
                            options: [],
                          })
                        }
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                      >
                        <option value="free-text">Free Text</option>
                        <option value="mcq">Multiple Choice (MCQ)</option>
                        <option value="true-false">True/False</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={newQuestion.questionText}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            questionText: e.target.value,
                          })
                        }
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    {(newQuestion.type === "mcq" ||
                      newQuestion.type === "true-false") && (
                      <div className="space-y-2">
                        {newQuestion.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                updateOption(index, "text", e.target.value)
                              }
                              className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                              placeholder={`Option ${index + 1}`}
                            />
                            <input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={() => updateOption(index, "isCorrect")}
                              className="mt-1"
                            />
                            <label className="text-sm text-gray-700">
                              Correct
                            </label>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setNewQuestion({
                                    ...newQuestion,
                                    options: newQuestion.options.filter(
                                      (_, i) => i !== index
                                    ),
                                  });
                                }}
                                className="text-red-500 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addOption}
                          className="mt-2 bg-indigo-500 text-white py-1 px-3 rounded-md hover:bg-indigo-600"
                        >
                          Add Option
                        </button>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Max Marks
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newQuestion.maxMarks}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            maxMarks: parseInt(e.target.value) || 1,
                          })
                        }
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="mt-2 bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600"
                    >
                      Add This Question
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Create Assignment
                  </button>
                </form>
              </div>
            )}

            {/* Meetings Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Scheduled Meetings
              </h2>
              {courseMeetings.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  {courseMeetings.map((meeting) => (
                    <div
                      key={meeting._id}
                      className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
                    >
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-indigo-600">
                          {meeting.platform}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Date:</span>{" "}
                          {new Date(meeting.meetingDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Time:</span>{" "}
                          {convertTo12Hour(meeting.meetingTime)}
                        </p>
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-700 transform hover:scale-105 text-center"
                        >
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">
                    No meetings scheduled yet
                  </p>
                  <p className="text-gray-500">
                    Contact your admin to schedule meetings
                  </p>
                </div>
              )}
            </div>

            {/* Assignments Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Assignments
              </h2>
              {assignments.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment._id}
                      className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
                    >
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-indigo-600">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {assignment.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Deadline:</span>{" "}
                          {assignment.deadline
                            ? new Date(assignment.deadline).toLocaleString()
                            : "No deadline"}
                        </p>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Questions:
                          </p>
                          <ul className="list-disc pl-5 text-sm text-gray-600">
                            {assignment.questions.map((q, i) => (
                              <li key={i}>
                                <span className="font-semibold">
                                  [ {q.type} ]{" "}
                                </span>{" "}
                                {q.questionText} (Max Marks: {q.maxMarks})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button
                          onClick={() => deleteAssignment(assignment._id)}
                          className="w-full bg-red-500 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-red-600"
                        >
                          Delete Assignment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">
                    No assignments created yet
                  </p>
                </div>
              )}
            </div>

            {/* Student Submissions Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Student Submissions
              </h2>
              {Object.keys(submissions).some(
                (assignmentId) =>
                  submissions[assignmentId].submissions.length > 0
              ) ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  {Object.keys(submissions)
                    .filter(
                      (assignmentId) =>
                        submissions[assignmentId].submissions.length > 0
                    )
                    .map((assignmentId) => {
                      const assignment = assignments.find(
                        (a) => a._id === assignmentId
                      );
                      const subData = submissions[assignmentId];
                      const totalMaxMarks =
                        assignment?.questions.reduce(
                          (sum, q) => sum + (q.maxMarks || 1),
                          0
                        ) || 0;
                      return (
                        <div
                          key={assignmentId}
                          className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp"
                        >
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-indigo-600">
                              {subData.assignmentTitle ||
                                assignment?.title ||
                                "Untitled Assignment"}
                            </h3>
                            <div className="space-y-2">
                              {subData.submissions.map((submission) => (
                                <div
                                  key={submission._id}
                                  className="bg-white p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-all duration-200"
                                >
                                  <p className="text-sm">
                                    <span className="font-semibold text-gray-700">
                                      Student:
                                    </span>{" "}
                                    {submission.studentName ||
                                      "Unknown Student"}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-semibold text-gray-700">
                                      Submitted At:
                                    </span>{" "}
                                    {new Date(
                                      submission.submittedAt
                                    ).toLocaleString()}
                                  </p>
                                  <div className="text-sm">
                                    <p className="font-semibold text-gray-700">
                                      Answers:
                                    </p>
                                    <ul className="list-disc pl-5 text-gray-600">
                                      {submission.answers.map((ans, i) => {
                                        // Use index 'i' to get the corresponding question
                                        const question =
                                          assignment?.questions[i];
                                        return (
                                          <li key={i}>
                                            <span className="font-semibold">
                                              [{" "}
                                              {question
                                                ? question.type
                                                : "Unknown"}{" "}
                                              ]{" "}
                                              {question
                                                ? question.questionText
                                                : "Question not found"}
                                              :
                                            </span>{" "}
                                            {ans.answer || "No answer"}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                  <p className="text-sm mt-2">
                                    <span className="font-semibold text-gray-700">
                                      Marks:
                                    </span>{" "}
                                    {submission.marks !== null
                                      ? `${
                                          submission.marks
                                        }/${totalMaxMarks} (${Math.round(
                                          (submission.marks / totalMaxMarks) *
                                            100
                                        )}%)`
                                      : "Not graded"}
                                  </p>
                                  <div className="mt-2">
                                    {editingMarks[submission._id] ? (
                                      <div className="flex items-center space-x-2">
                                        <input
                                          type="number"
                                          min="0"
                                          max={totalMaxMarks}
                                          value={submission.marks || 0}
                                          onChange={(e) =>
                                            setSubmissions((prev) => ({
                                              ...prev,
                                              [assignmentId]: {
                                                ...prev[assignmentId],
                                                submissions: prev[
                                                  assignmentId
                                                ].submissions.map((sub) =>
                                                  sub._id === submission._id
                                                    ? {
                                                        ...sub,
                                                        marks:
                                                          parseInt(
                                                            e.target.value
                                                          ) || 0,
                                                      }
                                                    : sub
                                                ),
                                              },
                                            }))
                                          }
                                          className="w-20 border-gray-300 rounded-md shadow-sm p-1"
                                        />
                                        <button
                                          onClick={() =>
                                            updateMarks(
                                              assignmentId,
                                              submission._id,
                                              submission.marks
                                            )
                                          }
                                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() =>
                                            setEditingMarks((prev) => ({
                                              ...prev,
                                              [submission._id]: false,
                                            }))
                                          }
                                          className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          setEditingMarks((prev) => ({
                                            ...prev,
                                            [submission._id]: true,
                                          }))
                                        }
                                        className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600"
                                      >
                                        Update Marks
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">
                    No student submissions yet
                  </p>
                </div>
              )}
            </div>
            <CourseQuestions courseId={params.id} />

          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default InstructorCourseManagement;
