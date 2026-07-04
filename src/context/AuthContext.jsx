import { createContext, useContext, useState, useEffect } from 'react';
import { verifySync } from 'otplib';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check mock authentication state
    const authStatus = sessionStorage.getItem('is_authenticated') === 'true';
    setIsAuthenticated(authStatus);

    const enabled = localStorage.getItem('2fa_enabled') === 'true';
    setIs2FAEnabled(enabled);
    
    if (!enabled) {
      setIs2FAVerified(true);
    } else {
      const verified = sessionStorage.getItem('2fa_verified') === 'true';
      setIs2FAVerified(verified);
    }
    
    setIsLoading(false);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('is_authenticated', 'true');
    
    // Force 2FA verification upon every new login if 2FA is enabled
    if (localStorage.getItem('2fa_enabled') === 'true') {
      setIs2FAVerified(false);
      sessionStorage.removeItem('2fa_verified');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIs2FAVerified(false);
    sessionStorage.removeItem('is_authenticated');
    sessionStorage.removeItem('2fa_verified');
  };

  const enable2FA = (secret) => {
    localStorage.setItem('2fa_enabled', 'true');
    localStorage.setItem('2fa_secret', secret);
    setIs2FAEnabled(true);
    setIs2FAVerified(true);
    sessionStorage.setItem('2fa_verified', 'true');
  };

  const disable2FA = () => {
    localStorage.removeItem('2fa_enabled');
    localStorage.removeItem('2fa_secret');
    setIs2FAEnabled(false);
    setIs2FAVerified(true);
    sessionStorage.removeItem('2fa_verified');
  };

  const verify2FA = (token) => {
    const secret = localStorage.getItem('2fa_secret');
    if (!secret) return false;
    
    try {
      const isValid = verifySync({ token, secret });
      if (isValid && isValid.valid) {
        setIs2FAVerified(true);
        sessionStorage.setItem('2fa_verified', 'true');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      is2FAEnabled,
      is2FAVerified,
      isLoading,
      login,
      logout,
      enable2FA,
      disable2FA,
      verify2FA
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
