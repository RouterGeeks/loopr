import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Revisit from './pages/Revisit';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream text-charcoal">
        <main className="pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/revisit" element={<Revisit />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;