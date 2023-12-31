import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import '../style/MainComponent.css';
import New from '../Images/edit.png'
import Map from '../components/Map'
const isLandingPage = false

function MainComponent({ onSendToggle, onShowMap,user, onSignOut }) {

  const [inboxSent, setInboxSent] = useState("Inbox")
  const [inboxMessages, setInboxMessages] = useState({ sent_messages: [], received_messages: [] });
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedSentMessage, setSelectedSentMessage] = useState(null)

  const closeModal = () => {
    setShowMapModal(false);
    setSelectedMessageId(null);
  };

  const messageClick = (messageID) => {
    setSelectedSentMessage(inboxMessages.sent_messages.find(msg => msg.message_id === messageID));
    setShowMapModal(true);
  }
  
  // useEffect(() => {
  //   fetch('https://otk78wgmid.execute-api.ap-southeast-2.amazonaws.com/develop/api/message', {
  //     headers: {
  //       'Authorization': user.signInUserSession.idToken.jwtToken  // This is the ID token from Cognito
  //     }
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       setInboxMessages(data)
  //       // console.log("Data from the message api: " + data)
  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);
  useEffect(() => {
    fetch('https://otk78wgmid.execute-api.ap-southeast-2.amazonaws.com/develop/api/message', {
      headers: {
        'Authorization': user.signInUserSession.idToken.jwtToken  // This is the ID token from Cognito
      }
    })
    .then(response => {
      return response.text()  // Get the response body as text
        .then(text => {
          try {
            return JSON.parse(text);  // Try to parse it as JSON
          } catch (error) {
            return text;  // If not JSON, return as is
          }
        })
        .then(data => {
          console.log('Data from the message API:', data);  // Log the parsed data
          console.log("jwt: " + user.signInUserSession.idToken.jwtToken)
          if (response.ok) {  // If the response was successful, proceed
            setInboxMessages(data);
          } else {
            console.error('Error status:', response.status);
          }
        });
    })
    .catch(error => console.error('Network error:', error));
  }, []);
  useEffect(() => {
    if (showMapModal && new Date(selectedSentMessage.arrivalDate).getTime() === 0) {
      window.alert("Pigeon has just been sent, please check back in 5mins to see the route");
    }
  }, [showMapModal, selectedSentMessage]);
  
  function formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' }); // Gets the abbreviated month name
  
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) {
      suffix = 'st';
    } else if (day === 2 || day === 22) {
      suffix = 'nd';
    } else if (day === 3 || day === 23) {
      suffix = 'rd';
    }
  
    return `${day}${suffix} ${month}`;
  }
  
  return (
    <div id='mainComponantBox'>
      <NavBar onShowMap={onShowMap} onSignOut={onSignOut} isLandingPage={isLandingPage}/>
      <div id='mainComponantContainer'>
        <div>
          <h1>Welcome, <span id='userName'>{user.signInUserSession.idToken.payload.email}</span></h1>
        </div>
        <div id='inboxDiv'>
          <div id='mainComponentButtons'>
            <button onClick={onSendToggle} id='mainComponentNewButton'> <img src={New}></img>New</button>
            <button id='mainComponentInboxButton' 
              onClick={() => setInboxSent('Inbox')}
              className={inboxSent === 'Inbox' ? 'selectedButton' : ''}>
              Inbox
            </button>
            <button id='mainComponentSentButton' 
              onClick={() => setInboxSent('Sent')}
              className={inboxSent === 'Sent' ? 'selectedButton' : ''}>
              Sent
            </button>
          </div>
          <div>
            {/* {showMapModal && (new Date(selectedSentMessage.arrivalDate).getTime() != 0)(
              <div className="modal">
                <div className="modal-content">
                  <div className="close-button" onClick={closeModal}>close</div>
                  <Map message={selectedSentMessage} user={user}/>
                  
                </div>
              </div>
            )} */}
            {
            showMapModal && new Date(selectedSentMessage.arrivalDate).getTime() !== 0 ? (
              <div className="modal">
                <div className="modal-content">
                  <div className="close-button" onClick={closeModal}>close</div>
                  <Map message={selectedSentMessage} user={user}/>
                </div>
              </div>
            ) : null
          }

          </div>

          <div id='mainComponentDisplay'>
            <div id='inboxSentTitle'>{inboxSent}</div>
            <div>
              {inboxSent === 'Sent' ? (
                // Display sent messages
                inboxMessages.sent_messages.map((msg, index) => (
                  <>
                  <div key={msg.message_id} className='receivedMail' onClick={() => { 
                    messageClick(msg.message_id)
                    }}>
                    <span className='senderName'>{msg.receiverName}</span>
                    <span className='senderMessage'>{msg.message}</span>
                    <span className='senderDate'>{formatDate(msg.sentDate)}</span>
                  </div>
                  </>
                ))
              ) : (
                // Display received messages
                inboxMessages.received_messages.map((msg, index) => (
                  <div key={msg.message_id} className='receivedMail'>
                    <span className='senderName'>{msg.senderName}</span>
                    <span className='senderMessage'>{msg.message}</span>
                    <span className='senderDate'>{formatDate(msg.arrivalDate)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;