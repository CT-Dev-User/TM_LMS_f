/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../main";
import { UserData } from "../context/UserContext";
import Sidebar from "./Sidebar";

const Students = ({ user }) => {
  const navigate = useNavigate();
  const { isAuth } = UserData();
  const params = useParams(); // Get course ID from URL params

  // Redirect if user is not authenticated or not an instructor
  if (!isAuth || (user && user.role !== "instructor")) {
    return navigate("/login");
  }

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSubmissions, setStudentSubmissions] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Fetch all students
  async function fetchStudents() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      const nonAdminUsers = data.users.filter(
        (u) => !["admin", "instructor"].includes(u.role)
      );
      setStudents(nonAdminUsers);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }

  // Fetch assignments for the course
  async function fetchAssignments() {
    try {
      const { data } = await axios.get(`${server}/api/course/${params.id}/assignments`, {
        headers: { token: localStorage.getItem("token") },
      });
      setAssignments(data.assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  }

  // Fetch submissions for a specific student
  async function fetchStudentSubmissions(studentId) {
    setLoadingSubmissions(true);
    try {
      const submissionsData = {};
      for (const assignment of assignments) {
        try {
          const { data: subData } = await axios.get(
            `${server}/api/assignment/${assignment._id}/submissions`,
            { headers: { token: localStorage.getItem("token") } }
          );
          const studentSubs = subData.submissions.filter(
            (sub) => sub.studentId === studentId
          );
          if (studentSubs.length > 0) {
            submissionsData[assignment._id] = {
              assignmentTitle: assignment.title,
              submissions: studentSubs,
            };
          }
        } catch (subError) {
          console.error(`Error fetching submissions for assignment ${assignment._id}:`, subError);
        }
      }
      setStudentSubmissions(submissionsData);
    } catch (error) {
      console.error("Error fetching student submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  }

  // Handle clicking a student's name
  const handleStudentClick = (student) => {
    if (selectedStudent && selectedStudent._id === student._id) {
      setSelectedStudent(null); // Hide submissions if clicked again
      setStudentSubmissions({});
    } else {
      setSelectedStudent(student);
      fetchStudentSubmissions(student._id);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchAssignments();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-r from-indigo-50 to-blue-100">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto py-12 px-4 sm:px-6 lg:px-8  lg:ml-[17%] xl:ml-[20%] ipadpro:ml-[24%] ipadpro-landscape:ml-[20%]">
        <div className="max-w-7xl mx-auto animate-fadeIn">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-indigo-800">
            Your Students
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="hidden sm:table-row">
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <React.Fragment key={student._id}>
                      {/* Mobile View (Stacked) */}
                      <tr className="sm:hidden">
                        <td
                          colSpan="4"
                          className="px-2 py-2 border-b border-gray-200"
                        >
                          <div
                            className="text-sm text-indigo-600 font-semibold cursor-pointer hover:underline"
                            onClick={() => handleStudentClick(student)}
                          >
                            {student.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            Role: {student.role}
                          </div>
                        </td>
                      </tr>
                      {/* Tablet/Desktop View (Table) */}
                      <tr className="hidden sm:table-row hover:bg-gray-50 transition-colors">
                        <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className="text-indigo-600 cursor-pointer hover:underline"
                            onClick={() => handleStudentClick(student)}
                          >
                            {student.name}
                          </span>
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                          {student.role}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-2 py-2 sm:px-4 sm:py-3 text-center text-sm text-gray-600"
                    >
                      No students available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Submissions Section */}
          {selectedStudent && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Submissions for {selectedStudent.name}
              </h2>
              {loadingSubmissions ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : Object.keys(studentSubmissions).length > 0 ? (
                <div className="space-y-6">
                  {Object.keys(studentSubmissions).map((assignmentId) => {
                    const assignment = assignments.find((a) => a._id === assignmentId);
                    const subData = studentSubmissions[assignmentId];
                    const totalMaxMarks = assignment?.questions.reduce(
                      (sum, q) => sum + (q.maxMarks || 1),
                      0
                    ) || 0;

                    return (
                      <div
                        key={assignmentId}
                        className="bg-gray-50 p-4 rounded-lg shadow-md"
                      >
                        <h3 className="text-lg font-semibold text-indigo-600">
                          {subData.assignmentTitle || "Untitled Assignment"}
                        </h3>
                        <div className="space-y-2">
                          {subData.submissions.map((submission) => (
                            <div
                              key={submission._id}
                              className="bg-white p-3 rounded-md border border-gray-200"
                            >
                              <p className="text-sm">
                                <span className="font-semibold text-gray-700">Submitted At:</span>{" "}
                                {new Date(submission.submittedAt).toLocaleString()}
                              </p>
                              <div className="text-sm">
                                <p className="font-semibold text-gray-700">Answers:</p>
                                <ul className="list-disc pl-5 text-gray-600">
                                  {submission.answers.map((ans, i) => {
                                    const question = assignment?.questions[i];
                                    return (
                                      <li key={i}>
                                        <span className="font-semibold">
                                          [ {question ? question.type : "Unknown"} ]{" "}
                                          {question ? question.questionText : "Question not found"}:
                                        </span>{" "}
                                        {ans.answer || "No answer"}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                              <p className="text-sm mt-2">
                                <span className="font-semibold text-gray-700">Marks:</span>{" "}
                                {submission.marks !== null
                                  ? `${submission.marks}/${totalMaxMarks} (${Math.round(
                                      (submission.marks / totalMaxMarks) * 100
                                    )}%)`
                                  : "Not graded"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 text-lg text-center py-4">
                  No submissions found for this student.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Students;