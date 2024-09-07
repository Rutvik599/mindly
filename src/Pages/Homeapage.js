import React, { useEffect, useState } from "react";
import "../Styles/Homepage.css";
import mainImage from "../undraw_font_re_efri 1.png";
import { ArrowRight, Eye, EyeOff, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification 
} from "../Backend/firebase-init";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
export default function Homeapage() {
  const [isLogin, setIslogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prevState) => !prevState);
  };
  const reload = () => {
    window.location.reload();
  };

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User UID:", user.uid);
        navigate('/');
      } else {
        console.log("User is logged out");
      }
    });
    return () => unsubscribe();
  },[]);

  const closeForm = (value) => {
    if (value === 0) {
      setIslogin(false);
      setIsSignUp(true);
    } else if (value === 1) {
      setIslogin(true);
      setIsSignUp(false);
    } else {
      setIslogin(false);
      setIsSignUp(false);
    }
  };

  const checkformData = () => {
    if (formData.email == "") {
      toast.error("Email Address is not valid");
      return false;
    }
    if (formData.password == "") {
      toast.error("Password is not valid");
      return false;
    }

    if (isSignUp && formData.confirmPassword == "") {
      toast.error("Please fill out all Fields");
      return false;
    }

    if (isSignUp && formData.confirmPassword !== formData.password) {
      toast.error("Password Doesn't Match");
      return false;
    }

    return true;
  };
  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formdataObject = Object.fromEntries(formData.entries());
    setFormData(formdataObject);
  };

  const signin = async () => {
    if (checkformData) {
      try {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        toast.success("Logged in successfully");
        navigate('/');
      } catch (error) {
        checkError(error);
      }
    }
  };

  const signup = async () => {
    if (checkformData) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
        await sendEmailVerification(user);
        toast.success("Sign-up successful! Verification email sent.");
        
      } catch (error) {
        checkError(error);
      }
    } else {
      toast.error("Please fill out all required fields correctly.");
    }
  };
  

  const checkError = (error) =>{
    if (error.code === "auth/email-already-in-use") {
      toast.error("This email is already registered. Please log in.");
    } else if (error.code === "auth/weak-password") {
      toast.error("Password should be at least 6 characters.");
    } else {
      toast.error("Authentication error: " + error.message);
    }
  }
  return (
    <>
      <ToastContainer autoClose={2000}></ToastContainer>
      <form
        className={`commonbutton ${isLogin || isSignUp ? "show" : ""}`}
        onSubmit={handleForm}
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
              name="email"
              placeholder="abc@xyz.com"
              className="inputfield"
            />
          </div>
          <h3 className="labelofinput">Password</h3>
          <div className="input">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="********"
              className="inputfield"
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
              <button href="" className="forgotpassword">
                Forgot Password ?
              </button>
            </div>
          )}
        </div>
        {isSignUp && (
          <div className="confirmPassword">
            <h3 className="labelofinput"> Confirm Password</h3>
            <div className="input">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                name="consfirmPassword"
                placeholder="********"
                className="inputfield"
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
          </div>
        )}
        {isLogin ? (
          <button className="signin" type="submit" onClick={signin}>
            Sign in
          </button>
        ) : (
          <button className="signin" onClick={signup}>
            Sign up
          </button>
        )}
        {isLogin ? (
          <button href="#" className="alreadytext" onClick={() => closeForm(0)}>
            Don't Have An Account ?{" "}
            <span style={{ textDecoration: "underline", marginLeft: "5px" }}>
              Sign up
            </span>
          </button>
        ) : (
          <button href="#" className="alreadytext" onClick={() => closeForm(1)}>
            Already Have An Account ?
            <span style={{ textDecoration: "underline", marginLeft: "5px" }}>
              Sign in
            </span>
          </button>
        )}
      </form>
      <div
        className={`${isLogin || isSignUp ? "makeblur active" : "makeblur"}`}
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
