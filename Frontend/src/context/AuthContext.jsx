import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../api/api';

const AuthContext = createContext();

export const LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'কন্নড়', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇮🇳' },
  { code: 'or', name: 'Oriya', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('app_lang') || 'hi');
  const [toast, setToast] = useState(null);
  const [backendHealthy, setBackendHealthy] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check Backend Health
  const checkHealth = async () => {
    try {
      const res = await api.healthCheck();
      if (res && (res.status === 'healthy' || res.status === 'ok')) {
        setBackendHealthy(true);
      } else {
        setBackendHealthy(false);
      }
    } catch {
      setBackendHealthy(false);
    }
  };

  // Load profile if token exists
  useEffect(() => {
    checkHealth();

    const handleSessionExpired = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setToken(null);
      setUser(null);
      showToast('Session expired. Please sign in again.', 'error');
    };

    window.addEventListener('auth:session_expired', handleSessionExpired);

    const initAuth = async () => {
      if (token) {
        try {
          const profileData = await api.getProfile();
          if (profileData) {
            profileData.role = profileData.profile?.role || profileData.role || 'patient';
            setUser(profileData);
            if (profileData?.profile?.preferred_language) {
              setCurrentLang(profileData.profile.preferred_language);
              localStorage.setItem('app_lang', profileData.profile.preferred_language);
            }
          }
        } catch (err) {
          // Attempt refresh if token expired
          const refreshTok = localStorage.getItem('refresh_token');
          if (refreshTok) {
            try {
              const res = await api.refreshToken(refreshTok);
              localStorage.setItem('access_token', res.access);
              setToken(res.access);
              const profileData = await api.getProfile();
              if (profileData) {
                profileData.role = profileData.profile?.role || profileData.role || 'patient';
                setUser(profileData);
                if (profileData?.profile?.preferred_language) {
                  setCurrentLang(profileData.profile.preferred_language);
                  localStorage.setItem('app_lang', profileData.profile.preferred_language);
                }
              }
            } catch {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              setToken(null);
              setUser(null);
            }
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    initAuth();

    return () => {
      window.removeEventListener('auth:session_expired', handleSessionExpired);
    };
  }, [token]);

  const refreshProfile = async () => {
    try {
      const profileData = await api.getProfile();
      if (profileData) {
        profileData.role = profileData.profile?.role || profileData.role || 'patient';
        setUser(profileData);
        if (profileData?.profile?.preferred_language) {
          setCurrentLang(profileData.profile.preferred_language);
          localStorage.setItem('app_lang', profileData.profile.preferred_language);
        }
      }
      return profileData;
    } catch (err) {
      return null;
    }
  };

  const login = async (username, password, expectedRole = null) => {
    setLoading(true);
    try {
      const res = await api.login(username, password, expectedRole);
      localStorage.setItem('access_token', res.tokens.access);
      localStorage.setItem('refresh_token', res.tokens.refresh);
      setToken(res.tokens.access);
      let userData = res.user?.profile ? res.user : await refreshProfile();
      if (!userData) {
        userData = res.user;
      }
      if (userData) {
        userData.role = userData.profile?.role || userData.role || 'patient';
      }
      setUser(userData);
      if (userData?.profile?.preferred_language) {
        setCurrentLang(userData.profile.preferred_language);
        localStorage.setItem('app_lang', userData.profile.preferred_language);
      }
      showToast(`Welcome back, ${userData?.first_name || userData?.username}!`, 'success');
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Login failed. Check credentials.', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      showToast('Registration successful! Please log in.', 'success');
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Registration failed.', 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const updateLanguage = (code) => {
    setCurrentLang(code);
    localStorage.setItem('app_lang', code);
    if (user && token) {
      api.updateProfile({ preferred_language: code }).then(async () => {
        await refreshProfile();
        showToast(`Language updated to ${LANGUAGES.find((l) => l.code === code)?.name}`, 'info');
      }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        currentLang,
        toast,
        backendHealthy,
        login,
        register,
        logout,
        refreshProfile,
        updateLanguage,
        showToast,
        checkHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
