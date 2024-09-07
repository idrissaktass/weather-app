import './App.css';
import React from 'react';
import { Grid2 } from '@mui/material';
import MainScreen from './components/MainScreen';
import Navbar from './components/Navbar';

function App() {

  return (
    <div className="App">
      <Navbar/>
      <Grid2>
        <Grid2>
          <MainScreen/>
        </Grid2>
      </Grid2>
    </div>
  );
}

export default App;
