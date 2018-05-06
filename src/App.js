import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    let s =       <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          DIS APP MY BRO.
        </p>
      </div>

    return (
    <div>
    {s}
      <Button bsSize="large"> Hello press me </Button>
      <table className="table">
        <thead> 
          <tr>
            <th> This is a table header </th>
          </tr>
        </thead>
        <tr> 
          <td>This is a table cell</td>
        </tr>
      </table>
      </div>
    );
  }
}

export default App;
