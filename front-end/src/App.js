import LandingPage from './components/LandingPage'
import MainComponent from './components/MainComponent';
import SendMessage from './components/SendMessage'
import Map from './components/Map'
import React, { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSendVisible, setIsSentVisible] = useState(false)
  const [isMapVisible, setIsMapVisible] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  return (
    <div className="App">
      {isMapVisible ? (
        <Map onCloseMap={toggleMapVisibility} />
      ) : isLoggedIn ? (
        isSendVisible ? (
          <SendMessage 
            onSendToggle={() => setIsSentVisible(!isSendVisible)} 
            onShowMap={toggleMapVisibility} 
          />
        ) : (
          <MainComponent 
            onSendToggle={() => setIsSentVisible(!isSendVisible)} 
            onShowMap={toggleMapVisibility} 
          />
        )
      ) : (
        <LandingPage onLoginSuccess={handleLoginSuccess} onShowMap={toggleMapVisibility} />
      )}
    </div>
  );
}

export default App;
  