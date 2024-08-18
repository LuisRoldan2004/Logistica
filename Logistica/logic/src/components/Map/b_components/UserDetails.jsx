// UserDetails.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../MainPage/helpers/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Accordion, Card, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/UserDetails.css';
import MakeRoute from './MakeRoute';
import { calculateRequiredVehicles } from '../helpers/calculateVehicles';

const UserDetails = () => {
  const [registrations, setRegistrations] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [cargoDetails, setCargoDetails] = useState({});
  const [representatives, setRepresentatives] = useState({});
  const [coordinates, setCoordinates] = useState([]);
  const [showMakeRoute, setShowMakeRoute] = useState(false);
  const [routeData, setRouteData] = useState({});
  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('User not authenticated');
          return;
        }
        const userId = user.uid;

        // Fetch registrations
        const registrationsQuery = query(collection(db, 'registrations'), where('userId', '==', userId));
        const registrationDocs = await getDocs(registrationsQuery);
        if (registrationDocs.empty) {
          console.log('No registration data found for this user');
          return;
        }
        const registrationsData = registrationDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRegistrations(registrationsData);

        // Fetch vehicle, cargo, and representative details
        const vehiclePromises = registrationsData.map(async (registration) => {
          const vehicleDoc = await getDoc(doc(db, 'vehicleDetails', registration.id));
          return { id: registration.id, vehicleDetails: vehicleDoc.exists() ? vehicleDoc.data() : null };
        });
        const cargoPromises = registrationsData.map(async (registration) => {
          const cargoDoc = await getDoc(doc(db, 'cargoDetails', registration.id));
          return { id: registration.id, cargoDetails: cargoDoc.exists() ? cargoDoc.data() : null };
        });
        const representativePromises = registrationsData.map(async (registration) => {
          const representativeDoc = await getDoc(doc(db, 'representatives', registration.id));
          return { id: registration.id, representative: representativeDoc.exists() ? representativeDoc.data() : null };
        });

        const vehicleResults = await Promise.all(vehiclePromises);
        const cargoResults = await Promise.all(cargoPromises);
        const representativeResults = await Promise.all(representativePromises);

        const vehicleDetailsMap = vehicleResults.reduce((acc, { id, vehicleDetails }) => {
          acc[id] = vehicleDetails;
          return acc;
        }, {});
        const cargoDetailsMap = cargoResults.reduce((acc, { id, cargoDetails }) => {
          acc[id] = cargoDetails;
          return acc;
        }, {});
        const representativesMap = representativeResults.reduce((acc, { id, representative }) => {
          acc[id] = representative;
          return acc;
        }, {});

        setVehicleDetails(vehicleDetailsMap);
        setCargoDetails(cargoDetailsMap);
        setRepresentatives(representativesMap);

        // Fetch coordinates
        const coordinatesQuery = query(collection(db, 'coordinates'), where('uid', '==', userId));
        const coordinateDocs = await getDocs(coordinatesQuery);
        if (!coordinateDocs.empty) {
          const coordinatesData = coordinateDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCoordinates(coordinatesData);
        }

      } catch (error) {
        console.error('Error fetching details: ', error);
      }
    };

    fetchDetails();
  }, []);

  const handleMakeRoute = (registrationId) => {
    const vehicleData = vehicleDetails[registrationId];
    const cargoData = cargoDetails[registrationId];
  
    if (vehicleData && cargoData) {
      const { requiredVehicles, error } = calculateRequiredVehicles(vehicleData.capacity, cargoData.cargoWeight);
  
      if (error) {
        window.alert(error);
        return;
      }
  
      setRouteData({
        vehicleCant: vehicleData.vehicleCant || 0,
        vehicleCapacity: vehicleData.capacity || 0,
        cargoWeight: cargoData.cargoWeight || 0,
        requiredVehicles // Añade este valor al estado
      });
      setShowMakeRoute(true);
    } else {
      window.alert('Vehicle or cargo data missing');
    }
  };
  

  return (
    <>
      {showMakeRoute && <MakeRoute {...routeData} />} {/* Mostrar MakeRoute solo si showMakeRoute es true */}
      <div className="user-details">
        <h2>Tus registros</h2>
        <Accordion>
          {registrations.map((registration, index) => (
            <Accordion.Item eventKey={index.toString()} key={registration.id}>
              <Accordion.Header>
                Registration ID: {registration.id}
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={4}>
                    {representatives[registration.id] && (
                      <Card>
                        <Card.Body>
                          <Card.Title>Representative Details</Card.Title>
                          <Card.Text>
                            <strong>Name:</strong> {representatives[registration.id].fullName || 'N/A'}
                          </Card.Text>
                          <Card.Text>
                            <strong>Company:</strong> {representatives[registration.id].companyName || 'N/A'}
                          </Card.Text>
                          <Card.Text>
                            <strong>Phone:</strong> {representatives[registration.id].phoneNumber || 'N/A'}
                          </Card.Text>
                          <Card.Text>
                            <strong>Start Time:</strong> {representatives[registration.id].startTime || 'N/A'}
                          </Card.Text>
                          <Card.Text>
                            <strong>End Time:</strong> {representatives[registration.id].endTime || 'N/A'}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                  <Col md={4}>
                    {vehicleDetails[registration.id] && (
                      <Card>
                        <Card.Body>
                          <Card.Title>Vehicle Details</Card.Title>
                          <Card.Text>
                            <strong>Vehicle Type:</strong> {vehicleDetails[registration.id].vehicleType || 'N/A'}
                          </Card.Text>
                          <Card.Text>
                            <strong>Capacity:</strong> {vehicleDetails[registration.id].capacity || 'N/A'} kg
                          </Card.Text>
                          <Card.Text>
                            <strong>Quantity:</strong> {vehicleDetails[registration.id].vehicleCant || 'N/A'}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                  <Col md={4}>
                    {cargoDetails[registration.id] && (
                      <Card>
                        <Card.Body>
                          <Card.Title>Cargo Details</Card.Title>
                          <Card.Text>
                            <strong>Cargo Type:</strong> {cargoDetails[registration.id].cargoType || 'N/A'}
                          </Card.Text>
                          <Card.Text>
                            <strong>Cargo Weight:</strong> {cargoDetails[registration.id].cargoWeight || 'N/A'} kg
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                </Row>
                <br />
                <Button
                  variant="dark"
                  onClick={() => handleMakeRoute(registration.id)} // Pasar el id del registro
                >
                  {showMakeRoute ? 'Select this register' : 'Make a Route!'}
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default UserDetails;
