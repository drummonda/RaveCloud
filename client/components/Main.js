import React, { Component } from 'react';

import Login from './Login';
import VenueProfile from './VenueProfile';
import UserProfile from './UserProfile';

const LS_KEY = 'mm-login-demo:auth';

class Main extends Component {

  constructor(props) {
    super(props);
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handleLoggedOut = this.handleLoggedOut.bind(this);
    this.handleSetUser = this.handleSetUser.bind(this);
  }

  componentWillMount() {
    // Access token is stored in localstorage
    const auth = JSON.parse(localStorage.getItem(LS_KEY));
    const userType = localStorage.getItem('user');

    this.setState({
      auth,
      userType
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

  handleSetUser(userType) {
    this.setState({
      userType,
    });
  }

  render() {
    const { auth, userType } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the mothafuckin' ~Rave Cloud~</h1>
        </header>
        <div className="App-intro">
          {auth ? (
            userType === "User" ?
              <UserProfile auth={auth} onLoggedOut={this.handleLoggedOut} />
              :
              <VenueProfile auth={auth} onLoggedOut={this.handleLoggedOut} />
          ) : (
            <div>
              <p className="login-prompt">
              Let's get this party started!
              <br/>
              Install MetaMask if you haven't already, and you can use it to create and account and/or login
              </p>
              <Login
                onLoggedIn={this.handleLoggedIn}
                setUser={this.handleSetUser}
                userType="Venue"
              />

              <Login
                onLoggedIn={this.handleLoggedIn}
                setUser={this.handleSetUser}
                userType="User"
              />
            </div>

          )}
        </div>
      </div>
    );
  }
}

export default Main;
