import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../style/Map.css';
import L from 'leaflet';
import Pigeon from '../Images/landingPagePigeon.png'

const mapStyle = {
  width: '500px',
  height: '300px',
  position: 'absolute'
};

// const generateRandomPoints = (numPoints) => {
//   var latlngs = [];
//   for (var i = 0; i < 4; i++) {
//     var lat = -43 + (Math.random() - 0.5) * 20;
//     var lng = 172 + (Math.random() - 0.5) * 20;
//     latlngs.push([lat, lng]);
//   }
//   return latlngs;
// };

// const randomPoints = generateRandomPoints(100);

const MapComponent = ({ onCloseMap }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [points, setPoints] = useState([[0, 0]]);

  const customIcon = new L.Icon({
    iconUrl: Pigeon,
    iconRetinaUrl: Pigeon,
    iconSize: [25, 41],  // size of the icon
    iconAnchor: [12.5, 41],  // point of the icon which will correspond to marker's location
    popupAnchor: [0, -41]  // point from which the popup should open relative to the iconAnchor
  });

  useEffect(() => {
    fetch('https://otk78wgmid.execute-api.ap-southeast-2.amazonaws.com/develop/api/message/81ff659df2e15226bffe29a517e20cc951d98b47cb342b1f183da0493d33901c/location')
    .then(response => response.json())
    .then(data => {
      const transformedPoints = data.map(point => [point.latitude, point.longitude]);
      setPoints(transformedPoints);
        console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  }, []);
  useEffect(() => {
    if (points) {
      drawPoints();
    }
  }, [points]);
  
  const drawPoints = () => {
    const startTime = new Date('2023-09-16T10:00:12').getTime();
    const arrivalTime = new Date('2023-09-16T10:30:12').getTime();
    const currentTime = new Date().getTime();
  
    const journeyDuration = arrivalTime - startTime;
    const timeElapsed = currentTime - startTime;
  
    const percentageCompleted = Math.min(timeElapsed / journeyDuration, 1);
  
    const totalPoints = points.length;
    const pointIndex = Math.floor(percentageCompleted * (totalPoints - 1));
    const nextPointIndex = Math.min(pointIndex + 1, totalPoints - 1);  // Ensure it's within bounds
  
    const startPoint = points[pointIndex];
    const endPoint = points[nextPointIndex];
  
    if (startPoint && endPoint) {  // Check if startPoint and endPoint are defined
      const fraction = (percentageCompleted * (totalPoints - 1)) - pointIndex;
  
      const interpolatedLat = startPoint[0] + fraction * (endPoint[0] - startPoint[0]);
      const interpolatedLng = startPoint[1] + fraction * (endPoint[1] - startPoint[1]);
  
      setCurrentPosition([interpolatedLat, interpolatedLng]);
    }
  }

  return (
    <div id='mapContainer'>
      <MapContainer center={points[0]} zoom={1} style={mapStyle}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={points} color='blue' />
        {currentPosition && <Marker position={currentPosition} icon={customIcon} />}
      </MapContainer>
      <div>
        {/* <button onClick={onCloseMap} id="mapBackButton">Back</button> */}
      </div>
    </div>
  );
};

export default MapComponent;
