import React, { useEffect, useState } from "react";
import "../Styles/Homepage.css";
import mainImage from "../undraw_font_re_efri 1.png";
import { ArrowRight, Eye, EyeOff, Loader2, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "../Backend/firebase-init";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Homeapage({ setLoading }) {
  // State variables
  const [isNewUser, setIsNewUser] = useState(() => {
    return localStorage.getItem('newUser') === 'true' || false;
  });
  const [loading, isLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIslogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Toggle visibility of password
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  // Toggle visibility of confirm password
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible((prev) => !prev);

  // Reload the page
  const reload = () => window.location.reload();

  // Handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          if (isNewUser) {
            navigate("/setuserprofile");
          } else {
            toast.success("Login successful", {
              style: { fontSize: "14px", fontFamily: "Roboto" },
            });
            navigate("/");
          }
        } else {
          toast.success("Email Verification Is Pending. Check Your Mail Box.");
        }
      } else {
        console.log("User is logged out");
      }
    });
    return () => unsubscribe();
  }, [navigate, isNewUser]);

  const closeForm = (value) => {
    setIsForgotPassword(false);
    if (value === 0) {
      setIslogin(false);
      setIsSignUp(true);
    } else if (value === 1) {
      setIslogin(true);
      setIsSignUp(false);
    } else if (value === 2) {
      setIsForgotPassword(true);
      setIslogin(false);
      setIsSignUp(false);
    } else {
      setIsForgotPassword(false);
      setIslogin(false);
      setIsSignUp(false);
    }
  };

  // Validate email format
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Check form data validity
  const checkFormData = () => {
    if (!email || !isValidEmail(email)) {
      toast.error("Email Address is not valid");
      return false;
    }
    if (!password) {
      toast.error("Password is not valid");
      return false;
    }

    if (isSignUp) {
      if (!confirmPassword) {
        toast.error("Please fill out all fields");
        return false;
      }
      if (confirmPassword !== password) {
        toast.error("Passwords don't match");
        return false;
      }
    }
    return true;
  };

  // Sign in function
  const signin = async () => {
    isLoading(true);
    if (checkFormData()) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        closeForm(3);
      } catch (error) {
        console.log(error);
        checkError(error);
      }
    }
    isLoading(false);
  };

  // Sign up function
  const signup = async () => {
    isLoading(true);
    if (checkFormData()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await sendEmailVerification(user);
        setIsNewUser(true);
        localStorage.setItem('newUser', 'true');
        closeForm(3);
      } catch (error) {
        checkError(error);
      }
    } else {
      toast.error("Please fill out all required fields correctly.");
    }
    isLoading(false);
  };

  // Check for authentication errors
  const checkError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        toast.error("This email is already registered. Please log in.");
        break;
      case "auth/weak-password":
        toast.error("Password should be at least 6 characters.");
        break;
      case "auth/invalid-email":
        toast.error("Invalid email address. Please enter a valid email.");
        break;
      case "auth/invalid-credential":
        toast.error("Please check your email and password.");
        break;
      case "auth/user-not-found":
        toast.error("No user found with this email. Please sign up.");
        break;
      default:
        toast.error("Authentication error: " + error.message);
    }
  };

  // Reset password function
  const resetEmail = async () => {
    isLoading(true);
    if (!email) {
      toast.error("Enter Valid Email Address", {
        style: { fontSize: "14px", fontFamily: "Roboto" },
      });
    } else {
      try {
        await sendPasswordResetEmail(getAuth(), email);
        closeForm(3);
        toast.success("Reset Link Has been Sent to your email address", {
          style: { fontSize: "14px", fontFamily: "Roboto" },
        });
        closeForm(3);
      } catch (error) {
        toast.error(`Error: ${error.message}`, {
          style: { fontSize: "14px", fontFamily: "Roboto" },
        });
      }
    }
    isLoading(false);
  };

  // Actual Return
  return (
    <>
      <ToastContainer
        style={{
          fontFamily: "Roboto",
          fontSize: "14px",
        }}
        autoClose={2000}
      />
      {/* Login and Sign Up Form */}
      <form
        className={`commonbutton ${isLogin || isSignUp ? "show" : ""}`}
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="sitename1">Mindly</h1>
        <h3 className="thought">
          {isLogin
            ? "Inspire Someone by your Stories and Writing"
            : "Show the world your emotions in words."}
        </h3>
        <span className="close-button">
          <X onClick={() => closeForm(3)} />
        </span>
        <div className="inputfields">
          <h3 className="labelofinput">Email Address</h3>
          <div className="input">
            <input
              type="email"
              placeholder="abc@xyz.com"
              className="inputfield"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <h3 className="labelofinput">Password</h3>
          <div className="input">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="********"
              className="inputfield"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              {isPasswordVisible ? (
                <EyeOff
                  size={20}
                  strokeWidth={1.7}
                  style={{ marginRight: "5px" }}
                />
              ) : (
                <Eye
                  size={20}
                  strokeWidth={1.7}
                  style={{ marginRight: "5px" }}
                />
              )}
            </span>
          </div>
          {isLogin && (
            <div className="forgot">
              <button className="forgotpassword" onClick={() => closeForm(2)}>
                Forgot Password?
              </button>
            </div>
          )}
        </div>
        {isSignUp && (
          <div className="confirmPassword">
            <h3 className="labelofinput">Confirm Password</h3>
            <div className="input">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                placeholder="********"
                className="inputfield"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={toggleConfirmPasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {isConfirmPasswordVisible ? (
                  <EyeOff
                    size={20}
                    strokeWidth={1.7}
                    style={{ marginRight: "5px" }}
                  />
                ) : (
                  <Eye
                    size={20}
                    strokeWidth={1.7}
                    style={{ marginRight: "5px" }}
                  />
                )}
              </span>
            </div>
          </div>
        )}
        {isLogin ? (
          <button
            className="signin"
            type="button"
            onClick={signin}
            disabled={loading}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {!loading ? (
              "Sign in"
            ) : (
              <Loader2
                size={15}
                style={{ color: "white" }}
                className="loader"
              />
            )}
          </button>
        ) : (
          <button
            className="signin"
            type="button"
            onClick={signup}
            disabled={loading}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {!loading ? (
              "Sign up"
            ) : (
              <Loader2
                size={15}
                style={{ color: "white" }}
                className="loader"
              />
            )}
          </button>
        )}
        {isLogin ? (
          <button className="alreadytext" onClick={() => closeForm(0)}>
            Don't Have An Account?{" "}
            <span style={{ textDecoration: "underline", marginLeft: "5px" }}>
              Sign up
            </span>
          </button>
        ) : (
          <button className="alreadytext" onClick={() => closeForm(1)}>
            Already Have An Account?{" "}
            <span style={{ textDecoration: "underline", marginLeft: "5px" }}>
              Sign in
            </span>
          </button>
        )}
      </form>

      {/* Forgot Password Form */}
      <form
        className={`commonbutton ${isForgotPassword ? "show" : ""}`}
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="sitename1">Mindly</h1>
        <h3 className="thought">Password Can be Changed, Emotions Can't</h3>
        <span className="close-button">
          <X onClick={() => closeForm(3)} />
        </span>
        <div className="inputfields">
          <h3 className="labelofinput">Email Address</h3>
          <div className="input">
            <input
              type="email"
              placeholder="abc@xyz.com"
              className="inputfield"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="signin"
            type="button"
            onClick={resetEmail}
            disabled={loading}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {!loading ? (
              "Send Reset Link"
            ) : (
              <Loader2
                size={15}
                style={{ color: "white" }}
                className="loader"
              />
            )}
          </button>
          <button className="alreadytext" onClick={() => closeForm(1)}>
            Already Have An Account?{" "}
            <span style={{ textDecoration: "underline", marginLeft: "5px" }}>
              Sign in
            </span>
          </button>
        </div>
      </form>

      {/* Dashboard */}
      <div
        className={`${
          isLogin || isSignUp || isForgotPassword
            ? "makeblur active"
            : "makeblur"
        }`}
        onClick={
          isLogin || isSignUp || isForgotPassword
            ? () => closeForm(3)
            : undefined
        }
      >
        <div className="header">
          <h1 className="sitename">Mindly</h1>
          <div className="headerpart">
            <a href="*" className="homepagebuttons">
              Features
            </a>
            <a href="*" className="homepagebuttons">
              Contact Team
            </a>
            <a href="*" className="homepagebuttons">
              Write
            </a>
            <a href="#" className="signinbutton" onClick={() => closeForm(1)}>
              Sign in
            </a>
          </div>
        </div>
        <div className="headerbottom">
          <img src={mainImage} alt="" />
          <div className="headerbottomcontent">
            <h1 className="thought1">Unveil Thoughts</h1>
            <h1 className="thought2">Voice Yours</h1>
            <h3 className="qoute">
              Place Where Your Stories Meet Others' Emotions.
            </h3>
            <a href="#" className="getstarted" onClick={() => closeForm(1)}>
              Get Started <ArrowRight style={{ marginLeft: 2 }} />
            </a>
          </div>
        </div>
        <div className="footer">
          <h1 className="sitename" onClick={reload}>
            Mindly
          </h1>
          <div className="footerpart">
            <a href="*" className="footerbutons">
              Team Mindly
            </a>
            <a href="*" className="footerbutons">
              Contact
            </a>
            <a href="*" className="footerbutons">
              About
            </a>
            <a href="*" className="footerbutons">
              Terms
            </a>
            <a href="*" className="footerbutons">
              Help
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
