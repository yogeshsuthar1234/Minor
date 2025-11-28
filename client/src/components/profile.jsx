import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import Navbar from "./Navbar";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone_No: user?.phone_No || "",
    mail: user?.mail || "",
    registered_Address: {
      state: user?.registered_Address?.state || "",
      city: user?.registered_Address?.city || "",
      postal_area: user?.registered_Address?.postal_area || ""
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        registered_Address: {
          ...prev.registered_Address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800">Please log in to view your profile</h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Profile Information</h1>
                <p className="text-gray-600 mt-2">Manage your personal and vehicle details</p>
              </div>
                         </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Personal Information */}
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                          <span className="text-gray-800 font-medium">{user.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="mail"
                          value={formData.mail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                          <span className="text-gray-800">{user.mail}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone_No"
                          value={formData.phone_No}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                          <span className="text-gray-800">{user.phone_No}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Vehicle Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle ID</label>
                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-800">{user.vehicle_ID}</span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            Registered
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Address Information */}
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Registered Address
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.state"
                          value={formData.registered_Address.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter your state"
                        />
                      ) : (
                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                          <span className="text-gray-800">{user.registered_Address?.state}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.city"
                          value={formData.registered_Address.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter your city"
                        />
                      ) : (
                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                          <span className="text-gray-800">{user.registered_Address?.city}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Area</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.postal_area"
                          value={formData.registered_Address.postal_area}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter your postal area"
                        />
                      ) : (
                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                          <span className="text-gray-800">{user.registered_Address?.postal_area}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Account Status
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-600">Account Verified</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        Verified
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-600">Member Since</span>
                      <span className="text-gray-800 font-medium">
                        {new Date().toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="text-gray-800 font-medium">
                        {new Date().toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;