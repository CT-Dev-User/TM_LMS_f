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
        <div className="flex h-screen bg-gradient-to-r from-indigo-50 to-blue-100">
    <Sidebar />
    <div className="flex-1 overflow-auto scrollbar-hide">
        <main className="animate-fadeIn p-6  lg:ml-64">
            <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-800">Payout Report</h2>

                    <button
                        className={`text-lg font-bold py-2 px-4 rounded ${withdrawalEntered
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                        onClick={withdrawalEntered ? () => handleDeleteWithdrawal(withdrawalData._id) : handleWithdrawalButtonClick}
                    >
                        {withdrawalEntered ? 'Delete Withdrawal Request' : '+ Request a new withdrawal'}
                    </button>


                    {showWithdrawalForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                                <h3 className="font-bold mb-4">Request a new withdrawal</h3>
                                <form onSubmit={handleWithdrawalFormSubmit}>
                                    <input
                                        type="number"
                                        className="border rounded w-full px-3 py-2 mb-4"
                                        value={withdrawalAmount}
                                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mr-2 hover:bg-gray-400"
                                            onClick={() => setShowWithdrawalForm(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Request a withdrawal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <br/>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white p-4 rounded-lg shadow-md flex items-center min-h-[8rem]">
                                <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center text-3xl text-red-500 mr-4">
                                    <FiClock />
                                </div>
                                <div className="font-bold">
                                    Pending amount <br /> <p>₹{pendingAmount}</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md flex items-center min-h-[8rem]">
                                <div className="bg-green-200 rounded-full w-12 h-12 flex items-center justify-center text-3xl text-green-500 mr-4">
                                    <TfiWallet />
                                </div>
                                <div className="font-bold">
                                    Total payout amount <br /> <p>₹{totalPayoutAmount}</p>
                                </div>

                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md flex items-center min-h-[8rem]">
                                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center text-3xl text-blue-500 mr-4">
                                    <PiHandCoinsLight />
                                </div>
                                <div className="font-bold">
                                    Requested withdrawal amount <br />
                                    <p>₹{requestedAmount}</p>

                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-collapse table-auto shadow-md bg-white text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">#</th>
                                        <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Payout amount</th>
                                        <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Status</th>
                                        <th className="border px-2 py-1 sm:px-4 sm:py-2 text-left">Date requested</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payoutHistory.map((payout, index) => (
                                        <tr key={payout._id} className='hover:bg-gray-100'>
                                            <td className="border px-2 py-1 sm:px-4 sm:py-2">{index + 1}</td>
                                            <td className="border px-2 py-1 sm:px-4 sm:py-2">₹{payout.amount}</td>
                                            <td className="border px-2 py-1 sm:px-4 sm:py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs ${payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        payout.status === 'processed' || payout.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {payout.status}
                                                </span>
                                            </td>
                                            <td className="border px-2 py-1 sm:px-4 sm:py-2">
                                                {new Date(payout.dateRequested).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        </div>
    );
};

export default PayoutReport;

