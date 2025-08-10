import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import BusinessCapabilities from '@/pages/BusinessCapabilities';
import ApplicationArchitecture from '@/pages/ApplicationArchitecture';
import TechnologyArchitecture from '@/pages/TechnologyArchitecture';
import InfrastructureArchitecture from '@/pages/InfrastructureArchitecture';
import Visualizations from '@/pages/Visualizations';
import ICSLevels from '@/pages/ICSLevels';
import ICSSettings from '@/pages/ICSSettings';
import RelationsMatrix from '@/pages/RelationsMatrix';
import SecurityArchitecture from '@/pages/SecurityArchitecture';
import AdminPanel from '@/pages/AdminPanel';
import DataArchitecture from '@/pages/DataArchitecture';
import NetworkArchitecture from '@/pages/NetworkArchitecture';
import Reports from '@/pages/Reports';
import Login from '@/pages/Login';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ScenarioPlanning from '@/pages/ScenarioPlanning';
import ArchitecturalDecisionLog from '@/pages/ArchitecturalDecisionLog';
import ExecutiveDashboard from '@/pages/ExecutiveDashboard';
import Integrations from '@/pages/Integrations';
import Collaboration from '@/pages/Collaboration';
import Customization from '@/pages/Customization';
import { initializeDefaultData } from '@/services/dataService';
import { PageStateProvider } from '@/contexts/PageStateContext';

initializeDefaultData();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route 
        path="/*"
        element={
          isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/business" element={<BusinessCapabilities />} />
                <Route path="/applications" element={<ApplicationArchitecture />} />
                <Route path="/technology" element={<TechnologyArchitecture />} />
                <Route path="/infrastructure" element={<InfrastructureArchitecture />} />
                <Route path="/visualizations" element={<Visualizations />} />
                <Route path="/network" element={<NetworkArchitecture />} />
                <Route path="/data-architecture" element={<DataArchitecture />} />
                <Route path="/security" element={<SecurityArchitecture />} />
                <Route path="/ics" element={<ICSLevels />} />
                <Route path="/ics-settings" element={<ICSSettings />} />
                <Route path="/relations" element={<RelationsMatrix />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/scenarios" element={<ScenarioPlanning />} />
                <Route path="/decisions" element={<ArchitecturalDecisionLog />} />
                <Route path="/executive" element={<ExecutiveDashboard />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/customization" element={<Customization />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <>
      <Helmet>
        <title>KIPIC Enterprise Architecture Platform</title>
        <meta name="description" content="Real-time, data-driven EA platform providing a single source of truth for all architectural domains" />
      </Helmet>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <PageStateProvider>
              <DataProvider>
                <AppRoutes />
              </DataProvider>
            </PageStateProvider>
          </AuthProvider>
        </Router>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;