import React from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { Header } from 'semantic-ui-react';

function App() {
  return (
    <div> 
      <Header as='h2' icon='plug' content='Uptime Guarantee' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
    </div>
  );
}

export default App;
