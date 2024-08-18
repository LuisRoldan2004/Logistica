// src/components/SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../helpers/firebaseConfig"; // Importa la configuración de Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChars) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    } else {
      setPasswordError("");
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("User registered successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Error registering user: " + error.message);
    }
  };

  return (
    <div className="container-web">
      <ToastContainer />
      <div className="info-container-sing">
        <div>
          <h2>SupplyChainOptimizer is a comprehensive solution designed to streamline and enhance the efficiency of supply chain management</h2>
        </div>
      </div>
      <div className="login-container">
        <div className="login-box">
          <div className="image-container-sign">
            <img src="https://cdn.pixabay.com/photo/2023/01/17/17/09/map-7725076_1280.png" alt="Map"/>
          </div>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div id="emailHelp" className="form-text">Welcome!</div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && <div className="text-danger mt-2">{passwordError}</div>}
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          <p className="mt-3">
            Already have an account?{" "}
            <button className="btn btn-link p-0" onClick={() => navigate("/login")}>Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
