import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Doing from './pages/Doing';
import Revisit from './pages/Revisit';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import CapturePlusButton from './components/CapturePlusButton';

// import.meta.env.BASE_URL reflects the Vite `base` config — "/" by
// default, "/loopr/" when built for GitHub Pages. Strip the trailing
// slash for React Router's basename prop.
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <Router basename={routerBase || undefined}>
      <div className="bg-paper-shell text-charcoal">
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doing" element={<Doing />} />
          <Route path="/delayed" element={<Revisit />} />
          <Route path="/done" element={<Archive />} />
          <Route path="/dials" element={<Settings />} />

          {/* Legacy route redirects (pre-Sprint 12). Kept for PWA caches and
              any bookmarks pointing at the old paths. */}
          <Route
            path="/revisit"
            element={<Navigate to="/delayed" replace />}
          />
          <Route
            path="/archive"
            element={<Navigate to="/done" replace />}
          />
          <Route
            path="/settings"
            element={<Navigate to="/dials" replace />}
          />
        </Routes>
        <CapturePlusButton />
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
