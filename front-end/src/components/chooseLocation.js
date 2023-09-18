import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../style/chooseLocation.css';
import Pigeon from '../Images/landingPagePigeon.png'
import L from 'leaflet';

const mapStyle = {
  width: '500px',
  height: '300px',
  position: 'absolute',
};

const ChooseLocation = ({ onSignUpOK, user }) => {
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const customIcon = new L.Icon({
    iconUrl: Pigeon,
    iconRetinaUrl: Pigeon,
    iconSize: [25, 41],  // size of the icon
    iconAnchor: [12.5, 41],  // point of the icon which will correspond to marker's location
    popupAnchor: [0, -41]  // point from which the popup should open relative to the iconAnchor
  });

  const LocationMarker = () => {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const formattedUserLocation = {
          location: {
            longitude: lng,
            latitude: lat
          }
        };
        setUserLocation(formattedUserLocation);
      },
    });
  
    return userLocation === null ? null : (
      <Marker 
        position={{ lat: userLocation.location.latitude, lng: userLocation.location.longitude }} 
        icon={customIcon}
      />
    );
  };
  
  const sendMessage = async () => {
    const payload = {
      location: userLocation,
    };
    if(userLocation == null){
        window.alert("Please Click Home Location On the Map")
        return
    }
    console.log(payload)

    // UNCOMMENT WHEN API POINT IS THERE. 
    try {
      const response = await fetch('https://otk78wgmid.execute-api.ap-southeast-2.amazonaws.com/develop/api/user', {
        method: 'POST',
        headers: {
          'Authorization': user.signInUserSession.idToken.jwtToken,  // This is the ID token from Cognito
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSignUpOK();
      } else {
        console.log('Failed to send message:', response);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    onSignUpOK()
  };

  return (
    <div className="modalSignUp">
      <div className="modalSignUp-content">
        <h1>Sign Up</h1>
        <div>Click your location on the map</div>
        <div>This is where all of your messages will be from</div>
        <div id="map">
          <MapContainer center={[0, 0]} zoom={1} style={mapStyle}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </div>
        <div className="modalSignUpclose-button" onClick={sendMessage}>
          enter
        </div>
      </div>
    </div>
  );
};

export default ChooseLocation;
