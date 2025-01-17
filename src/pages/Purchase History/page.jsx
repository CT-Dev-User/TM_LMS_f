/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const purchases = [
  {
    course: "Advanced React Development",
    image: "https://pluspng.com/img-png/react-logo-png-react-native-logo-svg-hd-png-img-transparent-png-image-860x853.png",
    date: "2025-1-1",
    amount: "$99.00",
    status: "Completed",
    invoice: "Download",
  },
  {
    course: "UI/UX Design Masterclass",
    image: "https://pluspng.com/img-png/react-logo-png-react-native-logo-svg-hd-png-img-transparent-png-image-860x853.png",
    date: "2023-09-15",
    amount: "$79.00",
    status: "Completed",
    invoice: "Download",
  },
  {
    course: "Python for Data Science",
    image: "https://th.bing.com/th/id/OIP.EDJ9xoErBbZqK2tExVoJfAHaHY?rs=1&pid=ImgDetMain",
    date: "2024-12-03",
    amount: "$129.00",
    status: "Pending",
    invoice: "Download",
  },
  {
    course: "Machine Learning Bootcamp",
    image: "https://via.placeholder.com/50",
    date: "2022-12-12",
    amount: "$150.00",
    status: "Completed",
    invoice: "Download",
  },
  {
    course: "JavaScript Essentials",
    image: "https://via.placeholder.com/50",
    date: "2022-11-05",
    amount: "$49.00",
    status: "Completed",
    invoice: "Download",
  },
];

const PurchaseHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All Time");

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      searchTerm === "" ||
      purchase.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = (() => {
      if (filter === "All Time") return true;

      const purchaseDate = new Date(purchase.date);
      const now = new Date();

      if (filter === "Last Month") {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        return (
          purchaseDate.getFullYear() === lastMonth.getFullYear() &&
          purchaseDate.getMonth() === lastMonth.getMonth()
        );
      }

      if (filter === "Last Year") {
        return purchaseDate.getFullYear() === now.getFullYear() - 1;
      }

      return false;
    })();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6">
      <div className="mt-10 max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4">
          Purchase History
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          View all your course purchases and transactions
        </p>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search purchases..."
            className="flex-grow sm:flex-grow-0 sm:w-64 border border-gray-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <select
              className="border border-gray-300  rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All Time</option>
              <option >Last Month</option>
              <option>Last Year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300">
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                      <img
                        src={purchase.image}
                        alt={purchase.course}
                        className="w-10 h-10 rounded-lg"
                      />
                      <div className="text-sm font-medium text-gray-900">
                        {purchase.course}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(purchase.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5  rounded-full text-xs font-medium ${
                          purchase.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 hover:underline cursor-pointer">
                      {purchase.invoice}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No purchases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;