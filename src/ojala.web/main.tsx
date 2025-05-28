import { StrictMode } from \'react\';
import { createRoot } from \'react-dom/client\';
import \'./index.css\';
import App from \'./App.tsx\';
import { AuthProvider } from \'./hooks/useAuth\'; // Import AuthProvider

createRoot(document.getElementById(\'root\')!).render(
  <StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>,
);

