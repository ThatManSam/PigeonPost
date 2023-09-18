import { Amplify, Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';

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
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log("Logged in...")
        setUser(user);
        console.log(user.signInUserSession.idToken.payload.email)
      })
      .catch(err => {
        console.log("No user signed in");
      });
  }, []); 

  const signInWithGoogle = () => {
    Amplify.configure(currentConfig);
    Auth.federatedSignIn({ provider: 'Google' });
  };

  return (
    <>
      <h1>Hello {user ? user.signInUserSession.idToken.payload.email : 'Guest'}</h1>
      {user ? (
        <button onClick={signOut}>Sign out</button>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </>
  );
}

export default App;