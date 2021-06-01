import React from 'react';
import './App.css';
import firebase from "firebase"
import { firebaseConfig } from "./firebase-params";

firebase.initializeApp(firebaseConfig)

function App() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<firebase.User | null>(null);
  const [idToken, setIdToken] = React.useState<string>("");

  React.useEffect(() => {
    setIsLoading(true);
    firebase.auth().onAuthStateChanged(async (user: firebase.User | null) => {
      if (user) {
        // 引数はforceRefresh
        const idToken = await user.getIdToken(true)
        setIdToken(idToken)
      }
      console.log(user);
      setUser(user);
      setIsLoading(false);
    })
  }, [setUser])

  const handleClick = React.useCallback(() => {
    const login = async () => {
      setIsLoading(true);
      const provider = new firebase.auth.GoogleAuthProvider()
      await firebase.auth().signInWithRedirect(provider);
      setIsLoading(false);
    }
    login();
  }, [setIsLoading]);

  return (
    <div className="App">
      <header className="App-header">
        {isLoading ? (
          <p>Loading...</p>
        ) : user !== null ? (
          <dl>
            <dt>user.email</dt>
            <dd>{user.email}</dd>
            <dt>idToke</dt>
            <dd>{idToken}</dd>
          </dl>
        ) : (
          <button onClick={handleClick}>ログイン</button>
        )}
      </header>
    </div>
  );
}

export default App;
