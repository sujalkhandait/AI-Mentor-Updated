import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";

const settingsNavItems = [
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Password & Security" },
  { icon: Palette, label: "Appearance" },
  { icon: Globe, label: "Language" },
];

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSetting, setActiveSetting] = useState("Profile");
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });
  const [settingsData, setSettingsData] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      courseUpdates: true,
      discussionReplies: true,
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
    },
    appearance: {
      theme: "light",
      language: "en",
    },
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/users/profile",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          bio: formData.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateUser(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio:
          user.bio ||
          "Passionate about AI and machine learning. Currently pursuing advanced courses in data science.",
      });
    }
  }, [user]);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
=======
    <div className="min-h-screen bg-canvas-alt flex flex-col">
>>>>>>> upstream/main
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activePage="settings"
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 mt-3 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-80"
        }`}
      >
        <div className="flex flex-1 mt-15">
          {/* Settings Sidebar */}
<<<<<<< HEAD
          <aside className="w-[280px] bg-white rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] m-6 mr-0">
=======
          <aside className="w-[280px] bg-card rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] m-6 mr-0">
>>>>>>> upstream/main
            <nav className="p-6">
              <div className="space-y-2">
                {settingsNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      onClick={() => setActiveSetting(item.label)}
                      key={item.label}
                      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-colors ${
                        activeSetting === item.label
<<<<<<< HEAD
                          ? "bg-[#E8F9F7] text-[#374151]"
                          : "text-[#374151] hover:bg-gray-50"
=======
                          ? "bg-teal-50 dark:bg-teal-900/20 text-main"
                          : "text-muted hover:bg-canvas-alt"
>>>>>>> upstream/main
                      }`}
                    >
                      <IconComponent
                        className={`w-4 h-4 ${
                          activeSetting === item.label
                            ? "text-[#00BEA5]"
                            : "text-[#00BEA5]"
                        }`}
                      />
                      <span className="font-medium text-[16px] font-[Inter]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 mt-5">
            {activeSetting === "Profile" && (
              <div className="max-w-[896px]">
                {/* Header */}
                <div className="mb-8">
<<<<<<< HEAD
                  <h1 className="text-[30px] font-bold text-[#1F2937] font-[Inter] mb-2">
                    Profile Settings
                  </h1>
                  <p className="text-[16px] text-[#4B5563] font-[Inter]">
=======
                  <h1 className="text-[30px] font-bold text-main font-[Inter] mb-2">
                    Profile Settings
                  </h1>
                  <p className="text-[16px] text-muted font-[Inter]">
>>>>>>> upstream/main
                    Manage your account information and preferences
                  </p>
                </div>

                {/* Settings Card */}
<<<<<<< HEAD
                <div className="bg-white rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
=======
                <div className="bg-card rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
>>>>>>> upstream/main
                  <div className="flex gap-8 mb-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <img
                          src={`https://api.dicebear.com/8.x/initials/svg?seed=${formData.firstName}%20${formData.lastName}`}
                          alt="Profile"
                          className="w-32 h-32 rounded-full border-4 border-[rgba(255,135,89,0.65)] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)]"
                        />
                        <button className="absolute bottom-2 right-2 w-10 h-10 bg-[#475569] rounded-full flex items-center justify-center shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)]">
                          <Camera className="w-[14px] h-[14px] text-white" />
                        </button>
                      </div>
<<<<<<< HEAD
                      <h2 className="text-[20px] font-semibold text-[#1F2937] font-[Inter] mb-1">
                        {formData.firstName} {formData.lastName}
                      </h2>
                      <p className="text-[16px] text-[#6B7280] font-[Inter]">
=======
                      <h2 className="text-[20px] font-semibold text-main font-[Inter] mb-1">
                        {formData.firstName} {formData.lastName}
                      </h2>
                      <p className="text-[16px] text-muted font-[Inter]">
>>>>>>> upstream/main
                        Premium Member
                      </p>
                    </div>

                    {/* Form Section */}
                    <div className="flex-1 space-y-6">
                      {/* First and Last Name */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
<<<<<<< HEAD
                          <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
=======
                          <label className="absolute -top-2 left-4 bg-card px-2 text-[14px] text-muted font-medium font-[Inter]">
>>>>>>> upstream/main
                            First Name
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
<<<<<<< HEAD
                            className="w-full h-[50px] px-4 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
                          />
                        </div>
                        <div className="relative">
                          <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
=======
                            className="w-full h-[50px] px-4 rounded-xl border border-border text-[16px] font-[Inter] focus:ring-2 focus:ring-primary focus:border-primary bg-input text-main"
                          />
                        </div>
                        <div className="relative">
                          <label className="absolute -top-2 left-4 bg-card px-2 text-[14px] text-muted font-medium font-[Inter]">
>>>>>>> upstream/main
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
<<<<<<< HEAD
                            className="w-full h-[50px] px-4 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
=======
                            className="w-full h-[50px] px-4 rounded-xl border border-border text-[16px] font-[Inter] focus:ring-2 focus:ring-primary focus:border-primary bg-input text-main"
>>>>>>> upstream/main
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="relative">
<<<<<<< HEAD
                        <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
=======
                        <label className="absolute -top-2 left-4 bg-card px-2 text-[14px] text-muted font-medium font-[Inter]">
>>>>>>> upstream/main
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
<<<<<<< HEAD
                          className="w-full h-[50px] px-4 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
=======
                          className="w-full h-[50px] px-4 rounded-xl border border-border text-[16px] font-[Inter] focus:ring-2 focus:ring-primary focus:border-primary bg-input text-main"
>>>>>>> upstream/main
                        />
                      </div>

                      {/* Bio */}
                      <div className="relative">
<<<<<<< HEAD
                        <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
=======
                        <label className="absolute -top-2 left-4 bg-card px-2 text-[14px] text-muted font-medium font-[Inter]">
>>>>>>> upstream/main
                          Bio
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) =>
                            handleInputChange("bio", e.target.value)
                          }
<<<<<<< HEAD
                          className="w-full min-h-[122px] px-4 py-3 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] resize-none focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white text-[#ADAEBC]"
=======
                          className="w-full min-h-[122px] px-4 py-3 rounded-xl border border-border text-[16px] font-[Inter] resize-none focus:ring-2 focus:ring-primary focus:border-primary bg-input text-main"
>>>>>>> upstream/main
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
<<<<<<< HEAD
                  <div className="flex justify-end gap-4 pt-6 border-t border-[#E5E7EB]">
                    <button
                      type="button"
                      className="h-[50px] px-6 rounded-xl border border-[#D1D5DB] bg-white text-[#374151] text-[16px] font-medium font-[Inter] hover:bg-gray-50"
=======
                  <div className="flex justify-end gap-4 pt-6 border-t border-border">
                    <button
                      type="button"
                      className="h-[50px] px-6 rounded-xl border border-border bg-card text-main text-[16px] font-medium font-[Inter] hover:bg-canvas-alt"
>>>>>>> upstream/main
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={loading}
<<<<<<< HEAD
                      className="h-[50px] px-6 rounded-xl bg-gradient-to-r from-[#00BEA5] to-[#00BEA5] text-white text-[16px] font-medium font-[Inter] hover:opacity-90 disabled:opacity-50"
=======
                      className="h-[50px] px-6 rounded-xl bg-gradient-to-r from-primary to-primary text-white text-[16px] font-medium font-[Inter] hover:opacity-90 disabled:opacity-50"
>>>>>>> upstream/main
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSetting === "Notifications" && (
              <div className="max-w-[896px]">
                <div className="mb-8">
<<<<<<< HEAD
                  <h1 className="text-[30px] font-bold text-[#1F2937] font-[Inter] mb-2">
                    Notification Settings
                  </h1>
                  <p className="text-[16px] text-[#4B5563] font-[Inter]">
                    Choose how you want to be notified about updates
                  </p>
                </div>
                <div className="bg-white rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[16px] font-semibold text-[#1F2937] font-[Inter]">
                          Email Notifications
                        </h3>
                        <p className="text-[14px] text-[#6B7280] font-[Inter]">
=======
                  <h1 className="text-[30px] font-bold text-main font-[Inter] mb-2">
                    Notification Settings
                  </h1>
                  <p className="text-[16px] text-muted font-[Inter]">
                    Choose how you want to be notified about updates
                  </p>
                </div>
                <div className="bg-card rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[16px] font-semibold text-main font-[Inter]">
                          Email Notifications
                        </h3>
                        <p className="text-[14px] text-muted font-[Inter]">
>>>>>>> upstream/main
                          Receive notifications via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            settingsData.notifications.emailNotifications
                          }
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                emailNotifications: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
<<<<<<< HEAD
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BEA5]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BEA5]"></div>
=======
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
>>>>>>> upstream/main
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
<<<<<<< HEAD
                        <h3 className="text-[16px] font-semibold text-[#1F2937] font-[Inter]">
                          Push Notifications
                        </h3>
                        <p className="text-[14px] text-[#6B7280] font-[Inter]">
