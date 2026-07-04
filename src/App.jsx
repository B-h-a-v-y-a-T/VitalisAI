import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import AppLayout from './pages/AppLayout';
import Dashboard from './pages/app/Dashboard';
import DatasetUpload from './pages/app/DatasetUpload';
import DatasetRegistry from './pages/app/DatasetRegistry';
import MatchingEngine from './pages/app/MatchingEngine';
import ClinicalTrials from './pages/app/ClinicalTrials';
import Results from './pages/app/Results';
import PlaintextVsEncrypted from './pages/app/PlaintextVsEncrypted';
import AuditLogs from './pages/app/AuditLogs';
import AccessControl from './pages/app/AccessControl';
import SettingsPage from './pages/app/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Application */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<DatasetUpload />} />
            <Route path="registry" element={<DatasetRegistry />} />
            <Route path="matching" element={<MatchingEngine />} />
            <Route path="trials" element={<ClinicalTrials />} />
            <Route path="results" element={<Results />} />
            <Route path="demo" element={<PlaintextVsEncrypted />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="access" element={<AccessControl />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
