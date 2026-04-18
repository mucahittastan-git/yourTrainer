import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../utils/ToastContext';
import useNetworkStatus from './useNetworkStatus';

/**
 * Offline durumda data sync işlemlerini yöneten hook
 * @returns {Object} Sync durumu ve fonksiyonları
 */
const useOfflineSync = () => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const { toast } = useToast();
  
  const [pendingActions, setPendingActions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // LocalStorage'dan pending actions'ı yükle
  useEffect(() => {
    const saved = localStorage.getItem('offline_pending_actions');
    if (saved) {
      try {
        setPendingActions(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading pending actions:', error);
        localStorage.removeItem('offline_pending_actions');
      }
    }
  }, []);

  // Pending actions'ı localStorage'a kaydet
  useEffect(() => {
    if (pendingActions.length > 0) {
      localStorage.setItem('offline_pending_actions', JSON.stringify(pendingActions));
    } else {
      localStorage.removeItem('offline_pending_actions');
    }
  }, [pendingActions]);

  // Offline action ekle
  const addOfflineAction = useCallback((action) => {
    const newAction = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...action
    };

    setPendingActions(prev => [...prev, newAction]);
    
    toast.info('İşlem offline queue\'ya eklendi. Online olduğunuzda senkronize edilecek.', {
      title: 'Offline Mod'
    });

    return newAction.id;
  }, [toast]);



  // Pending actions'ı sync et
  const syncPendingActions = useCallback(async () => {
    if (!isOnline || pendingActions.length === 0 || isSyncing) {
      return;
    }

    setIsSyncing(true);
    
    try {
      toast.info('Offline veriler senkronize ediliyor...', {
        title: 'Sync İşlemi'
      });

      const successfulActions = [];
      const failedActions = [];

      const executeActionLocal = async (action) => {
        switch (action.type) {
          case 'CREATE_CLIENT':
            return await syncCreateClient(action.data);
          
          case 'UPDATE_CLIENT':
            return await syncUpdateClient(action.data);
          
          case 'DELETE_CLIENT':
            return await syncDeleteClient(action.data);
          
          case 'CREATE_LESSON':
            return await syncCreateLesson(action.data);
          
          case 'UPDATE_LESSON':
            return await syncUpdateLesson(action.data);
          
          case 'UPDATE_PROFILE':
            return await syncUpdateProfile(action.data);
          
          default:
            throw new Error(`Unknown action type: ${action.type}`);
        }
      };

      for (const action of pendingActions) {
        try {
          await executeActionLocal(action);
          successfulActions.push(action);
        } catch (error) {
          console.error('Sync action failed:', action, error);
          failedActions.push(action);
        }
      }

      // Başarılı actions'ı kaldır
      setPendingActions(failedActions);
      setLastSyncTime(new Date().toISOString());

      if (successfulActions.length > 0) {
        toast.success(`${successfulActions.length} işlem başarıyla senkronize edildi!`, {
          title: 'Sync Tamamlandı'
        });
      }

      if (failedActions.length > 0) {
        toast.warning(`${failedActions.length} işlem senkronize edilemedi. Tekrar denenecek.`, {
          title: 'Kısmi Sync'
        });
      }

    } catch (error) {
      console.error('Sync process failed:', error);
      toast.error('Senkronizasyon sırasında hata oluştu.', {
        title: 'Sync Hatası'
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, pendingActions, isSyncing, toast]);

  // Online'a dönünce otomatik sync — syncPendingActions'tan sonra tanımlı
  useEffect(() => {
    if (isOnline && wasOffline && pendingActions.length > 0) {
      syncPendingActions();
    }
  }, [isOnline, wasOffline, pendingActions.length, syncPendingActions]);

  // Sync fonksiyonları (şimdilik localStorage ile çalışıyor)
  const syncCreateClient = async (clientData) => {
    // Gerçek API'ye gönderilecek
    console.log('Syncing create client:', clientData);
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const syncUpdateClient = async (clientData) => {
    console.log('Syncing update client:', clientData);
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  const syncDeleteClient = async (clientId) => {
    console.log('Syncing delete client:', clientId);
    await new Promise(resolve => setTimeout(resolve, 200));
  };

  const syncCreateLesson = async (lessonData) => {
    console.log('Syncing create lesson:', lessonData);
    await new Promise(resolve => setTimeout(resolve, 400));
  };

  const syncUpdateLesson = async (lessonData) => {
    console.log('Syncing update lesson:', lessonData);
    await new Promise(resolve => setTimeout(resolve, 350));
  };

  const syncUpdateProfile = async (profileData) => {
    console.log('Syncing update profile:', profileData);
    await new Promise(resolve => setTimeout(resolve, 250));
  };

  // Manuel sync tetikleme
  const forcSync = useCallback(() => {
    if (isOnline && pendingActions.length > 0) {
      syncPendingActions();
    } else if (!isOnline) {
      toast.warning('Sync için internet bağlantısı gerekli.', {
        title: 'Çevrimdışı'
      });
    } else {
      toast.info('Senkronize edilecek veri yok.', {
        title: 'Sync'
      });
    }
  }, [isOnline, pendingActions.length, syncPendingActions, toast]);

  // Pending action sil
  const removePendingAction = useCallback((actionId) => {
    setPendingActions(prev => prev.filter(action => action.id !== actionId));
  }, []);

  // Tüm pending actions'ı temizle
  const clearPendingActions = useCallback(() => {
    setPendingActions([]);
    localStorage.removeItem('offline_pending_actions');
    toast.success('Tüm bekleyen işlemler temizlendi.', {
      title: 'Temizlendi'
    });
  }, [toast]);

  return {
    // State
    pendingActions,
    isSyncing,
    lastSyncTime,
    hasPendingActions: pendingActions.length > 0,
    
    // Actions
    addOfflineAction,
    syncPendingActions,
    forcSync,
    removePendingAction,
    clearPendingActions,
    
    // Helpers
    canSync: isOnline && !isSyncing,
    needsSync: isOnline && pendingActions.length > 0
  };
};

export default useOfflineSync;
