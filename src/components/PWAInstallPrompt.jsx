import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Tablet } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      // PWA installed check
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // iOS Safari installed check
      if (window.navigator.standalone) {
        setIsInstalled(true);
        return;
      }
    };

    // Detect device type
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent;
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        setDeviceType('ios');
      } else if (/Android/.test(userAgent)) {
        setDeviceType('android');
      } else if (/Tablet|iPad/.test(userAgent)) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkInstalled();
    detectDeviceType();

    // PWA install prompt event listener
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Don't show immediately, show after user interaction
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000); // 3 saniye sonra göster
    };

    // PWA installed event listener
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log('🎉 PWA installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show install prompt
      deferredPrompt.prompt();
      
      // Wait for user response
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`PWA install prompt outcome: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    } finally {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  // Don't show if no install prompt available
  if (!showInstallPrompt || !deferredPrompt) {
    return null;
  }

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'ios':
      case 'android':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getInstallText = () => {
    switch (deviceType) {
      case 'ios':
        return {
          title: "iPhone'una Ekle",
          description: "YourTrainer'ı anasayfana ekleyerek daha hızlı erişim sağla"
        };
      case 'android':
        return {
          title: 'Telefonuna Yükle',
          description: "YourTrainer'ı uygulama olarak yükleyerek daha iyi deneyim yaşa"
        };
      case 'tablet':
        return {
          title: 'Tabletine Ekle',
          description: "YourTrainer'ı anasayfana ekleyerek kolay erişim sağla"
        };
      default:
        return {
          title: 'Bilgisayarına Yükle',
          description: "YourTrainer'ı masaüstü uygulaması olarak yükle"
        };
    }
  };

  const installText = getInstallText();

  return (
    <>
      {/* Desktop/Tablet Install Banner */}
      <div className="fixed top-4 right-4 z-50 max-w-sm animate-slide-in-right hidden sm:block">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 hover-lift">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-600">
                {getDeviceIcon()}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-slate-900 mb-1">
                {installText.title}
              </h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                {installText.description}
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black"
                >
                  <Download className="h-3 w-3" />
                  Yükle
                </button>
                
                <button
                  onClick={handleDismiss}
                  className="btn-ghost inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black"
                >
                  Şimdi Değil
                </button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="btn-icon flex-shrink-0 w-7 h-7 rounded-lg"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Install Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden animate-slide-up">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-600">
                {getDeviceIcon()}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-slate-900">
                {installText.title}
              </h3>
              <p className="text-xs text-slate-500">
                Daha iyi deneyim için yükle
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="btn-primary inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-black"
              >
                <Download className="h-4 w-4" />
                Yükle
              </button>
              
              <button
                onClick={handleDismiss}
                className="btn-icon"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PWAInstallPrompt;