import React from "react";
import logo from "../../assets/images/logo.png";
import hero from "../../assets/images/hero-img.jpg";
import ThemeToggle from "../common/ThemeToggle";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
<<<<<<< HEAD
    <div className="container-fluid min-vh-100 d-flex align-items-center ps-lg-5">
      <div className="row w-100">
        {/* LEFT SECTION */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center px-5">
          {/* Logo */}
          <img src={logo} alt="UptoSkills" style={{ width: "160px" }} />

          {/* Heading */}
          <h1 className="fw-bold mt-3 display-3">
            <span className="text-gradient fw-bold ">AI Learning</span>
=======
    <div className="min-h-screen flex items-center w-full bg-white dark:bg-[#0f172a]">
      <div className="flex w-full h-full">
        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-center px-10 w-1/2 relative bg-white dark:bg-[#0f172a]">
          {/* Logo */}
          <img src={logo} alt="UptoSkills" className="w-32" />

          {/* Heading */}
          <h1 className="font-bold mt-6 text-4xl leading-tight text-gray-900 dark:text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#7846aa] font-bold">
              AI Learning
            </span>
>>>>>>> upstream/main
            <br /> Platform
          </h1>

          {/* Subtitle */}
<<<<<<< HEAD
          <p className="text-muted fs-5 ">
=======
          <p className="text-gray-500 dark:text-gray-400 text-base mt-3 max-w-sm">
>>>>>>> upstream/main
            Unlock the future of education with AI-powered courses designed to
            accelerate your learning journey.
          </p>

          {/* HERO IMAGE SECTION */}
<<<<<<< HEAD
          <div className="mt-2">
            <img
              src={hero}
              alt="AI Learning Illustration"
              className="img-fluid"
              style={{
                maxWidth: "460px",
              }}
=======
          <div className="mt-6">
            <img
              src={hero}
              alt="AI Learning Illustration"
              className="max-w-[360px] w-full h-auto object-contain"
>>>>>>> upstream/main
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
<<<<<<< HEAD
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
=======
        <div className="mt-[24px] mb-[24px] w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-0 bg-white dark:bg-[#0f172a]">
          <div className="bg-white dark:bg-[#0f172a] shadow-[0_10px_30px_rgba(0,0,0,0.19)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.19)] border-0 py-7 px-6 rounded-2xl relative w-full max-w-[370px] dark:border dark:border-gray-800">
            {/* 🔥 UNIVERSAL THEME TOGGLE (TOP-RIGHT) */}
            <div className="absolute top-3 right-3">
              <ThemeToggle />
            </div>

            <h3 className="font-bold text-center mb-1.5 text-xl text-gray-900 dark:text-white">
              {title}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 mb-5 text-center mx-auto max-w-[320px] text-sm">
>>>>>>> upstream/main
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