=======
                        <h3 className="text-[16px] font-semibold text-main font-[Inter]">
                          Push Notifications
                        </h3>
                        <p className="text-[14px] text-muted font-[Inter]">
>>>>>>> upstream/main
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsData.notifications.pushNotifications}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                pushNotifications: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
<<<<<<< HEAD
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BEA5]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BEA5]"></div>
=======
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
>>>>>>> upstream/main
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
<<<<<<< HEAD
                        <h3 className="text-[16px] font-semibold text-[#1F2937] font-[Inter]">
                          Course Updates
                        </h3>
                        <p className="text-[14px] text-[#6B7280] font-[Inter]">
=======
                        <h3 className="text-[16px] font-semibold text-main font-[Inter]">
                          Course Updates
                        </h3>
                        <p className="text-[14px] text-muted font-[Inter]">
>>>>>>> upstream/main
                          Get notified about new lessons and course updates
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsData.notifications.courseUpdates}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                courseUpdates: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
<<<<<<< HEAD
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BEA5]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BEA5]"></div>
=======
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
>>>>>>> upstream/main
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
<<<<<<< HEAD
                        <h3 className="text-[16px] font-semibold text-[#1F2937] font-[Inter]">
                          Discussion Replies
                        </h3>
                        <p className="text-[14px] text-[#6B7280] font-[Inter]">
