import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiClock } from "react-icons/fi";
import { PiHandCoinsLight } from "react-icons/pi";
import { TfiWallet } from "react-icons/tfi";
import { server } from "../main";
import Sidebar from "./Sidebar";

const PayoutReport = () => {
    const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [requestedAmount, setRequestedAmount] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [withdrawalEntered, setWithdrawalEntered] = useState(false);
    const [withdrawalData, setWithdrawalData] = useState(null);
    const [payoutHistory, setPayoutHistory] = useState([]);
    const [totalPayoutAmount, setTotalPayoutAmount] = useState(0);

    useEffect(() => {
        fetchPayoutData();
    }, []);

    const handleWithdrawalButtonClick = () => {
        if (!withdrawalEntered) {
            setShowWithdrawalForm(true);
        }
    };

    const fetchPayoutData = async () => {
        try {
            const token = localStorage.getItem("token");

            const summaryResponse = await axios.get(`${server}/api/summary`, {
                headers: { token }
                // Remove withCredentials: true
            });

            const historyResponse = await axios.get(`${server}/api/history`, {
                headers: { token }
                // Remove withCredentials: true
            });

            const { pendingAmount, totalPayoutAmount, requestedAmount, lastRequestDate } = summaryResponse.data;

            setPendingAmount(pendingAmount);
            setTotalPayoutAmount(totalPayoutAmount);
            setRequestedAmount(requestedAmount);
            setPayoutHistory(historyResponse.data);

            if (requestedAmount > 0) {
                setWithdrawalEntered(true);
                const pendingRequest = historyResponse.data.find(p => p.status === 'pending');
                setWithdrawalData({
                    _id: pendingRequest?._id,
                    amount: requestedAmount,
                    date: new Date(lastRequestDate).toLocaleDateString()
                });
            } else {
                setWithdrawalEntered(false);
                setWithdrawalData(null);
            }
        } catch (error) {
            console.error('Error fetching payout data:', error);
            toast.error("Failed to fetch payout data");
        }
    };


    const handleWithdrawalFormSubmit = async (e) => {
        e.preventDefault();
        const amount = parseFloat(withdrawalAmount);
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(`${server}/api/request`,
                { amount },
                { headers: { token } }
            );

            setWithdrawalEntered(true);
            setWithdrawalData({
                _id: response.data._id,
                amount: amount,
                date: new Date().toLocaleDateString()
            });
            setRequestedAmount(amount);
            await fetchPayoutData();
            setShowWithdrawalForm(false);
            setWithdrawalAmount('');
            toast.success("Withdrawal request submitted successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request");
        }
    };

    const handleDeleteWithdrawal = async (payoutId) => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(`${server}/api/request/${payoutId}`, {
                headers: { token }
            });

            setWithdrawalEntered(false);
            setWithdrawalData(null);
            setRequestedAmount(0);
            await fetchPayoutData();
            toast.success("Withdrawal request deleted successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete request");
        }
    };

    return (
        <div className="flex h-[100dvh] bg-gradient-to-r from-indigo-50 to-blue-100 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <main className="flex-1 p-4 lg:ml-64 overflow-y-auto">
              <div className="max-w-7xl mx-auto h-full flex flex-col">
                <div className="space-y-4 flex flex-col h-full">
                  {/* Header Section */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-indigo-800">Payout Report</h2>
                    <button
                      className={`text-sm sm:text-base font-bold py-1 px-3 sm:py-2 sm:px-4 rounded ${
                        withdrawalEntered
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white whitespace-nowrap`}
                      onClick={withdrawalEntered ? () => handleDeleteWithdrawal(withdrawalData._id) : handleWithdrawalButtonClick}
                    >
                      {withdrawalEntered ? 'Delete Request' : '+ New withdrawal'}
                    </button>
                  </div>
      
                  {/* Withdrawal Form Modal */}
                  {showWithdrawalForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-11/12 sm:w-96">
                        <h3 className="font-bold text-lg mb-4">Request a new withdrawal</h3>
                        <form onSubmit={handleWithdrawalFormSubmit}>
                          <input
                            type="number"
                            className="border rounded w-full px-3 py-2 mb-4"
                            value={withdrawalAmount}
                            onChange={(e) => setWithdrawalAmount(e.target.value)}
                            required
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              className="bg-gray-300 text-gray-700 font-bold py-1 px-3 sm:py-2 sm:px-4 rounded hover:bg-gray-400"
                              onClick={() => setShowWithdrawalForm(false)}
                            >
                              Close
                            </button>
                            <button
                              type="submit"
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded"
                            >
                              Request
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
      
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md flex items-center">
                      <div className="bg-red-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl text-red-500 mr-3 sm:mr-4">
                        <FiClock />
                      </div>
                      <div>
                        <div className="text-sm sm:text-base font-semibold">Pending amount</div>
                        <div className="font-bold text-lg sm:text-xl">₹{pendingAmount}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md flex items-center">
                      <div className="bg-green-200 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl text-green-500 mr-3 sm:mr-4">
                        <TfiWallet />
                      </div>
                      <div>
                        <div className="text-sm sm:text-base font-semibold">Total payout amount</div>
                        <div className="font-bold text-lg sm:text-xl">₹{totalPayoutAmount}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md flex items-center">
                      <div className="bg-blue-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl text-blue-500 mr-3 sm:mr-4">
                        <PiHandCoinsLight />
                      </div>
                      <div>
                        <div className="text-sm sm:text-base font-semibold">Requested amount</div>
                        <div className="font-bold text-lg sm:text-xl">₹{requestedAmount}</div>
                      </div>
                    </div>
                  </div>
      
                  {/* Table Section */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden flex-grow flex flex-col">
                    {payoutHistory.length === 0 ? (
                      <div className="flex-grow flex flex-col items-center justify-center p-8 text-gray-500">
                        <div className="text-4xl mb-4">📭</div>
                        <h3 className="text-lg font-medium mb-1">No withdrawals yet</h3>
                        <p className="text-sm text-center">Your withdrawal history will appear here once you make requests</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto flex-grow">
                        <table className="w-full h-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">#</th>
                              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Amount</th>
                              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Status</th>
                              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {payoutHistory.map((payout, index) => (
                              <tr key={payout._id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm sm:text-base">{index + 1}</td>
                                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm sm:text-base">₹{payout.amount}</td>
                                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      payout.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : payout.status === 'processed' || payout.status === 'approved'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {payout.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm sm:text-base">
                                  {new Date(payout.dateRequested).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
};

export default PayoutReport;

