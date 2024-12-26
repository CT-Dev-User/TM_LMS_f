const purchases = [
    {
      course: "Advanced React Development",
      image:
        "https://pluspng.com/img-png/react-logo-png-react-native-logo-svg-hd-png-img-transparent-png-image-860x853.png",
      date: "Oct 24, 2023",
      amount: "$99.00",
      status: "Completed",
      invoice: "Download",
    },
    {
      course: "UI/UX Design Masterclass",
      image:
        "https://pluspng.com/img-png/react-logo-png-react-native-logo-svg-hd-png-img-transparent-png-image-860x853.png",
      date: "Sep 15, 2023",
      amount: "$79.00",
      status: "Completed",
      invoice: "Download",
    },
    {
      course: "Python for Data Science",
      image:
        "https://th.bing.com/th/id/OIP.EDJ9xoErBbZqK2tExVoJfAHaHY?rs=1&pid=ImgDetMain",
      date: "Aug 03, 2023",
      amount: "$129.00",
      status: "Pending",
      invoice: "Download",
    },
  ];
  const PurchaseHistory = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
            Purchase History
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            View all your course purchases and transactions
          </p>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search purchases..."
              className="border border-gray-300 p-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <div className="flex items-center space-x-4 ml-auto">
              <select className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300">
                <option>All Time</option>
                <option>Last Month</option>
                <option>Last Year</option>
              </select>
              <button className="bg-black text-white p-2 rounded-lg hover:bg-gray-800">
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Course
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 sm:py-2 sm:px-3 text-gray-800 border-b flex items-center space-x-2">
                      <img
                        src={purchase.image}
                        alt={purchase.course}
                        className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                      />
                      <span className="text-sm sm:text-base truncate whitespace-nowrap overflow-hidden">
                        {purchase.course}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:py-2 sm:px-3 text-gray-800 border-b text-sm sm:text-base truncate whitespace-nowrap overflow-hidden">
                      {purchase.date}
                    </td>
                    <td className="py-3 px-4 sm:py-2 sm:px-3 text-gray-800 border-b truncate whitespace-nowrap overflow-hidden">
                      {purchase.amount}
                    </td>
                    <td className="py-3 px-4 sm:py-2 sm:px-3 border-b truncate whitespace-nowrap overflow-hidden">
                      <span
                        className={`text-sm font-medium py-1 px-3 rounded-lg ${
                          purchase.status === "Completed"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:py-2 sm:px-3 text-blue-500 border-b hover:underline cursor-pointer truncate whitespace-nowrap overflow-hidden">
                      {purchase.invoice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  export default PurchaseHistory;