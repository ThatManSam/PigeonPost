import React, { useState } from 'react';
import NavBar from './NavBar';
import '../style/SendMessage.css';
import BirdImage from '../Images/landingPagePigeon.png'

function SendMessage({ onSendToggle,onShowMap, user }) {
    // const [hasChosenBird, setHasChosenBird] = useState(false)
    // const [selectedBird, setSelectedBird] = useState(null); 
    // const handleBirdClick = (birdName) => {
    //     setSelectedBird(birdName); 
    //   };
    const [receiverName, setReceiverName] = useState('');
    const [message, setMessage] = useState('');

    const sendRequest = () => {
      if (receiverName === "" || message === "") {
        window.alert("Please enter a recipient and a message");
        return;
      }
      // fetch('https://otk78wgmid.execute-api.ap-southeast-2.amazonaws.com/develop/api/message', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': user.signInUserSession.idToken.jwtToken  // This is the ID token from Cognito
      //   },
      //   body: JSON.stringify({
      //     // senderName: user.signInUserSession.idToken.payload.email,
      //     receiverName: receiverName,
      //     message: message
      //   })
      // })
      // .then(response => {
      //   if (response.status === 400) {
      //     window.alert('Bad request, could not send message.');
      //     throw new Error('Bad request');  // This will skip the following 'then' and go straight to 'catch'
      //   }
      //   return response.json();
      // })
      // .then(data => {
      //   console.log('Success:', data);
      //   window.alert("Message Sent!");
      //   onSendToggle();
      // })
      // .catch((error) => {
      //   console.error('Error:', error);
      //   // Note: If you throw an error in the above 'then', it will be caught here
      // });
      fetch('https://otk78wgmid.execute-api.ap-southeast-2.amazonaws.com/develop/api/message', {
        method: 'POST',
        headers: {
          'Authorization': user.signInUserSession.idToken.jwtToken  // This is the ID token from Cognito
        },
        body: JSON.stringify({
          // senderName: user.signInUserSession.idToken.payload.email,
          receiverName: receiverName,
          message: message
        })
      })
      .then(response => {
        return response.text()  // Use text() instead of json() to handle all kinds of responses
      })
      .then(text => {
        try {
          // Try parsing it as JSON
          const data = JSON.parse(text);
          console.log('Response Body:', data);
      
          // Check for the specific message "Recipient does not exist"
          if (data === 'Recipient does not exist') {
            window.alert('Recipient does not exist. Please check the recipient email.');
            // Return the user to a specific location or state
            // Example: window.location.href = '/some-page';
            return;
          }
      
          if (data.status === 400) {
            window.alert('Bad request, could not send message.');
            throw new Error('Bad request');  // This will skip the following 'then' and go straight to 'catch'
          }
      
          console.log('Success:', data);
          window.alert("Message Sent!");
          onSendToggle();
        } catch (error) {
          // If parsing fails, it should still print the original text response
          console.log('Response Body:', text);
          throw new Error('Failed to parse JSON');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // Note: If you throw an error in the above 'then', it will be caught here
      });
                  
    };
        
  return (
    <div id='SendMessageBox'>
        <NavBar onShowMap={onShowMap} />
        <div id='SendMessageContainer'>
        {/* {
            hasChosenBird ? */}
            <div id='writeMessageDiv'>
                <h1>Send Message</h1>
                <input id='enterReceiverEmail'
                placeholder='Enter Email...'
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}/>
                <textarea id='enterMessage'
                placeholder='Enter Message...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}/>
                <div id='infoAndSendDiv'>
                    {/* <span id='estDeliveryWithSelectedBird'>Est. Delv. with {selectedBird}: </span>
                    <span>March, 2025</span> */}
                    <button onClick={onSendToggle} id='backToSelectBirds'>Back</button>
                    <button onClick={sendRequest} id='sendTheMessage'>Send</button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default SendMessage;

// const birdsData = [
//   {
//     name: "Birdus Fastust1",
//     speed: 100,
//     antibiotics: 87,
//     stamina: 54,
//     airStrike: "3%"
//   },
//   {
//       name: "Birdus Fastust2",
//       speed: 100,
//       antibiotics: 87,
//       stamina: 54,
//       airStrike: "3%"
//     },
//     {
//       name: "Birdus Fastust3",
//       speed: 100,
//       antibiotics: 87,
//       stamina: 54,
//       airStrike: "3%"
//     },
//     {
//       name: "Birdus Fastust4",
//       speed: 100,
//       antibiotics: 87,
//       stamina: 54,
//       airStrike: "3%"
//     },
//     {
//       name: "Birdus Fastust5",
//       speed: 100,
//       antibiotics: 87,
//       stamina: 54,
//       airStrike: "3%"
//     },        
// ];


            {/* :
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
        } */}
