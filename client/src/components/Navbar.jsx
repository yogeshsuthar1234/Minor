import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Profile from "./profile";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setDropdownOpen(false);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a
              href="/dashboard"
              className={`flex items-center space-x-3 transform hover:scale-105 transition-transform ![text-decoration:none] duration-300 ${
                scrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                scrolled 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                  : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <svg 
                  className={`w-6 h-6 ${scrolled ? 'text-white' : 'text-white'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                  />
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight !no-underline">
                  Urban<span className="text-yellow-300">Eye</span>
                </span>
                <p className={`text-xs ${scrolled ? 'text-gray-600' : 'text-white/80'} font-medium !no-underline`}>
                  Traffic Management
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {/* Navigation Links for Logged-in Users */}
                <div className="flex items-center space-x-6">
                  <a
                    href="/dashboard"
                    className={`font-medium transition-all duration-300 hover:scale-105 ![text-decoration:none] ${
                      scrolled 
                        ? 'text-gray-700 hover:text-indigo-600' 
                        : 'text-white hover:text-yellow-200'
                    }`}
                  >
                    Dashboard
                  </a>
                  <a
                    href="/profile"
                    className={`font-medium transition-all duration-300 hover:scale-105 ![text-decoration:none] ${
                      scrolled 
                        ? 'text-gray-700 hover:text-indigo-600' 
                        : 'text-white hover:text-yellow-200'
                    }`}
                  >
                    Profile
                  </a>
                  
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center space-x-3 p-2 rounded-2xl transition-all duration-300 ${
                      scrolled 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                        : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      scrolled 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                        : 'bg-white text-indigo-600'
                    }`}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-medium max-w-32 truncate">
                      {user.name || 'User'}
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-300 ${
                        dropdownOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={closeDropdown}
                      ></div>
                      
                      {/* Dropdown Content */}
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 animate-fadeIn">
                        {/* User Info */}
                        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {user.name || 'User'}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {user.vehicle_ID || 'No Vehicle ID'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown Items */}
                        <div className="p-2">
                          <a
                            href="/profile"
                            className="flex items-center space-x-3 px-3 py-3 text-sm text-gray-700 hover:bg-indigo-50 rounded-xl transition-all duration-200 group"
                            onClick={closeDropdown}
                          >
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profile</span>
                          </a>


                          <div className="border-t border-gray-200/50 my-2"></div>

                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Login/Signup Buttons for Guests */
              <div className="flex items-center space-x-4">
                <a
                  href="/login"
                  className={`px-6 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                    scrolled
                      ? 'text-indigo-600 hover:text-indigo-700 bg-white border border-indigo-200 hover:border-indigo-300 shadow-sm hover:shadow-md'
                      : 'text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 hover:border-white/50 shadow-sm hover:shadow-md'
                  }`}
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  className={`px-6 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${
                    scrolled
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                      : 'bg-white text-indigo-600 hover:bg-gray-100'
                  }`}
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-2xl transition-all duration-300 ${
                scrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-slideDown">
            <div className={`px-2 pt-2 pb-4 space-y-2 rounded-2xl mt-2 ${
              scrolled ? 'bg-white shadow-lg' : 'bg-white/10 backdrop-blur-lg'
            }`}>
              {user ? (
                <>
                  {/* Mobile User Info */}
                  <div className={`p-4 rounded-2xl mb-2 ${
                    scrolled ? 'bg-gray-50' : 'bg-white/20'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        scrolled 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                          : 'bg-white text-indigo-600'
                      }`}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className={`font-semibold ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                          {user.name || 'User'}
                        </p>
                        <p className={`text-sm ${scrolled ? 'text-gray-600' : 'text-white/80'}`}>
                          {user.vehicle_ID}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <a
                    href="/dashboard"
                    className={`block px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      scrolled 
                        ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' 
                        : 'text-white hover:bg-white/20'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                  <a
                    href="/profile"
                    className={`block px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      scrolled 
                        ? 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' 
                        : 'text-white hover:bg-white/20'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </a>
                  

                  {/* Mobile Logout */}
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      scrolled 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-white hover:bg-red-500/20'
                    }`}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className={`block px-4 py-3 rounded-2xl font-medium text-center transition-all duration-300 ${
                      scrolled 
                        ? 'text-indigo-600 hover:bg-indigo-50 border border-indigo-200' 
                        : 'text-white hover:bg-white/20 border border-white/30'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </a>
                  <a
                    href="/signup"
                    className={`block px-4 py-3 rounded-2xl font-medium text-center transition-all duration-300 ${
                      scrolled 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600' 
                        : 'bg-white text-indigo-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}