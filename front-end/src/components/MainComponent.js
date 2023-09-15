import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import '../style/MainComponent.css';
import New from '../Images/edit.png'
import Map from '../components/Map'

function MainComponent({ onSendToggle, onShowMap,user }) {

  const [inboxSent, setInboxSent] = useState("Inbox")
  // const inbox = [["Lenny", "My Pigeon is superior to yours","25 Aug"],
  // ["John", "My Pigeon is superior to yours","25 Aug"],
  // ["Carmen", "My Pigeon is superior to yours","25 Aug"],]
  
  // const sent = [["Lenny", "Wanna Have a pigeon off","Est. Delivery: 25 Aug, 2024"],
  // ["John", "Wanna Have a pigeon off","Delivered: 25 Aug, 2024"],]

  // const messages = inboxSent === 'Inbox' ? inbox : sent;

  const [inboxMessages, setInboxMessages] = useState({ sent_messages: [], received_messages: [] });
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    fetch('https://otk78wgmid.execute-api.ap-southeast-2.amazonaws.com/develop/api/message?user=John+Doe')
      .then(response => response.json())
      .then(data => setInboxMessages(data))
      .then(console.log(inboxMessages.received_messages))
      .catch(error => console.error('Error fetching data:', error));
      console.log("working")
  }, []);

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
              {inboxSent === 'Sent' ? (
                // Display sent messages
                inboxMessages.sent_messages.map((msg, index) => (
                  <>
                  <div key={msg.message_id} className='receivedMail' onClick={() => setSelectedMessageId(msg.message_id)}>
                    <span className='senderName'>{msg.receiverName}</span>
                    <span className='senderMessage'>{msg.message}</span>
                    <span className='senderDate'>{formatDate(msg.sentDate)}</span>
                  </div>
                  {selectedMessageId === msg.message_id && <Map message_id={selectedMessageId} />}

                  </>
                ))
              ) : (
                // Display received messages
                inboxMessages.received_messages.map((msg, index) => (
                  <div key={msg.message_id} className='receivedMail'>
                    <span className='senderName'>{msg.senderName}</span>
                    <span className='senderMessage'>{msg.message}</span>
                    <span className='senderDate'>{formatDate(msg.sentDate)}</span>
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