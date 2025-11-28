import React, { useState } from "react";

const MemoList = ({ memos, onPayClick, onFileComplaint, onViewDetails }) => {
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  
  if (memos.length === 0)
    return (
      <p className="text-green-600 font-semibold text-lg mt-4">
        No memos found 🎉
      </p>
    );
    
  console.log(memos);

  const toggleComplaint = (id) => {
    setExpandedComplaint(expandedComplaint === id ? null : id);
  };

  const handleRuleBrokenClick = (memo, e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onViewDetails) {
      onViewDetails(memo);
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200/50 shadow-lg">
      <table className="w-full border-collapse bg-white">
        <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <tr>
            <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Rule Broken</th>
            <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Location</th>
            <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Fine Amount</th>
            <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Evidence</th>
            <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Complaint</th>
            <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Status</th>
            <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/50">
          {memos.map((memo, index) => (
            <React.Fragment key={memo._id}>
              <tr className={`hover:bg-gray-50/80 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                {/* Rule Broken - Clickable */}
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <button
                      onClick={(e) => handleRuleBrokenClick(memo, e)}
                      className="font-medium text-gray-800 hover:text-blue-600 hover:underline transition-colors duration-200 text-left"
                      title="Click to view all violation details"
                    >
                      {memo.rule_Broken}
                    </button>
                  </div>
                </td>

                {/* Location */}
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-700 truncate max-w-xs" title={memo.fullDetails?.location || 'Location not available'}>
                      {memo.fullDetails?.location || 'N/A'}
                    </span>
                  </div>
                </td>

                {/* Fine Amount */}
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-red-600">₹{memo.fine_Amount}</span>
                  </div>
                </td>

                {/* Evidence Image */}
                <td className="py-4 px-6">
                  {memo.fullDetails?.evidence_path ? (
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => window.open(memo.fullDetails.evidence_path, '_blank')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v0a2 2 0 012-2h0a2 2 0 012 2v0m0 0v0a2 2 0 002 2v0a2 2 0 00-2-2v0z" />
                        </svg>
                        View
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">No image</span>
                  )}
                </td>

                {/* Complaint */}
                <td className="py-4 px-6">
                  {memo.complaint ? (
                    <div className="max-w-xs">
                      <button
                        onClick={() => toggleComplaint(memo._id)}
                        className="text-left text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
                      >
                        <svg 
                          className={`w-4 h-4 mr-2 transition-transform duration-200 ${expandedComplaint === memo._id ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        {expandedComplaint === memo._id ? 'Hide Details' : 'View Complaint'}
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">No complaint</span>
                  )}
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  {memo.status === "unpaid" || memo.status === "pending" ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Unpaid
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Paid
                    </span>
                  )}
                </td>

                {/* Actions - REMOVED the extra Details button */}
                <td className="py-4 px-6">
                  <div className="flex flex-col space-y-2">
                    {(memo.status === "unpaid" || memo.status === "pending") && (
                      <button
                        onClick={() => onPayClick(memo)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6l-2-2m0 0l-2 2m2-2v4m0-4h4m-4 0h-4" />
                        </svg>
                        Pay Now
                      </button>
                    )}
                    
                    {!memo.complaint && (memo.status === "unpaid" || memo.status === "pending") && (
                      <button
                        onClick={() => onFileComplaint(memo)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        File Complaint
                      </button>
                    )}
                    
                    {(memo.status === "paid" || memo.complaint) && (
                      <span className="text-gray-400 text-sm italic text-center">—</span>
                    )}
                  </div>
                </td>
              </tr>

              {/* Expanded Complaint Row */}
              {expandedComplaint === memo._id && memo.complaint && (
                <tr className="bg-blue-50/30">
                  <td colSpan="7" className="py-4 px-6 border-t border-blue-100">
                    <div className="bg-white rounded-xl p-4 shadow-inner border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Officer's Complaint Details
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{memo.remark}</p>
                      {memo.comp_date && (
                        <p className="text-gray-500 text-xs mt-2">
                          Filed on: {new Date(memo.comp_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemoList;