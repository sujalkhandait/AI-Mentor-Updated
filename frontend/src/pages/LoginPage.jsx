import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import SocialLogin from "../components/auth/SocialLogin";

/* FormInput stays exactly as your designed UI */
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
      />
    </div>
  );
};

const Login = () => {
  /* 🔹 LOGIC FROM WORKING LOGIN PAGE (UNCHANGED) */
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      login(data, keepLoggedIn);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  /* 🔹 UI */
  return (
    <AuthLayout
      title="Join Us Today!"
      subtitle="Create your account for an enhanced experience at your fingertips."
    >
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email Address"
          type="email"
          placeholder="Enter your email here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ Direct Password Input */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Keep Logged In */}

        <div className="d-flex">
          <div className="form-check mb-1">
            <input
              type="checkbox"
              className="form-check-input"
              id="keepLoggedIn"
              checked={keepLoggedIn}
              onChange={() => setKeepLoggedIn(!keepLoggedIn)}
            />
            <label className="form-check-label" htmlFor="keepLoggedIn">
              Keep me logged in
            </label>
          </div>

          <div className="d-flex justify-content-end w-52 mb-3">
            <a
              href="/forgot-password"
              className="text-primary text-decoration-none fw-semibold"
              style={{ fontSize: "0.9rem" }}
            >
              Forgot password?
            </a>
          </div>
        </div>

        <button type="submit" className="btn btn-gradient w-100 py-2">
          Login
        </button>
      </form>

      <SocialLogin />

      <p className="text-center mt-3">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-decoration-none text-primary">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
