import React from "react";
import logoGoogle from "../../assets/images/google.jpg";
import logoApple from "../../assets/images/apple.png";

const SocialLogin = () => {
  return (
    <div className="d-grid gap-2 mt-4">
      <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center">
        <img
          src={logoGoogle}
          alt="Google"
          style={{ width: "20px", height: "20px" }}
          className="me-2"
        />
        <span>Sign in with Google</span>
      </button>

      <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center">
        <img
          src={logoApple}
          alt="Apple"
          style={{ width: "20px", height: "20px" }}
          className="me-2"
        />
        <span>Sign in with Apple</span>
      </button>
    </div>
  );
};

export default SocialLogin;
