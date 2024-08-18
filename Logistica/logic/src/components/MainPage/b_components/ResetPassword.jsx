// src/components/MainPage/b_components/ResetPassword.js
import React, { useState } from 'react';
import { auth } from '../helpers/firebaseConfig'; // Ruta actualizada
import { sendPasswordResetEmail } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/ResetPassword.css'; // Ruta para CSS personalizado

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Se ha enviado un correo electrónico para restablecer la contraseña.');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="reset-password-container container">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Restablecer Contraseña</h2>
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Enviar correo de restablecimiento</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="info-container-sing text-center mt-4">
        <div className="image-container-sign">
          <img src="https://cdn.pixabay.com/photo/2023/01/17/17/09/map-7725076_1280.png" alt="Map"/>
        </div>
        <h2>Recupera tu contraseña de forma rápida y sencilla</h2>
      </div>
    </div>
  );
};

export default ResetPassword;