=======
                        <h3 className="text-[16px] font-semibold text-main font-[Inter]">
                          Discussion Replies
                        </h3>
                        <p className="text-[14px] text-muted font-[Inter]">
>>>>>>> upstream/main
                          Get notified when someone replies to your discussions
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsData.notifications.discussionReplies}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                discussionReplies: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
<<<<<<< HEAD
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BEA5]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BEA5]"></div>
=======
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
>>>>>>> upstream/main
                      </label>
                    </div>
                  </div>

<<<<<<< HEAD
                  <div className="flex justify-end gap-4 pt-6 border-t border-[#E5E7EB] mt-6">
                    <button
                      type="button"
                      className="h-[50px] px-6 rounded-xl border border-[#D1D5DB] bg-white text-[#374151] text-[16px] font-medium font-[Inter] hover:bg-gray-50"
=======
                  <div className="flex justify-end gap-4 pt-6 border-t border-border mt-6">
                    <button
                      type="button"
                      className="h-[50px] px-6 rounded-xl border border-border bg-card text-main text-[16px] font-medium font-[Inter] hover:bg-canvas-alt"
>>>>>>> upstream/main
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const token = localStorage.getItem("token");
                          await axios.put(
                            "/api/users/settings",
                            { notifications: settingsData.notifications },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          alert("Notification settings updated successfully!");
                        } catch (error) {
                          console.error("Error updating settings:", error);
                          alert("Failed to update settings. Please try again.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
<<<<<<< HEAD
                      className="h-[50px] px-6 rounded-xl bg-gradient-to-r from-[#00BEA5] to-[#00BEA5] text-white text-[16px] font-medium font-[Inter] hover:opacity-90 disabled:opacity-50"
=======
                      className="h-[50px] px-6 rounded-xl bg-gradient-to-r from-primary to-primary text-white text-[16px] font-medium font-[Inter] hover:opacity-90 disabled:opacity-50"
>>>>>>> upstream/main
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSetting === "Password & Security" && (
              <div className="max-w-[896px]">
                <div className="mb-8">
<<<<<<< HEAD
                  <h1 className="text-[30px] font-bold text-[#1F2937] font-[Inter] mb-2">
                    Password & Security
                  </h1>
                  <p className="text-[16px] text-[#4B5563] font-[Inter]">
                    Manage your password and security preferences
                  </p>
                </div>
                <div className="bg-white rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[16px] font-semibold text-[#1F2937] font-[Inter]">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-[14px] text-[#6B7280] font-[Inter]">
=======
                  <h1 className="text-[30px] font-bold text-main font-[Inter] mb-2">
                    Password & Security
                  </h1>
                  <p className="text-[16px] text-muted font-[Inter]">
                    Manage your password and security preferences
                  </p>
                </div>
                <div className="bg-card rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[16px] font-semibold text-main font-[Inter]">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-[14px] text-muted font-[Inter]">
>>>>>>> upstream/main
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsData.security.twoFactorAuth}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              security: {
                                ...prev.security,
                                twoFactorAuth: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
<<<<<<< HEAD
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BEA5]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BEA5]"></div>
=======
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
>>>>>>> upstream/main
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
<<<<<<< HEAD
                        <h3 className="text-[16px] font-semibold text-[#1F2937] font-[Inter]">
                          Login Alerts
                        </h3>
                        <p className="text-[14px] text-[#6B7280] font-[Inter]">
=======
                        <h3 className="text-[16px] font-semibold text-main font-[Inter]">
                          Login Alerts
                        </h3>
                        <p className="text-[14px] text-muted font-[Inter]">
>>>>>>> upstream/main
                          Get notified when your account is accessed from a new
                          device
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsData.security.loginAlerts}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              security: {
                                ...prev.security,
                                loginAlerts: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
<<<<<<< HEAD
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BEA5]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BEA5]"></div>
                      </label>
                    </div>

                    <div className="border-t border-[#E5E7EB] pt-6">
                      <h3 className="text-[18px] font-semibold text-[#1F2937] font-[Inter]  mb-4">
