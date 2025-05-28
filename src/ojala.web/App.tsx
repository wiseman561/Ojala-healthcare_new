import { BrowserRouter as Router, Routes, Route } from \'react-router-dom\';
import MainLayout from \'@/layouts/MainLayout\";
import DashboardPage from \'@/pages/DashboardPage\";
import PatientsPage from \'@/pages/PatientsPage\";
import AnalyticsPage from \'@/pages/AnalyticsPage\";
import PrescriptionsPage from \'@/pages/PrescriptionsPage\";
// Import other pages like SettingsPage when created

// Import global styles if not already in main.tsx
import \'./App.css\"; // Keep or replace with index.css if preferred

function App() {
  return (
    <Router>
      <Routes>
        <Route path=\"/\" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path=\"patients\" element={<PatientsPage />} />
          <Route path=\"analytics\" element={<AnalyticsPage />} />
          <Route path=\"prescriptions\" element={<PrescriptionsPage />} />
          {/* <Route path=\"settings\" element={<SettingsPage />} /> */}
          {/* Add other nested routes here */}
        </Route>
        {/* Add routes outside the main layout if needed (e.g., Login) */}
        {/* <Route path=\"/login\" element={<LoginPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

