import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../main";

const TestPlayer = ({ assignment, courseId, onBack, userRole }) => {
  const [submissionData, setSubmissionData] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const userId = localStorage.getItem("userId");

  // Fetch submission status from server
  const fetchSubmissionStatus = async () => {
    try {
      const response = await axios.get(`${server}/api/assignment/${assignment._id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      const data = response.data;
      console.log("Full Server Response:", data);
      console.log("Your User ID:", userId);
      console.log("Submissions:", data.assignment.submissions);

      // Find submission matching userId
      const studentSubmission = data.assignment.submissions.find((sub) => {
        const studentId = sub.student._id ? sub.student._id.toString() : sub.student.toString();
        console.log("Comparing:", studentId, "with", userId);
        return studentId === userId;
      });
      console.log("Your Submission:", studentSubmission);

      const submitted = !!studentSubmission;
      setHasSubmitted(submitted); // Update state based on server data
      if (submitted) {
        setSubmissionResult(studentSubmission);
      }
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchSubmissionStatus();
  }, [assignment._id, userId]);

  // Handle answer selection
  const handleSubmissionChange = (questionIndex, answer) => {
    setSubmissionData((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  // Submit assignment
  const submitAssignment = async () => {
    const answers = Object.entries(submissionData).map(([questionIndex, answer]) => ({
      questionIndex: parseInt(questionIndex),
      answer,
    }));

    if (answers.length === 0) {
      toast.error("Please answer at least one question.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${server}/api/assignment/${assignment._id}/submit`,
        { answers },
        { headers: { token: localStorage.getItem("token") } }
      );
      const data = response.data;
      console.log("Submit Response:", data);

      toast.success("Test submitted successfully!");
      setHasSubmitted(true); // Set immediately on success
      setSubmissionResult(data.submission || { answers }); // Use server data or fallback
      await fetchSubmissionStatus(); // Confirm with server
      // Removed setTimeout(() => onBack(), 1500); so it doesn't auto-redirect
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit test.";
      console.error("Submit Error:", error.response?.data || error.message);
      if (errorMessage === "You have already submitted this assignment") {
        setHasSubmitted(true); // If already submitted, reflect it in UI
        await fetchSubmissionStatus(); // Double-check server state
        toast.error("You have already submitted this assignment.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  const isPastDeadline = assignment.deadline && new Date() > new Date(assignment.deadline);
  const totalQuestions = assignment.questions.length;
  const answeredQuestions = Object.keys(submissionData).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const checkAnswerCorrectness = (question, answer) => {
    if (question.type === "free-text") return null;
    const correctOption = question.options.find((opt) => opt.isCorrect);
    return correctOption && correctOption.text === answer;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-start p-4 sm:p-6 animate-fadeIn mt-12">
      <header className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{assignment.title}</h1>
          <p className="text-sm text-gray-600">{assignment.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            Deadline: {assignment.deadline ? new Date(assignment.deadline).toLocaleString() : "No deadline"}
          </p>
        </div>
       
      </header>

      <main className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 flex-1">
        {hasSubmitted ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-600 text-center">Submission Complete!</h2>
            {submissionResult && (
              <div className="space-y-4">
                {assignment.questions.map((question, index) => {
                  const submittedAnswer = submissionResult.answers.find(
                    (ans) => ans.questionIndex === index
                  )?.answer;
                  const isCorrect = checkAnswerCorrectness(question, submittedAnswer);

                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-lg font-medium text-gray-800 mb-3">
                        {index + 1}. {question.questionText}{" "}
                        <span className="text-sm text-gray-500">
                          ({question.type}, Max Marks: {question.maxMarks})
                        </span>
                      </p>
                      <p className="text-gray-700">Your Answer: {submittedAnswer || "Not answered"}</p>
                      {question.type !== "free-text" && submittedAnswer && (
                        <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {isCorrect ? "Correct" : "Wrong"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="text-center py-4">
              <button
                onClick={onBack}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Return to Course
              </button>
            </div>
          </div>
        ) : isPastDeadline ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-red-600">Deadline Passed</h2>
            <p className="text-gray-600 mt-2">You can no longer submit this test.</p>
            <button
              onClick={onBack}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Return to Course
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Progress: {answeredQuestions}/{totalQuestions} questions answered
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              {assignment.questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  <p className="text-lg font-medium text-gray-800 mb-3">
                    {index + 1}. {question.questionText}{" "}
                    <span className="text-sm text-gray-500">
                      ({question.type}, Max Marks: {question.maxMarks})
                    </span>
                  </p>
                  {question.type === "mcq" && (
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center space-x-3 text-gray-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            checked={submissionData[index] === option.text}
                            onChange={() => handleSubmissionChange(index, option.text)}
                            className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm sm:text-base">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {question.type === "true-false" && (
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center space-x-3 text-gray-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            checked={submissionData[index] === option.text}
                            onChange={() => handleSubmissionChange(index, option.text)}
                            className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm sm:text-base">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {question.type === "free-text" && (
                    <textarea
                      className="w-full h-28 p-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder="Type your answer here..."
                      value={submissionData[index] || ""}
                      onChange={(e) => handleSubmissionChange(index, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={isLoading}
                className={`px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Submitting..." : "Submit Test"}
              </button>
            </div>

            {showConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg animate-slideUp">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Submission</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to submit your test? You have answered {answeredQuestions} out of {totalQuestions} questions.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitAssignment}
                      disabled={isLoading}
                      className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Submitting..." : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
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
          animation: fadeIn 0.5s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-in-out;
        }

        @media (max-width: 640px) {
          .text-2xl {
            font-size: 1.25rem;
          }
          .text-lg {
            font-size: 1rem;
          }
          .text-sm {
            font-size: 0.875rem;
          }
          .px-6 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .py-3 {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          .h-28 {
            height: 6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TestPlayer;