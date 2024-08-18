import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/MainPage/b_components/Navbar'; // Asegúrate de que la ruta sea correcta
import MainPage from './components/MainPage/MainPage'; // Asegúrate de que la ruta sea correcta
import SignUp from './components/MainPage/b_components/SingUp';
import Login from './components/MainPage/b_components/Login';
import Register from './components/Map/b_components/Register';
import UserDetails from './components/Map/b_components/UserDetails';
import MakeRoute from './components/Map/b_components/MakeRoute';
import Store from './components/Map/b_components/Store';
import ResetPassword from './components/MainPage/b_components/ResetPassword';
import Report from './components/MainPage/b_components/Report';

function App() {
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <AppNavbar user={user} logout={logout} />
      <Routes>/reset-password
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/makearoute/:registrationId" element={<MakeRoute />} />
        <Route path="/myroutes" element={<UserDetails />} />
        <Route path='/store' element={<Store/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        <Route path='/report' element={<Report/>}/>
      </Routes>
    </Router>
  );
}

export default App;