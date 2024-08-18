import React, { useEffect, useState } from 'react';
import { db, auth } from '../../MainPage/helpers/firebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../style/MakeRoute.css';
import LocationRegister from './LocationRegister';
import DraggablePopup from './DraggablePopup';
import RegisteredLocations from './RegisteredLocation';

const SetViewOnClick = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = coords.reduce((bounds, { lat, lng }) => bounds.extend([lat, lng]), L.latLngBounds());
      map.fitBounds(bounds);
      console.log('Map view adjusted to coordinates:', coords);
    }
  }, [coords, map]);
  return null;
};

const fetchOptimizedRoute = async (coordinates) => {
  const apiKey = '2852492f-658f-4044-b4d3-364ff592a2fe'; // Reemplaza con tu clave de API
  const points = coordinates.map(coord => `${coord.lat},${coord.lng}`).join('&point=');

  const url = `https://graphhopper.com/api/1/route?point=${points}&vehicle=car&locale=es&key=${apiKey}&points_encoded=false`;

  try {
    const response = await axios.get(url);
    const route = response.data.paths[0];
    const optimizedCoords = route.points.coordinates.map(([lng, lat]) => ({ lat, lng }));
    return optimizedCoords;
  } catch (error) {
    console.error('Error fetching optimized route:', error);
    return [];
  }
};

const UserLocationMarker = ({ position }) => {
  return position === null ? null : (
    <Marker position={position}>
      <Popup>Tu ubicación actual</Popup>
    </Marker>
  );
};

const MakeRoute = ({ vehicleCant, vehicleCapacity, cargoWeight, requiredVehicles }) => {
  const [coordinates, setCoordinates] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [userId, setUserId] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null); // Estado para la ubicación actual

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
      const fetchCoordinates = async () => {
        try {
          const q = query(collection(db, 'coordinates'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          const coords = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            coords.push({ id: doc.id, lat: data.lat, lng: data.lng });
          });
          console.log('Fetched coordinates:', coords);
          setCoordinates(coords);
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      };

      fetchCoordinates();
    }
  }, [userId]);

  useEffect(() => {
    const optimizeRoute = async () => {
      let allCoordinates = [...coordinates, ...selectedCoordinates];

      // Añadir la ubicación actual si existe
      if (currentPosition) {
        allCoordinates = [{ lat: currentPosition[0], lng: currentPosition[1] }, ...allCoordinates];
      }

      if (allCoordinates.length > 1) {
        const route = await fetchOptimizedRoute(allCoordinates);
        setOptimizedRoute(route);
      }
    };

    optimizeRoute();
  }, [selectedCoordinates, coordinates, currentPosition]);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition([latitude, longitude]);
        },
        (error) => {
          console.error('Error detecting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleAddLocation = (location) => {
    console.log('Location added:', location);
    setSelectedCoordinates([...selectedCoordinates, location]);
  };

  const handleDragEnd = (index) => ({ lat, lng }) => {
    console.log(`Dragged location ${index} to: Lat: ${lat}, Lng: ${lng}`);
    const updatedCoordinates = [...selectedCoordinates];
    updatedCoordinates[index] = { ...updatedCoordinates[index], lat, lng };
    setSelectedCoordinates(updatedCoordinates);
  };

  const handleDiscard = (index, id) => async () => {
    try {
      if (id) {
        await deleteDoc(doc(db, 'coordinates', id));
        console.log(`Document with id ${id} discarded`);
        setCoordinates(coordinates.filter((coord) => coord.id !== id));
      } else {
        console.log(`Location ${index} discarded`);
        setSelectedCoordinates(selectedCoordinates.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleUpdateVehicleCount = (index, count) => {
    console.log(`Updating vehicle count for location ${index}: ${count}`);
    const updatedCoordinates = [...coordinates];
    updatedCoordinates[index] = { ...updatedCoordinates[index], vehicles: count };
    setCoordinates(updatedCoordinates);
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <LocationRegister onAddLocation={handleAddLocation} />
      <MapContainer center={[0, 0]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <UserLocationMarker position={currentPosition} /> {/* Marcador de ubicación en tiempo real */}
        {coordinates.map((coord) => (
          <Marker key={`db-${coord.id}`} position={[coord.lat, coord.lng]}>
            <Popup>
              <div>Database Location</div>
              <Button variant="danger" onClick={() => handleDiscard(null, coord.id)}>Discard</Button>
            </Popup>
          </Marker>
        ))}
        {selectedCoordinates.map((coord, index) => (
          <DraggablePopup
            key={`selected-${index}`}
            position={[coord.lat, coord.lng]}
            onDragEnd={handleDragEnd(index)}
            onDiscard={handleDiscard(index)}
            isSelectable
          />
        ))}
        {optimizedRoute.length > 1 && (
          <Polyline positions={optimizedRoute} color="blue" />
        )}
        <SetViewOnClick coords={[...coordinates, ...selectedCoordinates]} />
      </MapContainer>
      <RegisteredLocations
        coordinates={coordinates}
        onUpdateVehicleCount={handleUpdateVehicleCount}
        loadVehicleData={() => loadVehicleData(userId)}
        requiredVehicles={requiredVehicles}
      />
    </div>
  );
};

export default MakeRoute;
