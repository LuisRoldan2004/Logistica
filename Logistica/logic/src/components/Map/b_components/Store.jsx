import React from 'react';
import '../../Map/MapContent';
import MapComponent from '../MapContent';
import '../style/Map.css';

const Store = () => {
  return (
    <div className='store-container'>
        <h2>Registration of new wineries</h2>
        <p>Register new wineries for your routes</p>
      <MapComponent/>
    </div>
  );
};

export default Store;
