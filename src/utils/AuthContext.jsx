import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from './helpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default profile for the Personal Trainer
const DEFAULT_PT = {
  id: 1,
  ad: 'Mücahit',
  soyad: 'Tastan',
  kullanici_adi: 'mucahit_pt',
  email: 'pt@yourtrainer.com',
  uzmanlik_alani: 'Fitness & Vücut Geliştirme',
  telefon: '5551234567',
  yas: 28,
  ders_basina_ucret: 500,
  profil_resmi_url: null,
  created_at: new Date().toISOString()
};

export const AuthProvider = ({ children }) => {
  const [currentPT, setCurrentPT] = useState(null);
  const [isAuthenticated] = useState(true); // Always authenticated
  const [loading, setLoading] = useState(true);

  // Initialize PT profile from localStorage or default
  useEffect(() => {
    const initProfile = () => {
      try {
        const savedPT = getFromLocalStorage('currentPT', null);
        if (savedPT) {
          setCurrentPT(savedPT);
        } else {
          setCurrentPT(DEFAULT_PT);
          saveToLocalStorage('currentPT', DEFAULT_PT);
        }
      } catch (error) {
        console.error('Error initializing PT profile:', error);
        setCurrentPT(DEFAULT_PT);
      } finally {
        setLoading(false);
      }
    };

    initProfile();
  }, []);

  // Simplified profile update
  const updatePTProfile = async (updatedData) => {
    try {
      const newData = { ...currentPT, ...updatedData };
      setCurrentPT(newData);
      saveToLocalStorage('currentPT', newData);
      return { success: true, data: newData };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profil güncellenirken hata oluştu' };
    }
  };

  // Remaining functions are now stubs to prevent breaking components
  const login = async () => ({ success: true });
  const register = async () => ({ success: true });
  const logout = async () => {};
  const uploadProfileImage = async (url) => {
    return updatePTProfile({ profil_resmi_url: url });
  };

  const value = {
    isAuthenticated,
    currentPT,
    loading,
    login,
    register,
    logout,
    updatePTProfile,
    uploadProfileImage
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
