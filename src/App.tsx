import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Doing from './pages/Doing';
import Revisit from './pages/Revisit';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="bg-cream text-charcoal">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doing" element={<Doing />} />
          <Route path="/revisit" element={<Revisit />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;