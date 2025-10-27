import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import CertificateCenter from './pages/CertificateCenter';
import TreatmentPlans from './pages/TreatmentPlans';
import AuditLog from './pages/AuditLog';
import RoleManagement from './pages/RoleManagement';
import Settings from './pages/Settings';
import NotificationCenter from './components/notifications/NotificationCenter';

const App = () => (
  <AppShell>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/certificates" element={<CertificateCenter />} />
      <Route path="/treatment-plans" element={<TreatmentPlans />} />
      <Route path="/audit-log" element={<AuditLog />} />
      <Route path="/role-management" element={<RoleManagement />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    <NotificationCenter />
  </AppShell>
);

export default App;
