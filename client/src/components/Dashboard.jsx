import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import Navbar from "./Navbar";
import MemoList from "./Dashboardcomponent/MemoList";
import PaymentPopup from "./Dashboardcomponent/PaymentPopup";
import ComplaintPage from "./Dashboardcomponent/ComplaintPage";
import DetailsPage from './Dashboardcomponent/DetailsPage'

const Dashboard = () => {
  const { user } = useAuth();
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [showComplaintPage, setShowComplaintPage] = useState(false);
  const [complaintMemo, setComplaintMemo] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0 });
  const [showDetailsPage, setShowDetailsPage] = useState(false);
  // Fetch memos for logged-in user
  useEffect(() => {
    if (user?.vehicle_ID) {
      fetch(`http://localhost:5000/api/memos/${user.vehicle_ID}`)
        .then((res) => res.json())
        .then((data) => {
          setMemos(data);
          calculateStats(data);
          setLoading(false);
    console.log(memos);

        })
        .catch((err) => {
          console.error("Error fetching memos:", err);
          setLoading(false);
        });
    } else {
      setMemos([]);
      setStats({ total: 0, pending: 0, paid: 0 });
      setLoading(false);
    }

  }, [user]);

  const calculateStats = (memoData) => {
    const total = memoData.length;
    const pending = memoData.filter(m => m.status === "pending" || m.status === "unpaid").length;
    const paid = memoData.filter(m => m.status === "paid").length;
    setStats({ total, pending, paid });
  };

const handleViewDetails = (memo) => {
  setSelectedMemo(memo);
  setShowDetailsPage(true);
};

if (showDetailsPage && selectedMemo) {
  return (
    <>
      <Navbar />
      <DetailsPage 
        memo={selectedMemo} 
        onBack={() => setShowDetailsPage(false) &  setSelectedMemo(null)} 
      />
    </>
    
  );
}


  // Handle payment success
  const handlePaymentSuccess = (id) => {
    const updatedMemos = memos.map(m => m._id === id ? { ...m, status: "paid" } : m);
    setMemos(updatedMemos);
    setSelectedMemo(null);
    calculateStats(updatedMemos);
  };
// Pass the full memo object to ComplaintPage
const handleFileComplaint = (memo) => {
  setComplaintMemo(memo);
  setShowComplaintPage(true);
};

  // Handle cancel complaint
  const handleCancelComplaint = () => {
    setComplaintMemo(null);
    setShowComplaintPage(false);
  };

  // Handle submit complaint
  const handleSubmitComplaint = async (memoId, remark) => {
    try {
      // API call to submit complaint
      const response = await fetch(`http://localhost:5000/api/complaint/createComplaint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memo_ID:memoId,
          remark: remark,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      // const updatedMemo = await response.json();

      // Update memo in state
      // const updatedMemos = memos.map(memo => 
      //   memo._id === memoId 
      //     ? { ...memo, complaint: remark, complaintDate: new Date().toISOString() }
      //     : memo
      // );
      
      // setMemos(updatedMemos);
      // calculateStats(updatedMemos);
      
      // Return to dashboard
      // handleCancelComplaint();
      
      // Show success message
      alert('Complaint filed successfully! It will be reviewed by the authorities.');
    } catch (error) {
      console.error('Error filing complaint:', error);
      alert('Error filing complaint. Please try again.');
    }
  };

  // If complaint page is active, show ComplaintPage component
  if (showComplaintPage && complaintMemo) {
    return (
      <>
        <Navbar />
        <ComplaintPage
          memo={complaintMemo}
          onCancel={handleCancelComplaint}
          onSubmitComplaint={handleSubmitComplaint}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6 pt-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Welcome back, {user?.name || "Driver"}! 🚗
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your traffic memos and stay updated with your vehicle status
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Vehicle ID</div>
                <div className="text-2xl font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl">
                  {user?.vehicle_ID}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Memos</p>
                  <p className="text-3xl font-bold mt-2">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Paid</p>
                  <p className="text-3xl font-bold mt-2">{stats.paid}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Memos Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 border-b border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Your Traffic Memos
            </h2>
            <p className="text-gray-600 mt-2">Manage and pay your pending traffic violations</p>
          </div>

          <div className="p-8">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {!user && !loading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h3>
                <p className="text-gray-500 mb-6">Please log in to view your traffic memos</p>
                <a
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Sign In Now
                </a>
              </div>
            )}

            {user && !loading && (
              <>
                {memos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Memos</h3>
                    <p className="text-gray-500">Great! You don't have any pending traffic violations.</p>
                  </div>
                ) : (
                  <MemoList 
                    memos={memos} 
                    onPayClick={setSelectedMemo}
                    onFileComplaint={handleFileComplaint}
                    onViewDetails={handleViewDetails} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {selectedMemo && (
        <PaymentPopup
          memo={selectedMemo}
          onClose={() => setSelectedMemo(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;