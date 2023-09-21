import LandingPage from './components/LandingPage'
import MainComponent from './components/MainComponent';
import SendMessage from './components/SendMessage'
import Map from './components/Map'
import { Amplify, Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import ChooseLocation from './components/chooseLocation';

Amplify.configure({
  Auth: {
    userPoolId: 'ap-southeast-2_aY3ivQQJg',
    userPoolWebClientId: '3au8dnfvreohe7kv90oio5gf77',

    oauth: {
      domain: 'pigeonpost-signin.auth.ap-southeast-2.amazoncognito.com',
      scope: ['email', 'openid', 'phone'],
      // redirectSignIn: 'https://pigeonpost.site/',
      // redirectSignOut: 'https://pigeonpost.site/',
      redirectSignIn: 'http://localhost:3001',
      redirectSignOut: 'http://localhost:3001',
      responseType: 'code', // or 'code'
      options: {
        AdvancedSecurityDataCollectionFlag: false
      },
      social: {
        google_client_id: '592781763319-fsli1i6q4sri0uilc6qfk4dso83veubg.apps.googleusercontent.com'
      }
    }
  },
});
const currentConfig = Auth.configure();

function App() {
  const [isSendVisible, setIsSentVisible] = useState(false)
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [userHasSignedUp, setUserHasSignedUp] = useState(true); // New state variable

  const [user, setUser] = useState(null)

  const signOut = () => {
    Auth.signOut()
      .then(() => {
        setUser(null);
      })
      .catch(err => {
        console.log("Error signing out: ", err);
      });
  };
  useEffect(() => {
    if (user) {
      // Run fetch request when user is logged in
      fetch('https://otk78wgmid.execute-api.ap-southeast-2.amazonaws.com/develop/api/user', {
        headers: {
          'Authorization': user.signInUserSession.idToken.jwtToken  // This is the ID token from Cognito
        }
      })
        .then(response => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 400) {
            throw new Error('User does not exist');
          } else {
            throw new Error('Unexpected HTTP status: ' + response.status);
          }
        })
        .then(data => {
          setUserHasSignedUp(data); // Assume data is a boolean (true or false)
        })
        .catch(error => {
          setUserHasSignedUp(false)
          console.error('Error fetching data:', error);
        });
    }
  }, [user]);

  // checks if user is logged in 
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        // console.log("Logged in...")
        setUser(user);
        // console.log(user)
        // console.log(user.signInUserSession.idToken.payload.email)
      })
      .catch(err => {
        console.log("No user signed in");
      });
  }, []);
  const userSignedUp= () => {
    setUserHasSignedUp(true)
  }
  const signInWithGoogle = () => {
    Amplify.configure(currentConfig);
    Auth.federatedSignIn({ provider: 'Google' });
  };
  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  return (
    <div className="App">
      {isMapVisible ? (
        // this is being removed
        <Map onCloseMap={toggleMapVisibility} />
      ) : user ? (
        userHasSignedUp === false ? (
          // Show another component if fetchResult is false
          <ChooseLocation onSignUpOK={userSignedUp} user={user}/>
        ) : isSendVisible ? (
          // User is sending messgae
          <SendMessage 
            onSendToggle={() => {
              setIsSentVisible(!isSendVisible)
            }} 
            onShowMap={toggleMapVisibility} 
            user={user}
          />
        ) : (
          // this is the 'home' screen
          <MainComponent 
            onSignOut={signOut}
            onSendToggle={() => setIsSentVisible(!isSendVisible)} 
            onShowMap={toggleMapVisibility} 
            user={user}
          />
        )
      ) : (
        <LandingPage onLoginSuccess={signInWithGoogle} onShowMap={toggleMapVisibility} />
      )}
    </div>
  );  
}

export default App;
