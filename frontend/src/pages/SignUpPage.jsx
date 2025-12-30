import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import PasswordInput from "../components/auth/PasswordInput";
import SocialLogin from "../components/auth/SocialLogin";

/* FormInput stays UI-only */
const FormInput = ({ label, type, placeholder, value, onChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

const Signup = () => {
  /* 🔹 LOGIC FROM WORKING SIGNUP PAGE (UNCHANGED) */
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      login(data, false);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 UI FROM AUTHLAYOUT SIGNUP */
  return (
    <AuthLayout
      title="Join Us Today!"
      subtitle="Access your AI Learning Journey."
      rightHeader={
        <div className="d-flex align-items-center gap-2">
          <Sun size={16} />
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <Moon size={16} />
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email Address"
          type="email"
          placeholder="Enter your email here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormInput
          label="Choose a Username"
          type="text"
          placeholder="Enter your username here"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}
        <div className="mb-3 position-relative">
          <label className="form-label">Create a Password</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="d-flex align-items-center gap-2 mt-1">
            <Lock size={14} />
            <small>Min. 8 chars required</small>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-gradient w-100 py-2"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <SocialLogin />

      <p className="text-center mt-3">
        Already have an account?{" "}
        <Link to="/login" className="text-decoration-none text-danger">
          Log In!
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
