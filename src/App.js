import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    }
    this.stateKey = 'spotify_auth_state';
    this.spotifyParams = this.getHashParams();
    this.access_token = this.spotifyParams.access_token;
    this.spotifyState = this.spotifyParams.spotifyState;
    this.storedState = localStorage.getItem(this.stateKey);
  }
  beginAuth() {
    if (this.access_token && (this.spotifyState == null || this.spotifyState !== this.storedState)) {
      alert('There was an error during the authentication');
    } else {
      localStorage.removeItem(this.stateKey);
      if (this.access_token) {
        fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': 'Bearer ' + this.access_token
          },
        })
        .then( response => {
          response.json()
        })
        .then( data => {
          console.log(data)
        })
        .catch( error => console.log("oops, looks like we got an error: ", error))
      }
      this.logIn()
    }
  }
  logIn = () => {
    const client_id = '279710054a5e456ca6a80d4561e56868';
    const redirect_uri = 'http://localhost:3000/callback';
    const spotifyState = this.generateRandomString(16);
    localStorage.setItem(this.stateKey, spotifyState);
    const scope = 'user-read-private user-read-email';
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(spotifyState);
    window.location = url;
  }
  generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  getHashParams() {
    // const href = window.location.href;
    // const pars = href.split('?')[1];
    // // Be sure url params exist
    // // if (params && params !== '') {
    //     const result = pars.split('&').reduce(function (res, item) {
    //         const parts = item.split('=');
    //         res[parts[0]] = parts[1];
    //         return res;
    //     }, {});
    // }
    // let hashParams = {};
    // let e, r = /([^&;=]+)=?([^&;]*)/g,
    //     q = window.location.hash.substring(1);
    // while (!!(e === r.exec(q))) {
    //    hashParams[e[1]] = decodeURIComponent(e[2]);
    // }
    // console.log(hashParams)
    // return hashParams;
  }
  render() {
    const isLoggedIn = this.state.isLoggedIn;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          { isLoggedIn ? (
            <div>
              <div>You are logged in</div>
            </div>
          ) : (
            <div>
              <p>
                Log in to your Spotify account to listen to songs!
              </p>
              <div
                className="App-link"
                onClick={this.beginAuth}
              >
                Log in
              </div>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