=======
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="text-[18px] font-semibold text-main font-[Inter]  mb-4">
>>>>>>> upstream/main
                        Change Password
                      </h3>
                      <div className="space-y-5">
                        <div className="relative">
<<<<<<< HEAD
                          <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
                            Current Password
                          </label>
                          <div className="relative">
=======
                          <label className="absolute -top-2 left-4 bg-card px-2 text-[14px] text-muted font-medium font-[Inter]">
                            Current Password
                          </label>
>>>>>>> upstream/main
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  currentPassword: e.target.value,
                                }))
                              }
<<<<<<< HEAD
                              className="w-full h-[50px] px-4 pr-12 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
=======
                              className="w-full h-[50px] px-4 pr-12 rounded-xl border border-border text-[16px] font-[Inter] focus:ring-2 focus:ring-primary focus:border-primary bg-input text-main"
>>>>>>> upstream/main
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
<<<<<<< HEAD
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#374151]"
=======
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-main"
>>>>>>> upstream/main
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
<<<<<<< HEAD
                          </div>
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
                            New Password
                          </label>
                          <div className="relative">
=======
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-4 bg-card px-2 text-[14px] text-muted font-medium font-[Inter]">
                            New Password
                          </label>
>>>>>>> upstream/main
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
<<<<<<< HEAD
                              className="w-full h-[50px] px-4 pr-12 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
=======
                              className="w-full h-[50px] px-4 pr-12 rounded-xl border border-border text-[16px] font-[Inter] focus:ring-2 focus:ring-primary focus:border-primary bg-input text-main"
>>>>>>> upstream/main
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
<<<<<<< HEAD
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#374151]"
=======
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-main"
>>>>>>> upstream/main
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
<<<<<<< HEAD
                          </div>
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
=======
                          
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-4 bg-card px-2 text-[14px] text-muted font-medium font-[Inter]">
>>>>>>> upstream/main
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
<<<<<<< HEAD
                            className="w-full h-[50px] px-4 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
=======
                            className="w-full h-[50px] px-4 rounded-xl border border-border text-[16px] font-[Inter] focus:ring-2 focus:ring-primary focus:border-primary bg-input text-main"
>>>>>>> upstream/main
                          />
                        </div>
                      </div>
                    </div>
                  </div>

<<<<<<< HEAD
                  <div className="flex justify-end gap-4 pt-6 border-t border-[#E5E7EB] mt-6">
                    <button
                      type="button"
                      className="h-[50px] px-6 rounded-xl border border-[#D1D5DB] bg-white text-[#374151] text-[16px] font-medium font-[Inter] hover:bg-gray-50"
