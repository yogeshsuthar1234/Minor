import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const vehicleID = location.state?.vehicleID;

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!vehicleID) {
      alert("No vehicle ID found. Please go back and try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle_ID: vehicleID, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("OTP verified successfully!");
        navigate("/setPassword", { state: { vehicleID } });
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (resendCooldown > 0) return;
    
    setResendCooldown(30);
    // Add resend OTP logic here
    alert("OTP resent successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4 ">
      <div className="max-w-md w-full pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
          <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce animation-delay-2000"></div>
        </div>

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h1>
            <p className="text-gray-600">Enter the code sent to your email</p>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            {/* Vehicle Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 mb-6 text-center">
              <p className="text-sm text-purple-700 font-medium">
                Verification code sent for Vehicle ID:{" "}
                <span className="font-bold text-purple-900">{vehicleID}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOTP}>
              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  Enter 6-digit OTP
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    maxLength="6"
                    className="w-full px-4 py-4 text-2xl font-bold text-center tracking-widest bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg mb-4"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Verify OTP
                  </div>
                )}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0}
                  className={`font-semibold transition-colors duration-300 ${
                    resendCooldown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-purple-600 hover:text-purple-700"
                  }`}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;