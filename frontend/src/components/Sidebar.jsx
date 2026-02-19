import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD
import { ChevronRight, ChevronLeft } from "lucide-react";
=======
import { ChevronRight } from "lucide-react";
>>>>>>> upstream/main
import API_BASE_URL from "../lib/api";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  activePage = "dashboard",
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navigationItems, setNavigationItems] = useState([]);

<<<<<<< HEAD
  // Generate initials from user name
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    const initials = names.map(n => n[0]).join("");
    return initials.substring(0, 2).toUpperCase();
  };

  // Generate background color based on name
  const getAvatarColor = (name) => {
    if (!name) return "#6B7280";
    const colors = [
      "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6",
      "#EC4899", "#F97316", "#14B8A6", "#6366F1", "#A855F7"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

=======
>>>>>>> upstream/main
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    let isMounted = true;

    const fetchNavigationItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/sidebar/navigation`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch sidebar navigation");
          return;
        }

        const data = await response.json();
        if (isMounted) setNavigationItems(data);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };

    fetchNavigationItems();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {sidebarOpen && (
        <div
<<<<<<< HEAD
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
=======
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
>>>>>>> upstream/main
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
<<<<<<< HEAD
        fixed lg:fixed top-16 left-0 z-50 bg-white border-r border-gray-200
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "translate-x-0"}
        h-[calc(100vh-4rem)]
      `}
        style={{
          width: sidebarOpen ? '248px' : '80px'
        }}
      >
=======
        fixed lg:fixed top-18.5 left-0 z-50 bg-card border-r border-border
        transform transition-all duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${sidebarCollapsed ? "lg:w-20" : "lg:w-80"}
        w-80 h-[calc(100vh-4rem)]
      `}
      >
        <button
          className="hidden lg:block absolute -right-5 -top-5 w-10 h-10 bg-card border border-border rounded-full hover:bg-canvas-alt z-10"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <ChevronRight
            className={`w-5 h-5 text-muted transition-transform duration-300 ${
              sidebarCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

>>>>>>> upstream/main
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = activePage === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(item.path)}
<<<<<<< HEAD
                  className={`cursor-pointer flex items-center px-3 py-2 my-2 rounded-xl group relative
                    ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  style={isActive && sidebarOpen ? {
                    width: '200px',
                    height: '48px'
                  } : {}}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <img
                        src={item.icon}
                        alt={item.label}
                        className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-green-700" : "text-gray-500"}`}
                      />
                      {sidebarOpen && (
                        <span className={`ml-3 ${isActive ? "font-medium text-green-700" : ""}`}>
                          {item.label}
                        </span>
                      )}
                    </div>
                    {isActive && sidebarOpen && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
=======
                  className={`cursor-pointer flex items-center px-3 py-3 rounded-xl group relative
                    ${sidebarCollapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-teal-50 text-teal-600"
                        : "text-muted hover:bg-canvas-alt"
                    }
                  `}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-5 h-5 flex-shrink-0"
                  />
                  {!sidebarCollapsed && (
                    <span className={`ml-3 ${isActive ? "font-medium" : ""}`}>
                      {item.label}
                    </span>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none">
>>>>>>> upstream/main
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

<<<<<<< HEAD
        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: getAvatarColor(user?.name) }}
                >
                  {getInitials(user?.name)}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{user?.email}</div>
=======
        {!sidebarCollapsed ? (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-purple-100 dark:border-slate-700">
              <div className="flex items-center">
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${
                    user?.firstName || "Eliza"
                  }%20${user?.lastName || "Chris"}`}
                  alt={user?.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-main">
                    {user?.name}
                  </div>
                  <div className="text-xs text-muted">{user?.email}</div>
>>>>>>> upstream/main
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
<<<<<<< HEAD
        )}
        {!sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-purple-200"
              style={{ backgroundColor: getAvatarColor(user?.name) }}
            >
              {getInitials(user?.name)}
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button - Positioned at sidebar edge */}
      <button
        className="hidden lg:block absolute w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 z-50"
        style={{
          top: '100px',
          left: sidebarOpen ? '238px' : '66px',
          transition: 'left 0.3s ease-in-out'
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        )}
      </button>

=======
        ) : (
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <img
              src={`https://api.dicebear.com/8.x/initials/svg?seed=${
                user?.firstName || "Eliza"
              }%20${user?.lastName || "Chris"}`}
              alt={user?.name || "User"}
              className="w-10 h-10 rounded-full border-2 border-purple-200"
            />
          </div>
        )}
      </div>
>>>>>>> upstream/main
    </>
  );
};

export default Sidebar;
