import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { db, auth } from '../../MainPage/helpers/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisteredLocations = ({ requiredVehicles }) => {
  const [vehicleCounts, setVehicleCounts] = useState({});
  const [totalAvailableVehicles, setTotalAvailableVehicles] = useState(0);
  const [vehicleCapacity, setVehicleCapacity] = useState(0);
  const [cargoData, setCargoData] = useState({});
  const [allButtonsDisabled, setAllButtonsDisabled] = useState(false);
  const [assignedVehicles, setAssignedVehicles] = useState(0);
  const [coordinates, setCoordinates] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false); // Estado para controlar minimizar/maximizar

  useEffect(() => {
    const fetchUserId = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
      } else {
        console.error('User not authenticated');
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const loadVehicleData = async () => {
        try {
          const q = query(collection(db, 'vehicleDetails'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          let totalAvailableVehicles = 0;
          let vehicleCapacity = 0;

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            totalAvailableVehicles += parseInt(data.vehicleCant, 10) || 0;
            vehicleCapacity = parseInt(data.capacity, 10) || vehicleCapacity;
          });
          setTotalAvailableVehicles(totalAvailableVehicles);
          setVehicleCapacity(vehicleCapacity);
        } catch (error) {
          console.error('Error fetching vehicle data:', error);
        }
      };

      const loadCargoData = async () => {
        try {
          const q = query(collection(db, 'cargoDetails'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          let cargoData = {};

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            cargoData = {
              ...cargoData,
              [data.locationId]: parseInt(data.cargoWeight, 10) || 0,
            };
          });
          setCargoData(cargoData);
        } catch (error) {
          console.error('Error fetching cargo data:', error);
        }
      };

      const loadCoordinates = async () => {
        try {
          const q = query(collection(db, 'coordinates'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          const coordinatesData = querySnapshot.docs.map(doc => doc.data());
          setCoordinates(coordinatesData);
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      };

      loadVehicleData();
      loadCargoData();
      loadCoordinates();
    }
  }, [userId]);

  const handleInputChange = (index, value) => {
    setVehicleCounts(prevCounts => {
      const newCounts = { ...prevCounts, [index]: parseInt(value, 10) || 0 };
      // Calculate total assigned vehicles
      const totalAssigned = Object.values(newCounts).reduce((acc, count) => acc + count, 0);
      setAssignedVehicles(totalAssigned);
      // Disable buttons if requiredVehicles is met
      setAllButtonsDisabled(totalAssigned >= requiredVehicles);
      return newCounts;
    });
  };

  const handleAddClick = (index) => {
    const count = vehicleCounts[index] || 0;
    const totalAssigned = assignedVehicles + count;
    if (totalAssigned > requiredVehicles) {
      alert(`Cannot add more vehicles. Required: ${requiredVehicles}, Already Assigned: ${assignedVehicles}`);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000, backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Button variant="secondary" onClick={toggleMinimize} style={{ marginBottom: '10px' }}>
        {isMinimized ? 'Maximizar' : 'Minimizar'}
      </Button>
      {!isMinimized && (
        <>
          <h4>Registered Locations:</h4>
          <p>Required Vehicles: {requiredVehicles}</p>
          <p>Assigned Vehicles: {assignedVehicles}</p>
          <ul>
            {coordinates.map((coord, index) => (
              <li key={index}>
                {coord.name ? coord.name : 'Unnamed Place'} - Lat: {coord.lat}, Lng: {coord.lng}
                <div className="input-group mt-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Number of vehicles"
                    aria-label="Number of vehicles"
                    value={vehicleCounts[index] || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={allButtonsDisabled}
                  />
                  <Button
                    variant="primary"
                    onClick={() => handleAddClick(index)}
                    disabled={allButtonsDisabled}
                  >
                    Add
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default RegisteredLocations;
