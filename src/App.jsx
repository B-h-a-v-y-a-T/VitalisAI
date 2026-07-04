import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DatasetProvider } from './context/DatasetContext';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
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
import RecruiterView from './pages/app/RecruiterView';
import FeasibilityEstimator from './pages/app/FeasibilityEstimator';

export default function App() {
  return (
    <ThemeProvider>
      <DatasetProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

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
              <Route path="recruiter" element={<RecruiterView />} />
              <Route path="feasibility" element={<FeasibilityEstimator />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </DatasetProvider>
    </ThemeProvider>
  );
}
