// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaSearch, FaThumbsUp, FaTrash, FaPlus } from "react-icons/fa";

const Forum = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "Can't select database",
      details:
        "While moving forward from the database name, I got an error that says 'Can't select database.'",
      author: "Signe Thompson",
      date: "21 Aug 2020",
      votes: 2,
    },
    {
      id: 2,
      text: "Reservation doesn't save unless phone is all numbers",
      details:
        "In the States, when someone enters their phone number, it usually includes dashes or parentheses. In the reservation form, data only gets saved to the database when it's numbers only. How can I change that?",
      author: "John Doe",
      date: "22 Aug 2020",
      votes: 5,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const filteredQuestions = questions.filter((question) =>
    question.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const updateVotes = (id, increment) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, votes: q.votes + increment } : q
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = {
      id: questions.length + 1,
      text: title,
      details,
      author: "Anonymous",
      date: new Date().toLocaleDateString(),
      votes: 0,
    };
    setQuestions([...questions, newQuestion]);
    setTitle("");
    setDetails("");
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-full">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700">Forum</h2>
        <button
          className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          onClick={() => setShowForm(true)}
        >
          <FaPlus className="text-lg" />
        </button>
      </div>
      <div className="relative mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 pl-8 sm:pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <FaSearch className="absolute top-1/2 left-3 sm:left-4 transform -translate-y-1/2 text-gray-500" />
      </div>
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((question) => (
          <div
            key={question.id}
            className="border-b border-gray-200 pb-3 sm:pb-4 mb-3 sm:mb-4 last:border-b-0 last:mb-0"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {question.text}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-2 line-clamp-3">
              {question.details}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4">
              <div>
                <span>By {question.author}</span> · <span>{question.date}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                <span className="text-blue-500">{question.votes} votes</span>
                <button
                  onClick={() => updateVotes(question.id, 1)}
                  className="text-gray-500 hover:text-blue-500 focus:ring-1 focus:ring-blue-300"
                >
                  <FaThumbsUp />
                </button>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="text-gray-500 hover:text-red-500 focus:ring-1 focus:ring-red-300"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center text-sm sm:text-base">
          No questions found.
        </p>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-3 sm:mb-4">
              Ask Your Question
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter your question title"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600">
                  Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full border rounded-lg p-2 sm:p-3 h-24 sm:h-28 focus:ring-2 focus:ring-blue-300"
                  placeholder="Provide more details about your question"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-blue-600"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
