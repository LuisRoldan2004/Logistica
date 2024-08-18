import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './style/Map.css';
import { db } from '../MainPage/helpers/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const OPENCAGE_API_KEY = '31258b2763064daea63782eba31961f0';

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [map, position]);

  return null;
};

const DraggablePopup = ({ position, children, onDragEnd }) => {
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (popup) {
      popup.on('dragend', (event) => {
        const { lat, lng } = event.target.getLatLng();
        onDragEnd({ lat, lng });
      });
    }
  }, [popup, onDragEnd]);

  return (
    <Marker position={position} draggable={true} ref={setPopup}>
      <Popup>{children}</Popup>
    </Marker>
  );
};

const MapComponent = ({ onCoordinatesSubmit }) => {
  const [currentPosition, setCurrentPosition] = useState([51.505, -0.09]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting location:", error);
        setCurrentPosition([51.505, -0.09]);
      }
    );
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: searchQuery,
          key: OPENCAGE_API_KEY,
        },
      });

      const result = response.data.results[0];
      if (result) {
        const { lat, lng } = result.geometry;
        const name = result.formatted;
        const newCoordinates = { lat, lng, name };
        setSelectedCoordinates(newCoordinates); 
        setCurrentPosition([lat, lng]);
        setError(null);
      } else {
        setError('No results found');
      }
    } catch (err) {
      console.error('An error occurred:', err);
      setError('An error occurred');
    }
  };

  const handleDragEnd = ({ lat, lng }) => {
    const newPosition = { lat, lng, name: 'Dragged Position' };
    setSelectedCoordinates(newPosition);
  };

  const handleSelect = async (coordinates) => {
    const uid = auth.currentUser?.uid;
    try {
      await addDoc(collection(db, 'coordinates'), {
        lat: coordinates.lat,
        lng: coordinates.lng,
        userId: uid,
      });
      toast.success('Registered starting point!');
      setSelectedCoordinates(coordinates); // Set the coordinates again to ensure the popup remains
      if (onCoordinatesSubmit) onCoordinatesSubmit(coordinates); // Pass coordinates to parent
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleDiscard = () => {
    setSelectedCoordinates(null);
  };

  return (
    <div className='map-container'>
      <div className='search-container'>
        <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: '10px', display: 'flex' }}>
          <input
            type="text"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej. Av. Insurgentes Sur 1234, Colonia Del Valle, Benito Juárez, C.P. 03100, Ciudad de México, México"
            style={{ marginRight: '10px' }}
          />
          <button type="button" onClick={handleSearch}>Search</button>
        </form>
      </div>
      <MapContainer center={currentPosition} zoom={13} style={{ height: '100vh', flex: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <RecenterMap position={currentPosition} />
        {selectedCoordinates && (
          <DraggablePopup 
            position={[selectedCoordinates.lat, selectedCoordinates.lng]} 
            onDragEnd={handleDragEnd}
          >
            {selectedCoordinates.name} - Lat: {selectedCoordinates.lat}, Lng: {selectedCoordinates.lng}
          </DraggablePopup>
        )}
      </MapContainer>
      <div className='register-container'>
        <div style={{ marginTop: '20px' }}>
          {selectedCoordinates && !selectedCoordinates.submitted && (
            <>
              <h3>Results:</h3>
              <div className='out-search' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {selectedCoordinates.name ? `${selectedCoordinates.name} - ` : ''}Lat: {selectedCoordinates.lat}, Lng: {selectedCoordinates.lng}
                </div>
                <div>
                  <button className='btn btn-secondary' onClick={() => handleSelect(selectedCoordinates)}>Select and Submit</button>
                  <button className='btn btn-secondary' onClick={handleDiscard}>Discard</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />  
    </div>
  );
};

export default MapComponent;