=======
                  <div className="flex justify-end gap-4 pt-6 border-t border-border mt-6">
                    <button
                      type="button"
                      className="h-[50px] px-6 rounded-xl border border-border bg-card text-main text-[16px] font-medium font-[Inter] hover:bg-canvas-alt"
>>>>>>> upstream/main
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          passwordData.newPassword !==
                          passwordData.confirmPassword
                        ) {
                          alert("New passwords do not match!");
                          return;
                        }
                        setLoading(true);
                        try {
                          const token = localStorage.getItem("token");
                          await axios.put(
                            "/api/users/settings",
                            { security: settingsData.security },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          alert("Security settings updated successfully!");
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        } catch (error) {
                          console.error("Error updating settings:", error);
                          alert("Failed to update settings. Please try again.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
<<<<<<< HEAD
                      className="h-[50px] px-6 rounded-xl bg-gradient-to-r from-[#00BEA5] to-[#00BEA5] text-white text-[16px] font-medium font-[Inter] hover:opacity-90 disabled:opacity-50"
=======
                      className="h-[50px] px-6 rounded-xl bg-gradient-to-r from-primary to-primary text-white text-[16px] font-medium font-[Inter] hover:opacity-90 disabled:opacity-50"
>>>>>>> upstream/main
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSetting === "Appearance" && (
              <div className="max-w-[896px]">
                <div className="mb-8">
<<<<<<< HEAD
                  <h1 className="text-[30px] font-bold text-[#1F2937] font-[Inter] mb-2">
                    Appearance Settings
                  </h1>
                  <p className="text-[16px] text-[#4B5563] font-[Inter]">
                    Customize the look and feel of your interface
                  </p>
                </div>
                <div className="bg-white rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#1F2937] font-[Inter] mb-3">
=======
                  <h1 className="text-[30px] font-bold text-main font-[Inter] mb-2">
                    Appearance Settings
                  </h1>
                  <p className="text-[16px] text-muted font-[Inter]">
                    Customize the look and feel of your interface
                  </p>
                </div>
                <div className="bg-card rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[16px] font-semibold text-main font-[Inter] mb-3">
>>>>>>> upstream/main
                        Theme
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: "light", label: "Light", icon: "☀️" },
                          { value: "dark", label: "Dark", icon: "🌙" },
                          { value: "auto", label: "Auto", icon: "⚙️" },
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() =>
                              setSettingsData((prev) => ({
                                ...prev,
                                appearance: {
                                  ...prev.appearance,
                                  theme: theme.value,
                                },
                              }))
                            }
                            className={`p-4 rounded-xl border-2 transition-colors ${
                              settingsData.appearance.theme === theme.value
<<<<<<< HEAD
                                ? "border-[#00BEA5] bg-[#E8F9F7]"
                                : "border-[#D1D5DB] hover:border-[#00BEA5]"
                            }`}
                          >
                            <div className="text-2xl mb-2">{theme.icon}</div>
                            <div className="text-[14px] font-medium text-[#1F2937] font-[Inter]">
=======
                                ? "border-primary bg-teal-50 dark:bg-teal-900/20 text-main"
                                : "border-border hover:border-primary text-muted hover:text-main"
                            }`}
                          >
                            <div className="text-2xl mb-2">{theme.icon}</div>
                            <div className="text-[14px] font-medium font-[Inter]">
>>>>>>> upstream/main
                              {theme.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
<<<<<<< HEAD
                      <h3 className="text-[16px] font-semibold text-[#1F2937] font-[Inter] mb-3">
=======
                      <h3 className="text-[16px] font-semibold text-main font-[Inter] mb-3">
>>>>>>> upstream/main
                        Language
                      </h3>
                      <select
                        value={settingsData.appearance.language}
                        onChange={(e) =>
                          setSettingsData((prev) => ({
                            ...prev,
                            appearance: {
                              ...prev.appearance,
                              language: e.target.value,
                            },
                          }))
                        }
<<<<<<< HEAD
                        className="w-full h-[50px] px-4 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
=======
                        className="w-full h-[50px] px-4 rounded-xl border border-border text-[16px] font-[Inter] focus:ring-2 focus:ring-primary focus:border-primary bg-input text-main"
>>>>>>> upstream/main
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                        <option value="pt">Português</option>
                        <option value="ru">Русский</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                      </select>
                    </div>
                  </div>

<<<<<<< HEAD
                  <div className="flex justify-end gap-4 pt-6 border-t border-[#E5E7EB] mt-6">
                    <button
                      type="button"
                      className="h-[50px] px-6 rounded-xl border border-[#D1D5DB] bg-white text-[#374151] text-[16px] font-medium font-[Inter] hover:bg-gray-50"
=======
                  <div className="flex justify-end gap-4 pt-6 border-t border-border mt-6">
                    <button
                      type="button"
                      className="h-[50px] px-6 rounded-xl border border-border bg-card text-main text-[16px] font-medium font-[Inter] hover:bg-canvas-alt"
>>>>>>> upstream/main
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const token = localStorage.getItem("token");
                          await axios.put(
                            "/api/users/settings",
                            { appearance: settingsData.appearance },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          alert("Appearance settings updated successfully!");
                        } catch (error) {
                          console.error("Error updating settings:", error);
                          alert("Failed to update settings. Please try again.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
<<<<<<< HEAD
                      className="h-[50px] px-6 rounded-xl bg-gradient-to-r from-[#00BEA5] to-[#00BEA5] text-white text-[16px] font-medium font-[Inter] hover:opacity-90 disabled:opacity-50"
=======
                      className="h-[50px] px-6 rounded-xl bg-gradient-to-r from-primary to-primary text-white text-[16px] font-medium font-[Inter] hover:opacity-90 disabled:opacity-50"
>>>>>>> upstream/main
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSetting === "Language" && (
              <div className="max-w-[896px]">
                <div className="mb-8">
<<<<<<< HEAD
                  <h1 className="text-[30px] font-bold text-[#1F2937] font-[Inter] mb-2">
                    Language Settings
                  </h1>
                  <p className="text-[16px] text-[#4B5563] font-[Inter]">
                    Choose your preferred language for the interface
                  </p>
                </div>
                <div className="bg-white rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#1F2937] font-[Inter] mb-3">
=======
                  <h1 className="text-[30px] font-bold text-main font-[Inter] mb-2">
                    Language Settings
                  </h1>
                  <p className="text-[16px] text-muted font-[Inter]">
                    Choose your preferred language for the interface
                  </p>
                </div>
                <div className="bg-card rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[16px] font-semibold text-main font-[Inter] mb-3">
>>>>>>> upstream/main
                        Interface Language
                      </h3>
                      <select
                        value={settingsData.appearance.language}
                        onChange={(e) =>
                          setSettingsData((prev) => ({
                            ...prev,
                            appearance: {
                              ...prev.appearance,
                              language: e.target.value,
                            },
                          }))
                        }
<<<<<<< HEAD
                        className="w-full h-[50px] px-4 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
=======
                        className="w-full h-[50px] px-4 rounded-xl border border-border text-[16px] font-[Inter] focus:ring-2 focus:ring-primary focus:border-primary bg-input text-main"
>>>>>>> upstream/main
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                        <option value="pt">Português</option>
                        <option value="ru">Русский</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                      </select>
                    </div>
                  </div>

<<<<<<< HEAD
                  <div className="flex justify-end gap-4 pt-6 border-t border-[#E5E7EB] mt-6">
                    <button
                      type="button"
                      className="h-[50px] px-6 rounded-xl border border-[#D1D5DB] bg-white text-[#374151] text-[16px] font-medium font-[Inter] hover:bg-gray-50"
=======
                  <div className="flex justify-end gap-4 pt-6 border-t border-border mt-6">
                    <button
                      type="button"
                      className="h-[50px] px-6 rounded-xl border border-border bg-card text-main text-[16px] font-medium font-[Inter] hover:bg-canvas-alt"
>>>>>>> upstream/main
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const token = localStorage.getItem("token");
                          await axios.put(
                            "/api/users/settings",
                            {
                              appearance: {
                                language: settingsData.appearance.language,
                              },
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          alert("Language settings updated successfully!");
                        } catch (error) {
                          console.error("Error updating settings:", error);
                          alert("Failed to update settings. Please try again.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="h-[50px] px-6 rounded-xl bg-gradient-to-r from-[#00BEA5] to-[#00BEA5] text-white text-[16px] font-medium font-[Inter] hover:opacity-90 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
