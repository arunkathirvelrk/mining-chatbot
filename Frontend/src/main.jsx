import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from "@react-oauth/google";
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="951070685427-ehge6h9jcd085fqca4rijc7b3crvvb5o.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);