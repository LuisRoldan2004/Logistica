import React, { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const DraggablePopup = ({ position, onDragEnd, onDiscard, isSelectable }) => {
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (marker) {
      marker.on('dragend', (event) => {
        const { lat, lng } = event.target.getLatLng();
        console.log(`Marker dragged to: Lat: ${lat}, Lng: ${lng}`);
        onDragEnd({ lat, lng });
      });
    }
  }, [marker, onDragEnd]);

  return (
    <Marker position={position} draggable={true} ref={setMarker}>
      <Popup>
        <div>Drag me!</div>
        {isSelectable && (
          <Button variant="danger" onClick={onDiscard}>Discard</Button>
        )}
      </Popup>
    </Marker>
  );
};

export default DraggablePopup;
