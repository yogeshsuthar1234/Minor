import React, { useState } from 'react';


const ComplaintPage = ({ memo, onCancel, onSubmitComplaint }) => {
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!remark.trim()) {
      alert('Please enter your complaint remarks');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitComplaint(memo._id, remark.trim());
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
window.location.href = '/dashboard';
      setIsSubmitting(false);
    }
  };

  // Format date for display
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

  // Calculate days remaining until due date
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

  // Get the actual memo data - handle both direct and fullDetails structure
  const memoData = memo.fullDetails || memo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">File Complaint</h1>
          <p className="text-gray-600">Review violation details and submit your complaint with remarks</p>
        </div>

        {/* Violation Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Violation Details</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Violation Information */}
              <div className="space-y-6">
                {/* Violation Summary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Violation Summary
                  </label>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-red-800 text-lg">
                        {memo.rule_Broken || 'Traffic Violation'}
                      </span>
                      <span className="text-xl font-bold text-red-600">₹{memo.fine_Amount || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Status: </span>
                      <span className={`font-semibold ${
                        memo.status === 'paid' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {memo.status === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Violation Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Detected Violations
                  </label>
                  <div className="space-y-2">
                    {memoData.violation_types?.map((type, index) => (
                      <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-orange-800 capitalize">
                            {type.replace(/-/g, ' ')}
                          </span>
                          {memoData.confidence_scores?.[index] && (
                            <span className="text-xs bg-white px-2 py-1 rounded border border-orange-300">
                              {(memoData.confidence_scores[index] * 100).toFixed(1)}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location & Timestamp */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location Detected</label>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start">
                        <svg className="w-4 h-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-700">{memoData.location || 'Location not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Detection Date & Time</label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">{formatDate(memoData.timestamp?.$date || memoData.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment & Vehicle Information */}
              <div className="space-y-6">
                {/* Fine Amount Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Fine Breakdown</label>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Base Amount:</span>
                        <span className="font-semibold">₹{memoData.fine_amounts?.base_amount || memo.fine_Amount || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Discount Applied:</span>
                        <span className="font-semibold text-green-600">-₹{memoData.fine_amounts?.discount || 0}</span>
                      </div>
                      {memoData.payment_info?.late_fee > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Late Fees:</span>
                          <span className="font-semibold text-red-600">+₹{memoData.payment_info.late_fee}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-lg font-bold border-t border-yellow-300 pt-3 mt-2">
                        <span className="text-gray-800">Total Amount Due:</span>
                        <span className="text-red-600">₹{memoData.fine_amounts?.final_amount || memo.fine_Amount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Payment Details</label>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`font-semibold ${
                          memoData.payment_info?.is_paid ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {memoData.payment_info?.is_paid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-medium">{formatDate(memoData.payment_info?.due_date?.$date || memoData.payment_info?.due_date)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Time Remaining:</span>
                        <span className={`font-semibold ${
                          getDaysRemaining(memoData.payment_info?.due_date?.$date || memoData.payment_info?.due_date).includes('Overdue') 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {getDaysRemaining(memoData.payment_info?.due_date?.$date || memoData.payment_info?.due_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Information</label>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Vehicle ID:</span>
                        <span className="font-semibold">{memoData.vehicle_id || memo.vehicle_ID || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">License Plate:</span>
                        <span className="font-semibold bg-white px-3 py-1 rounded-lg border border-purple-300 text-purple-700">
                          {memoData.plate_text || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Case Status:</span>
                        <span className={`font-semibold capitalize ${
                          memoData.status === 'issued' || memo.status === 'unpaid' ? 'text-yellow-600' : 
                          memoData.status === 'paid' || memo.status === 'paid' ? 'text-green-600' : 
                          'text-gray-600'
                        }`}>
                          {memoData.status || memo.status || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Evidence</label>
                  {memo.fullDetails.evidence_path ? (
                    <div className="flex flex-col items-center space-y-3">
                      <img 
                        src={memo.fullDetails.evidence_path|| `http://localhost:5000/${memoData.cloudinary_url?.replace(/\\/g, '/')}`} 
                        alt="Violation Evidence" 
                        className="w-full max-w-xs rounded-lg object-cover border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBNODAgODBIMTIwTTgwIDEwMEgxMjBNNjAgNjBWNzBNNjAgODBWMTAwTTYwIDEwMFYxMjBNMTQwIDYwVjcwTTE0MCA4MFYxMDBNMTQwIDEwMFYxMjAiIHN0cm9rZT0iIzlDQThBOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjQwIiByPSIyMCIgZmlsbD0iIzlDQThBOCIvPgo8L3N2Zz4K';
                        }}
                      />
                      <button 
                        onClick={() => window.open(memo.evidenceImage || `http://localhost:5000/${memoData.cloudinary_url?.replace(/\\/g, '/')}`, '_blank')}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v0a2 2 0 012-2h0a2 2 0 012 2v0m0 0v0a2 2 0 002 2v0a2 2 0 00-2-2v0z" />
                        </svg>
                        View Full Evidence
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-500 text-sm">No evidence image available for this violation</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">File Your Complaint</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-3">
                Complaint Details *
              </label>
              <textarea
                id="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Please provide detailed reasons for disputing this violation. Include any evidence or explanations that support your case. For example:
• Incorrect vehicle identification
• Wrong location or timing
• Mitigating circumstances
• Evidence of permission or authorization
• Any other relevant information..."
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none placeholder-gray-400"
              />
              <p className="text-sm text-gray-500 mt-2">
                Your complaint will be reviewed by traffic authorities. Please provide clear and factual information to support your case.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-gray-200">
              <button
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !remark.trim()}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Complaint...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit Complaint
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintPage;