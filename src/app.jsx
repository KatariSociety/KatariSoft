import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SensorsDataProvider } from './context/SensorsData';

// Components
import Sidebar from "./components/common/Sidebar";

// Pages
import HomePage from "./pages/HomePage";
import RealTimePage from "./pages/RealTimePage";
import HistoricalPage from "./pages/HistoricalPage";
import UsersPage from "./pages/UsersPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from './pages/LoginPage';

function App() {
  const isGitHubPages = window.location.hostname.includes('github.io');
  const basePath = isGitHubPages ? '/katarisoft' : '';

  return (
    <SensorsDataProvider>
      <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
        <div className='fixed inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
          <div className='absolute inset-0 backdrop-blur-sm' />
        </div>

        <Sidebar basePath={basePath} />
        <Routes>
          <Route path={`${basePath}/*`} element={<HomePage />} />
          <Route path={`${basePath}/realtime`} element={<RealTimePage />} />
          <Route path={`${basePath}/historical`} element={<HistoricalPage />} />
          <Route path={`${basePath}/users`} element={<UsersPage />} />
          <Route path={`${basePath}/dashboard`} element={<DashboardPage />} />
          <Route path={`${basePath}/settings`} element={<SettingsPage />} />
          <Route path={`${basePath}/login`} element={<LoginPage />} />
        </Routes>
      </div>
    </SensorsDataProvider>
  );
}

export default App;