import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import config from './firebase.config';
import Topics from './Topics';

class App extends Component {
  constructor(){
    super();
    this.app = firebase.initializeApp(config);
  }

  state = {
    topics: []
  }

  render() {
    return (
      <div className="App">
        <h1>Tech Talks Topics</h1>
        <Topics />
      </div>
    );
  }
}

export default App;
