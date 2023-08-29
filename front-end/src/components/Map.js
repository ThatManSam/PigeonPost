import React from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Don't forget to import leaflet's CSS
import '../style/Map.css'
import L from 'leaflet';  // Import Leaflet library
import Pigeon from '../Images/landingPagePigeon.png'


// Optional: You could place these styles in a CSS file
const mapStyle = {
  width: '100vw',
  height: '100vh',
  position: 'absolute'
};
const generateRandomPoints = (numPoints) => {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const latitude = Math.random() * 180 - 90; // Latitude between -90 and 90
      const longitude = Math.random() * 360 - 180; // Longitude between -180 and 180
      points.push([latitude, longitude]);
    }
    return points;
  };
  
  const randomPoints = generateRandomPoints(100);
  
const MapComponent = ({onCloseMap}) => {
    const customIcon = new L.Icon({
        iconUrl: Pigeon,
        iconRetinaUrl: Pigeon,
        iconSize: [25, 41],  // size of the icon
        iconAnchor: [12.5, 41],  // point of the icon which will correspond to marker's location
        popupAnchor: [0, -41]  // point from which the popup should open relative to the iconAnchor
      });
    
  return (
    <div id='mapContainer'>
        <MapContainer
        center={[0, 0]}
        zoom={2}
        style={mapStyle}
        >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {randomPoints.map((point, index) => (
          <Marker key={index} position={point} icon={customIcon} />
        ))}
        </MapContainer>
        <div >
            <button onClick={onCloseMap} id="mapBackButton" >Back</button>
        </div>

    </div>
  );
};

export default MapComponent;