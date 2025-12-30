import React from "react";
import logo from "../../assets/images/logo.png";
import hero from "../../assets/images/hero-img.jpg";
import ThemeToggle from "../common/ThemeToggle";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center ps-lg-5">
      <div className="row w-100">
        {/* LEFT SECTION */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center px-5">
          {/* Logo */}
          <img src={logo} alt="UptoSkills" style={{ width: "160px" }} />

          {/* Heading */}
          <h1 className="fw-bold mt-3 display-3">
            <span className="text-gradient fw-bold ">AI Learning</span>
            <br /> Platform
          </h1>

          {/* Subtitle */}
          <p className="text-muted fs-5 ">
            Unlock the future of education with AI-powered courses designed to
            accelerate your learning journey.
          </p>

          {/* HERO IMAGE SECTION */}
          <div className="mt-2">
            <img
              src={hero}
              alt="AI Learning Illustration"
              className="img-fluid"
              style={{
                maxWidth: "460px",
              }}
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center mt-5">
          <div
            className="card shadow-lg border-0 py-5 px-4 rounded-4 position-relative"
            style={{ width: "420px" }}
          >
            {/* 🔥 UNIVERSAL THEME TOGGLE (TOP-RIGHT) */}
            <div className="position-absolute top-0 end-0 mt-3 me-3">
              <ThemeToggle />
            </div>

            <h3 className="fw-bold text-center mb-2">{title}</h3>

            <p
              className="text-muted mb-4 text-center mx-auto"
              style={{ maxWidth: "360px" }}
            >
              {subtitle}
            </p>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
