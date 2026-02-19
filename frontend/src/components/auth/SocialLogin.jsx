import React from "react";
import logoGoogle from "../../assets/images/google.jpg";
import logoApple from "../../assets/images/apple.png";
import { auth, googleProvider, signInWithPopup } from "../../firebase"; // Adjust path if needed
import { useAuth } from "../../context/AuthContext";

const SocialLogin = () => {
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Call backend to exchange Google token for your JWT
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Google login failed");
      }

      // Use existing AuthContext login
      login(data, true);
<<<<<<< HEAD
    } catch (err) {  // ✅ FIXED: Removed TypeScript ": any"
=======
    } catch (err) {
>>>>>>> upstream/main
      alert(err.message || "Google sign-in error");
    }
  };

  return (
<<<<<<< HEAD
    <div className="d-grid gap-2 mt-4">
      <button
        className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
=======
    <div className="flex flex-col gap-2.5 mt-4">
      <button
        className="flex items-center justify-center w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00BEA5] transition-all dark:bg-[#0f172a] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
>>>>>>> upstream/main
        type="button"
        onClick={handleGoogleLogin}
      >
        <img
          src={logoGoogle}
          alt="Google"
<<<<<<< HEAD
          style={{ width: "20px", height: "20px" }}
          className="me-2"
        />
        <span>Sign in with Google</span>
      </button>

      <button
        className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
=======
          className="w-4 h-4 mr-2.5 object-contain"
        />
        <span className="text-sm">Sign in with Google</span>
      </button>

      <button
        className="flex items-center justify-center w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 opacity-60 cursor-not-allowed dark:bg-[#0f172a] dark:border-gray-700 dark:text-gray-300"
>>>>>>> upstream/main
        type="button"
        disabled
      >
        <img
          src={logoApple}
          alt="Apple"
<<<<<<< HEAD
          style={{ width: "20px", height: "20px" }}
          className="me-2"
        />
        <span>Sign in with Apple</span>
=======
          className="w-4 h-4 mr-2.5 object-contain"
        />
        <span className="text-sm">Sign in with Apple</span>
>>>>>>> upstream/main
      </button>
    </div>
  );
};

export default SocialLogin;
