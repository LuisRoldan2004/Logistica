import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { db, auth } from "../../MainPage/helpers/firebaseConfig";
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Register.css';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../MapContent';

const Register = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [vehicleCant, setVehicleCant] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [registrationId, setRegistrationId] = useState(null);
  const totalCapacity = vehicleCant * capacity;
  const navigate = useNavigate();
  
  const nextStep = async () => {
    if (step === 3) {
      if (cargoWeight > totalCapacity) {
        toast.error('El peso de la carga excede la capacidad total disponible.');
        return;
      }
    }
  
    if (step === 1) {
      const user = auth.currentUser;
      if (!user) {
        toast.error('No estás autenticado!');
        return;
      }
  
      const newRegistrationRef = doc(collection(db, 'registrations'), uuidv4());
      await setDoc(newRegistrationRef, {
        userId: user.uid, // Guardar el UID del usuario autenticado
        createdAt: serverTimestamp()
      });
      setRegistrationId(newRegistrationRef.id);
    }
  
    if (step === 2) {
      await saveVehicleDetails();
    }
  
    if (step === 3) {
      await saveCargoDetails();
    }
  
    if (step < 5) {
      setStep(step + 1);
    }
  };
  

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 5) { // Solo en el último paso
      if (!fullName || !companyName || !phoneNumber || !startTime || !endTime) {
        toast.error('Por favor, completa todos los campos.');
        return;
      }
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error('No estás autenticado!');
          return;
        }
  
        // Guardar datos del representante
        await setDoc(doc(db, 'representatives', registrationId), {
          fullName,
          companyName,
          phoneNumber,
          startTime,
          endTime,
          userId: user.uid // Asociar datos con el UID del usuario
        });
  
        // Verificar si se han proporcionado coordenadas antes de intentar guardarlas
        if (registrationId) {
          // Aquí iría el código para guardar las coordenadas si existen
          // await saveCoordinates();
        }
  
        toast.success('Registro completado exitosamente');
        handleNavigate(); // Navegar después de completar el registro
      } catch (error) {
        console.error('Error al guardar los datos: ', error);
        toast.error('Error al completar el registro ');
      }
    } else {
      nextStep(); 
    }
  };
  
    const saveVehicleDetails = async () => {
      if (registrationId) {
        try {
          const user = auth.currentUser;
          if (!user) {
            toast.error('No estás autenticado!');
            return;
          }
    
          await setDoc(doc(db, 'vehicleDetails', registrationId), {
            vehicleType,
            capacity,
            vehicleCant,
            userId: user.uid // Asociar datos con el UID del usuario
          });
        } catch (error) {
          console.error('Error al guardar los detalles del vehículo: ', error);
          toast.error('Error al guardar los detalles del vehículo');
        }
      }
    };
    

    const saveCargoDetails = async () => {
      if (registrationId) {
        try {
          const user = auth.currentUser;
          if (!user) {
            toast.error('No estás autenticado!');
            return;
          }
    
          await setDoc(doc(db, 'cargoDetails', registrationId), {
            cargoType,
            cargoWeight,
            userId: user.uid // Asociar datos con el UID del usuario
          });
        } catch (error) {
          console.error('Error al guardar los detalles de la carga: ', error);
          toast.error('Error al guardar los detalles de la carga');
        }
      }
    };
    

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <h2>Representative</h2>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                placeholder="Ej. Jose Aldama Ramirez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="companyName" className="form-label">Company</label>
              <input
                type="text"
                className="form-control"
                id="companyName"
                placeholder="Ej. Transportes mx"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                placeholder="Ej. 123 245 2122"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-light" onClick={nextStep}>Next</button>
          </>
        );
      case 2:
        return (
          <>
            <h2>Detalles del vehículo</h2>
            <div className="mb-3">
              <label htmlFor="vehicleType" className="form-label">Vehicle type</label>
              <select
                className="form-control"
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="" disabled>Select a vehicle type</option>
                <option value="camión">Truck</option>
                <option value="furgoneta">Van</option>
                <option value="coche">Car</option>
                <option value="bicicleta">Bicycle</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="capacity" className="form-label">Load capacity (kg)</label>
              <input
                type="number"
                className="form-control"
                id="capacity"
                placeholder="Ej. 120"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="vehicleCant" className="form-label">Quantity of vehicles</label>
              <input
                type="number"
                className="form-control"
                id="vehicleCant"
                placeholder="Ej. 12"
                value={vehicleCant}
                onChange={(e) => setVehicleCant(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-light" onClick={prevStep}>Back</button>
            <button type="button" className="btn btn-light" onClick={() => { nextStep(); saveVehicleDetails(); }}>Next</button>
          </>
        );
      case 3:
        return (
          <>
            <h2>Load details</h2>
            <div className="mb-3">
              <label htmlFor="cargoType" className="form-label">Mercancy type</label>
              <input
                type="text"
                className="form-control"
                id="cargoType"
                placeholder="Ej. Productos electrónicos"
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cargoWeight" className="form-label">Load weight (kg)</label>
              <input
                type="number"
                className="form-control"
                id="cargoWeight"
                placeholder="Ej. 500"
                value={cargoWeight}
                onChange={(e) => setCargoWeight(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-light" onClick={prevStep}>Back</button>
            <button type="button" className="btn btn-light" onClick={() => { nextStep(); saveCargoDetails(); }}>Next</button>
          </>
        );
      case 4:
        return (
          <>
            <h2>Schedules</h2>
            <div className="mb-3">
              <label htmlFor="startTime" className="form-label">Start time</label>
              <input
                type="time"
                className="form-control"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="endTime" className="form-label">End time</label>
              <input
                type="time"
                className="form-control"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-light" onClick={prevStep}>Back</button>
            <button type="button" className="btn btn-light" onClick={nextStep}>Next</button>
          </>
        );
        case 5:
      return (
        <>
        <div className='map-container-register'>
          <h2>Select your wineries or departure points</h2>
          <p>Select new wineries if you wish</p>
          <MapComponent />
          <button type="button" className="btn btn-light" onClick={prevStep}>Back</button>
          <button type="button" className="btn btn-light" onClick={handleSubmit}>Go</button>
          </div>
        </>
      );
    default:
      return null;
    }
  };


    const getProgressBarWidth = () => {
      switch(step) {
        case 1:
          return '20%';
        case 2:
          return '40%';
        case 3:
          return '60%';
        case 4:
          return '80%';
        case 5:
          return '100%';
        default:
          return '0%';
      }
    };
    
    const handleNavigate = () => {
      navigate('/myroutes');
    };

  return (
    <div className="container-web-r">
      <ToastContainer />
      <div className="info-container-register">
        <div className="register-container">
          <div className="register-box">
            <div className="progress-bar" style={{ width: getProgressBarWidth() }}></div>
            <form onSubmit={handleSubmit}>
              {renderStep()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;