
import React, { useEffect, useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import './PurcHis.css';
import Sidebar from "../../components/Sidebar/Sidebar"; // Adjust the import path as necessary
import { UserData } from "../../context/UserContext"; // Assuming you need user data

const PurchaseHistory = () => {
  const { user } = UserData();
  const { purchaseHistory, fetchPurchaseHistory, mycourse: myCourses } = CourseData();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPurchaseHistory = async () => {
      try {
        await fetchPurchaseHistory();
      } catch (error) {
        console.log("Error loading purchase history:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPurchaseHistory();

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getFilteredPurchases = () => {
    let filtered = Array.isArray(purchaseHistory) ? [...purchaseHistory] : [];
    
    if (searchTerm) {
      filtered = filtered.filter(purchase => 
        purchase.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const now = new Date();
    
    switch(timeFilter) {
      case 'month':
        { const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        filtered = filtered.filter(purchase => {
          const purchaseDate = new Date(purchase.date);
          return purchaseDate >= lastMonth && purchaseDate <= lastDayOfMonth;
        });
        break; }
        
      case 'year':
        { const lastYear = new Date(now);
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        filtered = filtered.filter(purchase => {
          const purchaseDate = new Date(purchase.date);
          return purchaseDate >= lastYear;
        });
        break; }
        
      default:
        break;
    }
    
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    return filtered;
  };

  const handleExport = () => {
    const filteredData = getFilteredPurchases();
    const csvContent = [
      ['Course', 'Date', 'Amount', 'Status', 'Invoice'],
      ...filteredData.map(purchase => [
        purchase.course,
        new Date(purchase.date).toLocaleDateString(),
        purchase.amount,
        purchase.status,
        purchase.invoice
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  if (loading) {
    return (
      <div className="w-full flex-grow flex flex-col">
        <div className="flex flex-grow relative">
          <div className="h-screen flex items-center justify-center animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  const filteredPurchases = getFilteredPurchases();

  return (
    <div className="w-full flex-grow flex flex-col">
      <div className="flex flex-grow relative">
        <div
          className={`custom-margin w-[16%] ml-8 md:w-[10%] lg:w-[1%] ipad:w-[17%] ipad-landscape:w-[17%] ipad-pro:w-[17%] ipad-pro-landscape:w-[17%] ${
            isSidebarOpen || isLargeScreen ? "block" : "hidden"
          }`}
        >
          <Sidebar
            isSidebarOpen={isSidebarOpen || isLargeScreen}
            setIsSidebarOpen={setIsSidebarOpen}
            user={user}
            course={myCourses}
          />
        </div>

        <main
          className={`flex-grow p-4 animate-fadeIn ${
            isSidebarOpen || isLargeScreen
              ? "lg:ml-[17%] ipad:ml-[17%] ipad-landscape:ml-[17%] ipad-pro:ml-[17%] ipad-pro-landscape:ml-[20%]"
              : ""
          }`}
        >
          <div className="purchase-container">
            <div className="purchase-card">
              <h1 className="purchase-title">Purchase History</h1>
              <p className="purchase-subtitle">View all your course purchases and transactions</p>

              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search purchases..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="filter-container">
                  <select 
                    className="filter-select"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                  <button className="export-button" onClick={handleExport}>
                    Export
                  </button>
                </div>
              </div>

              <div className="table-container">
                {filteredPurchases.length === 0 ? (
                  <div className="no-purchases">
                    <p>No subscription history found for the selected period</p>
                    <button 
                      onClick={() => navigate('/courses')} 
                      className="browse-courses-btn"
                    >
                      <MdDashboard />
                      Get Subscription
                    </button>
                  </div>
                ) : (
                  <table className="purchase-table">
                    <thead className="table-header">
                      <tr>
                        <th>Course</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.map((purchase, index) => (
                        <tr key={index} className="table-row">
                          <td className="course-cell">
                            <img
                              src={purchase.image}
                              alt={purchase.course}
                              className="course-image"
                            />
                            <span>{purchase.course}</span>
                          </td>
                          <td>{new Date(purchase.date).toLocaleDateString()}</td>
                          <td>{purchase.amount}</td>
                          <td>
                            <span className={`status-badge ${purchase.status === 'Completed' ? 'status-completed' : 'status-pending'}`}>
                              {purchase.status}
                            </span>
                          </td>
                          <td className="invoice-link">{purchase.invoice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PurchaseHistory;