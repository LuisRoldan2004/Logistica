// src/components/LocationRegister.js
import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OPENCAGE_API_KEY = '31258b2763064daea63782eba31961f0';

const LocationRegister = ({ onAddLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

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
        onAddLocation({ lat, lng, name });
        setError(null);
      } else {
        setError('No results found');
      }
    } catch (err) {
      console.error('An error occurred:', err);
      setError('An error occurred');
    }
  };

  return (
    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000, display: 'flex', gap: '10px' }}>
      <Form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Form.Control
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location"
          style={{ width: '250px' }}
        />
        <Button onClick={handleSearch}>Search</Button>
        {error && <Alert variant="danger" style={{ margin: '0' }}>{error}</Alert>}
      </Form>
      <ToastContainer />
    </div>
  );
};

export default LocationRegister;
