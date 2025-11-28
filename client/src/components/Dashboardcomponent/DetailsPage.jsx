import React from 'react';

const DetailsPage = ({ memo, onBack }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return 'N/A';
    try {
      const due = new Date(dueDate);
      const today = new Date();
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays} days remaining` : 'Overdue';
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Added margin-top for spacing from navbar */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Violation Details</h1>
                <p className="text-gray-600 mt-2">Complete information about your traffic violation</p>
              </div>
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Basic Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Violation Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <label className="block text-sm font-medium text-red-700 mb-2">Rule Broken  :  </label>
                      <span className="font-semibold text-red-800 text-lg">{memo.rule_Broken}</span>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <label className="block text-sm font-medium text-blue-700 mb-2">Location</label>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="text-gray-700">{memo.fullDetails?.location || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <label className="block text-sm font-medium text-yellow-700 mb-2">Fine Amount   :  </label>
                      <span className="text-2xl font-bold text-red-600">₹{memo.fine_Amount}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status   : </label>
                      <span className={`text-lg font-semibold ${
                        memo.status === "paid" ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {memo.status === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <label className="block text-sm font-medium text-purple-700 mb-2">Vehicle Information</label>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle ID:</span>
                          <span className="font-medium">{memo.vehicle_ID}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">License Plate:</span>
                          <span className="font-medium bg-white px-2 py-1 rounded border border-purple-300">
                            {memo.fullDetails?.plate_text || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <label className="block text-sm font-medium text-green-700 mb-2">Violation Date</label>
                      <span className="text-gray-700">{formatDate(memo.fullDetails?.timestamp?.$date || memo.fullDetails?.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Image - Direct Display */}
                {memo.fullDetails?.evidence_path && (
                  <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-4">Evidence</label>
                    <div className="flex flex-col items-center space-y-4">
                      <img 
                        src={memo.fullDetails.evidence_path} 
                        alt="Violation Evidence" 
                        className="w-full max-w-md rounded-lg object-cover border-2 border-gray-300 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                        onClick={() => window.open(memo.fullDetails.evidence_path, '_blank')}
                      />
                      <button 
                        onClick={() => window.open(memo.fullDetails.evidence_path, '_blank')}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v0a2 2 0 012-2h0a2 2 0 012 2v0m0 0v0a2 2 0 002 2v0a2 2 0 00-2-2v0z" />
                        </svg>
                        Open Full Image in New Tab
                      </button>
                    </div>
                  </div>
                )}

                {/* Violation Details */}
                {memo.fullDetails?.violation_details && (
                  <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                    <label className="block text-sm font-medium text-orange-700 mb-4">Violation Breakdown</label>
                    <div className="space-y-4">
                      {memo.fullDetails.violation_details.map((detail, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg border border-orange-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-orange-800 capitalize text-lg">
                              {detail.type?.replace(/-/g, ' ')}
                            </span>
                            <span className="text-xl font-bold text-red-600">₹{detail.charge}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{detail.description}</p>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Due in: {detail.due_days} days</span>
                            {memo.fullDetails.confidence_scores?.[index] && (
                              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                Confidence: {(memo.fullDetails.confidence_scores[index] * 100).toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Additional Details */}
              <div className="space-y-6">
                {/* Payment Information */}
                <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                  <label className="block text-sm font-medium text-green-700 mb-4">Payment Information</label>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-semibold ${
                        memo.status === "paid" ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {memo.status === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                    
                    {memo.status === "paid" ? (
                      // Show payment completion details when paid
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payment Completed:</span>
                          <span className="font-medium text-green-600">
                            {formatDate(memo.fullDetails?.payment_info?.paid_date?.$date || memo.fullDetails?.payment_info?.paid_date)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium capitalize">
                            {memo.fullDetails?.payment_info?.payment_method || 'Online'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Amount Paid:</span>
                          <span className="font-medium text-green-600">
                            ₹{memo.fullDetails?.payment_info?.paid_amount || memo.fine_Amount}
                          </span>
                        </div>
                      </>
                    ) : (
                      // Show due date and time remaining when unpaid
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-medium">
                            {formatDate(memo.fullDetails?.payment_info?.due_date?.$date || memo.fullDetails?.payment_info?.due_date)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Time Remaining:</span>
                          <span className={`font-semibold ${
                            getDaysRemaining(memo.fullDetails?.payment_info?.due_date?.$date || memo.fullDetails?.payment_info?.due_date).includes('Overdue') 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            {getDaysRemaining(memo.fullDetails?.payment_info?.due_date?.$date || memo.fullDetails?.payment_info?.due_date)}
                          </span>
                        </div>
                        {memo.fullDetails?.payment_info?.late_fee > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Late Fee:</span>
                            <span className="font-medium text-red-600">₹{memo.fullDetails.payment_info.late_fee}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Fine Breakdown */}
                <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                  <label className="block text-sm font-medium text-yellow-700 mb-4">Fine Breakdown</label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Base Amount:</span>
                      <span className="font-medium">₹{memo.fullDetails?.fine_amounts?.base_amount || memo.fine_Amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Discount Applied:</span>
                      <span className="font-medium text-green-600">-₹{memo.fullDetails?.fine_amounts?.discount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t border-yellow-300 pt-2 mt-2">
                      <span className="text-gray-800">Total Amount:</span>
                      <span className="text-red-600">₹{memo.fullDetails?.fine_amounts?.final_amount || memo.fine_Amount}</span>
                    </div>
                  </div>
                </div>

                {/* Violation Types */}
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <label className="block text-sm font-medium text-blue-700 mb-4">Detected Violations</label>
                  <div className="space-y-2">
                    {memo.fullDetails?.violation_types?.map((type, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-800 capitalize">
                            {type.replace(/-/g, ' ')}
                          </span>
                          {memo.fullDetails.confidence_scores?.[index] && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {(memo.fullDetails.confidence_scores[index] * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Complaint Information (if any) */}
                {memo.complaint && (
                  <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                    <label className="block text-sm font-medium text-red-700 mb-4">Complaint Filed</label>
                    <div className="space-y-3">
                      <p className="text-gray-700 text-sm leading-relaxed">{memo.remark}</p>
                      {memo.comp_date && (
                        <p className="text-gray-500 text-xs">
                          Filed on: {new Date(memo.comp_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;