import React, { Component } from 'react';

import Login from './Login';
import Profile from './Profile';

const LS_KEY = 'mm-login-demo:auth';

class Main extends Component {

  constructor(props) {
    super(props);
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handleLoggedOut = this.handleLoggedOut.bind(this);
  }

  componentWillMount() {
    // Access token is stored in localstorage
    const auth = JSON.parse(localStorage.getItem(LS_KEY));
    this.setState({
      auth
    });
  }

  handleLoggedIn(auth) {
    console.log("This is the handle logged in auth", auth);
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    this.setState({ auth });
    console.log("This is the new state", this.state);
  }

  handleLoggedOut() {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: undefined });
  }

  render() {
    const { auth } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the mothafuckin' Rage Cloud</h1>
        </header>
        <div className="App-intro">
          {auth ? (
            <Profile auth={auth} onLoggedOut={this.handleLoggedOut} />
          ) : (
            <Login onLoggedIn={this.handleLoggedIn} />
          )}
        </div>
      </div>
    );
  }
}

export default Main;
