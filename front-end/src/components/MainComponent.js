import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import '../style/MainComponent.css';
import New from '../Images/edit.png'

function MainComponent({ onSendToggle, onShowMap,user }) {

  const [inboxSent, setInboxSent] = useState("Inbox")
  const inbox = [["Lenny", "My Pigeon is superior to yours","25 Aug"],
  ["John", "My Pigeon is superior to yours","25 Aug"],
  ["Carmen", "My Pigeon is superior to yours","25 Aug"],]
  
  const sent = [["Lenny", "Wanna Have a pigeon off","Est. Delivery: 25 Aug, 2024"],
  ["John", "Wanna Have a pigeon off","Delivered: 25 Aug, 2024"],]

  const messages = inboxSent === 'Inbox' ? inbox : sent;

  const [inboxMessages, setInboxMessages] = useState({ sent_messages: [], received_messages: [] });

  useEffect(() => {
    fetch('https://otk78wgmid.execute-api.ap-southeast-2.amazonaws.com/develop/api/message?user=John+Doe')
      .then(response => response.json())
      .then(data => setInboxMessages(data))
      .then(console.log(inboxMessages.received_messages))
      .catch(error => console.error('Error fetching data:', error));
      console.log("working")
  }, []);

  return (
    <div id='mainComponantBox'>
      <NavBar onShowMap={onShowMap}/>
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
          <div id='mainComponentDisplay'>
            <div id='inboxSentTitle'>{inboxSent}</div>
            <div>
              {messages.map((message, index) => (
                <div key={index} className='receivedMail'>
                  <span className='senderName'>{message[0]}</span>
                  <span className='senderMessage'>{message[1]}</span>
                  <span className='senderDate'>{message[2]}</span>
                </div>
              ))}
              <h1>Sent Messages</h1>
                {inboxMessages.received_messages.map((msg, index) => (
                  <div key={index}>
                    <p>{msg.message}</p>
                    <p>{msg.sentDate}</p>
                  </div>
                ))}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;