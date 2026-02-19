import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/common/ThemeToggle"; // ✅ ADDITION

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
<<<<<<< HEAD
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
=======
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
>>>>>>> upstream/main

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
<<<<<<< HEAD
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
=======
>>>>>>> upstream/main
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

<<<<<<< HEAD
  // Handle search functionality (mock implementation)
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // Mock course data for demonstration
      const mockCourses = [
        {
          id: 1,
          title: "React Fundamentals",
          category: "Web Development",
          price: "$49.99",
          image: "https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=React"
        },
        {
          id: 2,
          title: "Python for Beginners",
          category: "Programming",
          price: "$39.99",
          image: "https://via.placeholder.com/100x100/10B981/FFFFFF?text=Python"
        },
        {
          id: 3,
          title: "JavaScript Advanced",
          category: "Web Development",
          price: "$59.99",
          image: "https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=JS"
        },
        {
          id: 4,
          title: "Node.js Backend",
          category: "Backend Development",
          price: "$69.99",
          image: "https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=Node"
        },
        {
          id: 5,
          title: "CSS & Tailwind",
          category: "Web Development",
          price: "$29.99",
          image: "https://via.placeholder.com/100x100/EC4899/FFFFFF?text=CSS"
        }
      ];

      // Filter courses based on search query
      const filteredCourses = mockCourses.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.category.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredCourses);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching courses:", error);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/learning/${courseId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

const displayName = user?.name || user?.email?.split('@')[0] || "User";

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-50" style={{ height: '89px' }}>
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden p-2 rounded-lg bg-white border border-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <div className="flex items-center" style={{ position: 'fixed', left: '15px', top: '15px', width: '222px', height: '47px' }}>
            <img
              src="/upto.png"
              alt="UPTO SKILLS"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="relative" style={{ width: '440px', height: '42px', marginLeft: '250px' }} ref={searchRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Try search programming courses ....."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.trim() !== "" && setShowSearchResults(true)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              style={{ height: '42px' }}
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-10 h-10 rounded-lg mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{course.title}</h4>
                      <p className="text-xs text-gray-600">{course.category}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{course.price}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* No Results Message */}
            {showSearchResults && searchResults.length === 0 && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                <p className="text-sm text-gray-600">No courses found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6" style={{ marginRight: '20px' }}>
=======
const displayName = user?.name || user?.email?.split('@')[0] || "User";

  return (
    <header className="bg-card border-b border-border px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden p-2 rounded-lg bg-card border border-border"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-muted" />
            ) : (
              <Menu className="w-5 h-5 text-muted" />
            )}
          </button>

          <img
            src="/upto.png"
            alt="UptoSkills Logo"
            className="h-10 w-auto"
          />
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Try search programming courses ....."
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-full text-sm text-main focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
>>>>>>> upstream/main
          {/* 🔥 UNIVERSAL THEME TOGGLE (ADDED) */}
          <ThemeToggle />

          <div className="relative">
<<<<<<< HEAD
            <Bell className="w-5 h-5 text-gray-600" />
=======
            <Bell className="w-5 h-5 text-muted" />
>>>>>>> upstream/main
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </div>

          <div
            className="flex items-center space-x-3 relative"
            ref={dropdownRef}
          >
            <img
              src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
                displayName
              )}`}
              alt="User Avatar"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />

            <span
<<<<<<< HEAD
              className="text-gray-900 font-medium hidden sm:block cursor-pointer select-none"
=======
              className="text-main font-medium hidden sm:block cursor-pointer select-none"
>>>>>>> upstream/main
              onClick={toggleDropdown}
            >
              {displayName}
            </span>

            {dropdownOpen && (
<<<<<<< HEAD
              <div className="absolute right-0 mt-10 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
=======
              <div className="absolute right-0 mt-10 w-32 bg-card border border-border rounded-md shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-main hover:bg-canvas-alt"
>>>>>>> upstream/main
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
