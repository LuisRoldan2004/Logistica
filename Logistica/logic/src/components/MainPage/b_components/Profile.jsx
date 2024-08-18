import React from 'react';
import { auth } from '../helpers/firebaseConfig'; // Asegúrate de que esta ruta sea correcta
import { deleteUser } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        toast.success('Tu cuenta y todos los datos asociados han sido eliminados.');
      } else {
        toast.error('No hay ningún usuario autenticado.');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>Mi Perfil</h2>
      <p>Aquí puedes eliminar tu cuenta.</p>
      <button className="btn btn-danger" onClick={handleDeleteAccount}>Eliminar Cuenta</button>
    </div>
  );
};

export default Profile;
