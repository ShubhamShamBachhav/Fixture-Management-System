import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FixtureList from './components/FixtureList';
import FixtureForm from './components/FixtureForm';
import FixtureDetails from './components/FixtureDetails';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<FixtureList />} />
          <Route path="/add" element={<FixtureForm />} />
          <Route path="/edit/:id" element={<FixtureForm editMode />} />
          <Route path="/fixture/:id" element={<FixtureDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
