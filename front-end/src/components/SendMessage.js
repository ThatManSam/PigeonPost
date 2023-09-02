import React, { useState } from 'react';
import NavBar from './NavBar';
import '../style/SendMessage.css';
import BirdImage from '../Images/landingPagePigeon.png'
function SendMessage({ onSendToggle,onShowMap }) {
    const [hasChosenBird, setHasChosenBird] = useState(false)
    const [selectedBird, setSelectedBird] = useState(null); 
    const handleBirdClick = (birdName) => {
        setSelectedBird(birdName); 
      };
    
    const birdsData = [
        {
          name: "Birdus Fastust1",
          speed: 100,
          antibiotics: 87,
          stamina: 54,
          airStrike: "3%"
        },
        {
            name: "Birdus Fastust2",
            speed: 100,
            antibiotics: 87,
            stamina: 54,
            airStrike: "3%"
          },
          {
            name: "Birdus Fastust3",
            speed: 100,
            antibiotics: 87,
            stamina: 54,
            airStrike: "3%"
          },
          {
            name: "Birdus Fastust4",
            speed: 100,
            antibiotics: 87,
            stamina: 54,
            airStrike: "3%"
          },
          {
            name: "Birdus Fastust5",
            speed: 100,
            antibiotics: 87,
            stamina: 54,
            airStrike: "3%"
          },        
      ];
    
  return (
    <div id='SendMessageBox'>
        <NavBar onShowMap={onShowMap}/>
        <div id='SendMessageContainer'>
        {
            hasChosenBird ?
            <div id='writeMessageDiv'>
                <h1>Send Message</h1>
                <input id='enterReceiverEmail'
                placeholder='Enter Email...'/>
                <textarea id='enterMessage'
                placeholder='Enter Message...'/>
                <div id='infoAndSendDiv'>
                    <span id='estDeliveryWithSelectedBird'>Est. Delv. with {selectedBird}: </span>
                    <span>March, 2025</span>
                    <button onClick={() => setHasChosenBird(false)} id='backToSelectBirds'>Back</button>
                    <button onClick={onSendToggle} id='sendTheMessage'>Send</button>
                </div>
            </div>
            :
            <div id='ChooseYourBird'>
                <h1>Choose Your Bird</h1>
                <div id="birdBox" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {birdsData.map((bird, index) => (
                        <div key={index} style={{ textAlign: 'center' }}>
                            <div id='birdHeadshot' 
                            style={{
                                backgroundColor: selectedBird === bird.name ? '#1D1B26' : 'transparent'
                              }}
                            onClick={() => handleBirdClick(bird.name)}
                            ><img src={BirdImage} alt="bird" /></div>
                            <div id='birdName'>{bird.name}</div>
                            <div id='birdStats'>
                                <div id='Performance'>Performance</div>
                                <div id='speedStat'>Speed: {bird.speed}</div>
                                <div>Antibiotics: {bird.antibiotics}</div>
                                <div>Stamina: {bird.stamina}</div>
                                <div>Chance of Air Strike: {bird.airStrike}</div>
                            </div>
                        </div>
                    ))}
                    </div>
                <button onClick={onSendToggle} id='backToInbox'>Back</button>
                <button disabled={selectedBird === null} id="HasChosenBird"onClick={() => setHasChosenBird(true)}>
                    Next
                </button>
            </div>
        }
        </div>
    </div>
  );
}

export default SendMessage;