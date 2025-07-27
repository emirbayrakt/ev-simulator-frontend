import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/layout/Layout';
import SimulationsPage from './pages/SimulationsPage';
import SimulationViewPage from './pages/SimulationViewPage';
import CreateSimulationPage from './pages/CreateSimulationPage';
import QuickTestSimPage from './pages/QuickTestSimPage';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/simulations" />} />
        <Route path="/simulations/new" element={<CreateSimulationPage />} />
        <Route path="/simulations" element={<SimulationsPage />} />
        <Route path="/simulations/:id" element={<SimulationViewPage />} />
        <Route path="/quick-test" element={<QuickTestSimPage />} />
      </Route>
    </Routes>
  );
};

export default App;
