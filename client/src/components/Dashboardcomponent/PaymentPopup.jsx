import React, { useState } from "react";

const PaymentPopup = ({ memo, onClose, onSuccess }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    method: "",
    number: "",
  });

  const confirmPayment = async () => {
    if (!paymentDetails.method || !paymentDetails.number) {
      alert("Please fill all payment details");
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/memos/pay/${memo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      alert("Payment successful ✅");
      onSuccess(memo._id); // update parent state
    } catch (error) {
      console.error("Error paying memo:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Pay Memo</h3>
        <p className="mb-4 text-gray-600">
          <span className="font-semibold">Rule:</span> {memo.rule_Broken} <br />
          <span className="font-semibold">Fine:</span> ₹{memo.fine_Amount}
        </p>

        <label className="block text-gray-700 font-medium">Payment Method</label>
        <select
          className="w-full p-2 border rounded-lg mt-1 mb-3 focus:ring-2 focus:ring-blue-500"
          value={paymentDetails.method}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, method: e.target.value })
          }
        >
          <option value="">Select</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>

        {paymentDetails.method && (
          <>
            <label className="block text-gray-700 font-medium">
              Enter {paymentDetails.method} Number
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mt-1 mb-3 focus:ring-2 focus:ring-blue-500"
              value={paymentDetails.number}
              onChange={(e) =>
                setPaymentDetails({
                  ...paymentDetails,
                  number: e.target.value,
                })
              }
            />
          </>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={confirmPayment}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
