import { HashRouter, Routes, Route } from 'react-router-dom';
import { AssetProvider } from './context/AssetContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { WTGs } from './pages/WTGs';
import { TrafostanicaPage } from './pages/Trafostanica';
import { DalekovodPage } from './pages/Dalekovod';
import { KabloviPage } from './pages/Kablovi';

export default function App() {
  return (
    <AssetProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="wtgs" element={<WTGs />} />
            <Route path="trafostanica" element={<TrafostanicaPage />} />
            <Route path="dalekovod" element={<DalekovodPage />} />
            <Route path="kablovi" element={<KabloviPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AssetProvider>
  );
}
