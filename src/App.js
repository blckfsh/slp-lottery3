import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

import './App.css'
import Main from './containers/main'
import Config from './containers/config'

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </Router>   
  );
}

export default App;
