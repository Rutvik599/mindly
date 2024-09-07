import React, { useState } from "react";
import "../Styles/Homepage.css";
import mainImage from "../undraw_font_re_efri 1.png";
import { ArrowRight, Eye, EyeOff, X } from "lucide-react";
export default function Homeapage() {
  const [isLogin, setIslogin] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const generateHeight = (value) => {
    if (value == 0) {
      setIslogin(false);
      setIsSignUp(false);
    }
  };
  return (
    <>
      <div className={isLogin || isSignUp ? "loginform" : ""}>
        {isLogin && (
          <div className={isLogin ? "mainlogin" : "notshow"}>
            <h1 className="sitename1">Mindly</h1>
            <h3 className="thought">
              Inspire Someone by your Stories and Writing
            </h3>
            <span className="close-button">
              <X onClick={() => generateHeight(0)} />
            </span>
            <div className="inputfields">
              <h3 className="labelofinput">Email Address</h3>
              <div className="input">
                <input
                  type="email"
                  name=""
                  id=""
                  placeholder="abc@xyz.com"
                  className="inputfield"
                />
              </div>
              <h3 className="labelofinput">Password</h3>
              <div className="input">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name=""
                  id=""
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
              <div className="forgot">
                <a href="" className="forgotpassword">
                  Forgot Password ?
                </a>
              </div>
            </div>
            <button className="signin">Sign in</button>
            <a href="" className="alreadytext">
              Don't Have An Account ? <span >Sign up</span>
            </a>
          </div>
        )}
        {isSignUp && (
          <div className="mainsignup">{/* Sign-up form content here */}</div>
        )}
      </div>

      <div className="header">
        <h1 className="sitename" >
          Mindly
        </h1>
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
          <a href="*" className="signinbutton" onClick={()=>setIslogin(true)}>
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
          <a href="*" className="getstarted">
            Get Started <ArrowRight style={{ marginLeft: 2 }} />
          </a>
        </div>
      </div>
      <div className="footer">
        <h1 className="sitename" onClick={() => window.location.reload()}>
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
    </>
  );
}
