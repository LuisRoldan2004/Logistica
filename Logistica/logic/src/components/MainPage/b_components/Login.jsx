import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../helpers/firebaseConfig'; // Verifica la ruta de importación
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar/ocultar contraseña
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success("User logged in successfully!");
      setUser(user.email); // Puedes almacenar el email o el UID del usuario
      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password!");
    }
  };

  return (
    <div className="container-web">
      <ToastContainer />
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"} // Mostrar u ocultar la contraseña
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-check mb-3 d-flex align-items-center">
              <input
             type="checkbox"
             className="form-check-input me-2" // Añade margen a la derecha del checkbox
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)} // Cambiar el estado de showPassword
             />
            <label className="form-check-label" htmlFor="showPassword">Show Password</label>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          <p className="mt-3">
            <button className="btn btn-link p-0" onClick={() => navigate("/reset-password")}>¿Olvidaste tu contraseña?</button>
          </p>
          <p className="mt-3">
            Don't have an account?{" "}
            <button className="btn btn-link p-0" onClick={() => navigate("/signup")}>Sign Up</button>
          </p>
        </div>
      </div>
      <div className="info-container">
        <div>
          <div className="image-container">
            <img src="https://cdn.pixabay.com/photo/2023/01/17/17/09/map-7725076_1280.png" alt="Map"/>
          </div>
          <h2>SupplyChainOptimizer is a comprehensive solution designed to streamline and enhance the efficiency of supply chain management</h2>
        </div>
      </div>
    </div>
  );
};

export default Login;
