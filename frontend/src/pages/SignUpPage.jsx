import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import AiPattern from "../assets/gradinet.jpg";
import API_BASE_URL from "../lib/api";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // After successful signup, login the user with the received data
      login(data, false); // Assuming login context function handles the user object and token
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white font-sans overflow-hidden">
      {/* Left Side - Hero Section */}
      <div className="flex-1 flex flex-col  items-center p-6 md:p-1">
        <div className="max-w-[600px] flex flex-col justify-center text-center md:text-left">
          <img
            src="upto.png"
            alt="UptoSkills Logo"
            className="w-[160px] md:w-[200px]  object-contain mb-6 mx-auto md:mx-0"
          />

          <h1
            className="text-[clamp(36px,6vw,80px)] font-extrabold leading-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `url(${AiPattern})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            AI Learning
          </h1>
          <h1 className="text-black font-extrabold tracking-[0.96px] text-[clamp(28px,4vw,64px)] leading-tight">
            Platform
          </h1>

          <p className="text-[#5E5858] font-medium text-[clamp(14px,1vw,20px)] max-w-[500px] mt-3 leading-6 t mx-auto md:mx-0">
            Unlock the future of education with AI-powered courses designed to
            accelerate your learning journey.
          </p>
        </div>

        <div className="w-[100%]  md:w-[60%] mt-8">
          <img
            src="signupimg.png"
            alt="AI Learning Illustration"
            className="w-250 h-110 object-contain"
          />
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full max-w-[600px] h-200 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[500px] p-6 md:p-8 rounded-[20px] border border-[#E8E8E8] bg-white shadow-[4px_4px_38.7px_-4px_rgba(110,110,110,0.30)]">
          {/* Form Header */}
          <div className="mb-6 md:mb-8 flex justify-between items-start">
            <div className="text-center md:text-left flex-1">
              <h2 className="text-[32px] md:text-[40px] font-bold leading-tight text-black mb-2">
                Join Us Today!
              </h2>
              <p className="text-[#5E5858] text-[16px] md:text-[20px] font-medium leading-[26px] md:leading-[28px]">
                Create your account for an enhanced experience at your fingertips.  
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-gray-600" />
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="w-4 h-4"
              />
              <Moon className="w-4 h-4 text-gray-600" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-[#0D0D0D] text-[16px] md:text-[18px] font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email here"
                className="h-[50px] md:h-[50px] px-4 rounded-[12px] border border-[#B3B3B3] bg-white text-[16px] md:text-[18px] font-medium placeholder:text-[#5E5858] focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-[#0D0D0D] text-[16px] md:text-[18px] font-medium">
                Choose a Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username here"
                className="h-[50px] md:h-[48px] px-4 rounded-[12px] border border-[#B3B3B3] bg-white text-[16px] md:text-[18px] font-medium placeholder:text-[#5E5858] focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[#0D0D0D] text-[16px] md:text-[18px] font-medium">
                Create a Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="h-[50px] md:h-[48px] w-full px-4 pr-12 rounded-[12px] border border-[#B3B3B3] bg-white text-[16px] md:text-[18px] font-medium placeholder:text-[#0D0D0D] focus:outline-none focus:border-cyan-400 transition-colors"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-6 h-5 text-[#757575]" />
                  ) : (
                    <Eye className="w-6 h-5 text-[#757575]" />
                  )}
                </button>
              </div>

              {/* Password Requirement */}
              <div className="flex items-center gap-3 pt-2">
                <Lock className="w-6 h-6 text-[#0D0D0D] opacity-40" />
                <span className="text-[#0D0D0D] text-[14px] md:text-[16px] font-medium">
                  Minimum 8 characters required
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className={`h-[44px] rounded-[12px] bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-[16px] md:text-[18px] font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:from-cyan-500 hover:to-blue-700"
                }`}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              <button
                type="button"
                className="h-[44px] rounded-[12px] border border-[#B3B3B3] bg-[#FCFCFC] flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <img
                  src="/AI_Tutor_New_UI/Signup_login_page/google_icon.svg"
                  alt="Sign in with Google"
                  className="w-6 h-6 object-contain"
                />
                <span className="text-black text-[16px] md:text-[18px] font-semibold">
                  Sign in with Google
                </span>
              </button>

              <button
                type="button"
                className="h-[44px] rounded-[12px] border border-[#B3B3B3] bg-[#FCFCFC] flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <img
                  src="/AI_Tutor_New_UI/Signup_login_page/apple_icon.svg"
                  alt="Sign in with Apple"
                  className="w-6 h-6 object-contain"
                />
                <span className="text-black text-[16px] md:text-[18px] font-semibold">
                  Sign in with Apple
                </span>
              </button>

              <p className="text-center text-[16px] md:text-[18px] font-medium mt-2">
                <span className="text-[#1A1A1A] opacity-70">
                  Already have an account?{" "}
                </span>
                <Link to="/login" className="text-[#FF6D34] hover:underline transition-all">
                  Log In!
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
