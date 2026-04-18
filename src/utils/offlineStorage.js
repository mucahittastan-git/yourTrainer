/**
 * Offline Storage Utility
 * LocalStorage'ı optimize eder ve offline çalışmayı garanti eder
 */

// Storage keys
export const STORAGE_KEYS = {
  CLIENTS: 'musteriler',
  LESSONS: 'lessons',
  PT_SESSION: 'pt_session',
  OFFLINE_ACTIONS: 'offline_pending_actions',
  APP_SETTINGS: 'app_settings',
  CACHE_TIMESTAMP: 'cache_timestamp'
};

// Storage size limits (MB)
const STORAGE_LIMITS = {
  MAX_TOTAL_SIZE: 10, // 10MB total
  MAX_ITEM_SIZE: 2,   // 2MB per item
  WARNING_THRESHOLD: 8 // 8MB warning
};

/**
 * Get storage usage in bytes
 */
export const getStorageUsage = () => {
  let totalSize = 0;
  const itemSizes = {};

  for (let key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      const itemSize = (localStorage[key].length + key.length) * 2; // UTF-16
      itemSizes[key] = itemSize;
      totalSize += itemSize;
    }
  }

  return {
    totalSize,
    itemSizes,
    totalMB: (totalSize / (1024 * 1024)).toFixed(2),
    isNearLimit: totalSize > (STORAGE_LIMITS.WARNING_THRESHOLD * 1024 * 1024)
  };
};

/**
 * Check if we can store data
 */
export const canStore = (data) => {
  const dataSize = JSON.stringify(data).length * 2; // UTF-16
  const dataMB = dataSize / (1024 * 1024);
  const usage = getStorageUsage();
  
  return {
    canStore: dataMB <= STORAGE_LIMITS.MAX_ITEM_SIZE && 
              (usage.totalSize + dataSize) <= (STORAGE_LIMITS.MAX_TOTAL_SIZE * 1024 * 1024),
    itemSizeMB: dataMB.toFixed(2),
    wouldExceedLimit: dataMB > STORAGE_LIMITS.MAX_ITEM_SIZE,
    wouldExceedTotal: (usage.totalSize + dataSize) > (STORAGE_LIMITS.MAX_TOTAL_SIZE * 1024 * 1024)
  };
};

/**
 * Safely get data from localStorage
 */
export const safeGetItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Safely set data to localStorage with compression and limits
 */
export const safeSetItem = (key, value, options = {}) => {
  const { backup = true } = options;

  try {
    const dataStr = JSON.stringify(value);
    const canStoreResult = canStore(value);
    
    if (!canStoreResult.canStore) {
      if (canStoreResult.wouldExceedLimit) {
        throw new Error(`Item too large: ${canStoreResult.itemSizeMB}MB (max: ${STORAGE_LIMITS.MAX_ITEM_SIZE}MB)`);
      }
      if (canStoreResult.wouldExceedTotal) {
        // Try to clean up old data
        cleanupOldData();
        // Retry
        const retryResult = canStore(value);
        if (!retryResult.canStore) {
          throw new Error('Storage full even after cleanup');
        }
      }
    }

    // Backup current value if requested
    if (backup && localStorage.getItem(key)) {
      try {
        localStorage.setItem(`${key}_backup`, localStorage.getItem(key));
      } catch (backupError) {
        console.warn('Could not create backup:', backupError);
      }
    }

    // Store the data
    localStorage.setItem(key, dataStr);
    
    // Update timestamp
    localStorage.setItem(`${key}_timestamp`, new Date().toISOString());
    
    return { success: true };

  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    
    // Try to restore from backup
    if (backup) {
      try {
        const backupData = localStorage.getItem(`${key}_backup`);
        if (backupData) {
          localStorage.setItem(key, backupData);
          console.log(`Restored ${key} from backup`);
        }
      } catch (restoreError) {
        console.error('Could not restore from backup:', restoreError);
      }
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Remove item from localStorage
 */
export const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_timestamp`);
    localStorage.removeItem(`${key}_backup`);
    return { success: true };
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Clean up old/unused data
 */
export const cleanupOldData = () => {
  const now = new Date().getTime();
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
  
  const keysToCheck = [];
  
  // Find all timestamped items
  for (let key in localStorage) {
    if (key.endsWith('_timestamp')) {
      keysToCheck.push(key.replace('_timestamp', ''));
    }
  }
  
  keysToCheck.forEach(key => {
    try {
      const timestamp = localStorage.getItem(`${key}_timestamp`);
      if (timestamp) {
        const age = now - new Date(timestamp).getTime();
        
        // Remove backup files older than 1 week
        if (key.endsWith('_backup') && age > ONE_WEEK) {
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}_timestamp`);
          console.log(`Cleaned up old backup: ${key}`);
        }
        
        // Remove cache items older than 1 month
        if (key.includes('cache') && age > ONE_MONTH) {
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}_timestamp`);
          console.log(`Cleaned up old cache: ${key}`);
        }
      }
    } catch (error) {
      console.error(`Error cleaning up ${key}:`, error);
    }
  });
};

/**
 * Get all stored data for backup/export
 */
export const exportAllData = () => {
  const data = {};
  const metadata = {
    exportDate: new Date().toISOString(),
    version: '1.4.0',
    storageUsage: getStorageUsage()
  };
  
  // Export only app-specific data
  Object.values(STORAGE_KEYS).forEach(key => {
    const value = safeGetItem(key);
    if (value !== null) {
      data[key] = value;
    }
  });
  
  return { data, metadata };
};

/**
 * Import data from backup
 */
export const importAllData = (importData, options = {}) => {
  const { overwrite = false, validate = true } = options;
  const results = {
    success: [],
    failed: [],
    skipped: []
  };
  
  try {
    const { data, metadata } = importData;
    
    // Validate if requested
    if (validate && (!data || !metadata)) {
      throw new Error('Invalid import data format');
    }
    
    // Import each item
    Object.entries(data).forEach(([key, value]) => {
      try {
        if (!overwrite && localStorage.getItem(key)) {
          results.skipped.push(key);
          return;
        }
        
        const result = safeSetItem(key, value, { backup: true });
        if (result.success) {
          results.success.push(key);
        } else {
          results.failed.push({ key, error: result.error });
        }
      } catch (error) {
        results.failed.push({ key, error: error.message });
      }
    });
    
    return { success: true, results };
    
  } catch (error) {
    return { success: false, error: error.message, results };
  }
};

/**
 * Initialize offline storage
 */
export const initializeOfflineStorage = () => {
  try {
    // Check if localStorage is available
    if (typeof Storage === 'undefined') {
      throw new Error('LocalStorage not supported');
    }
    
    // Test write capability
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    
    // Clean up old data
    cleanupOldData();
    
    // Check storage usage
    const usage = getStorageUsage();
    if (usage.isNearLimit) {
      console.warn(`Storage usage high: ${usage.totalMB}MB`);
    }
    
    console.log(`✅ Offline storage initialized (${usage.totalMB}MB used)`);
    return { success: true, usage };
    
  } catch (error) {
    console.error('❌ Offline storage initialization failed:', error);
    return { success: false, error: error.message };
  }
};

// Auto-initialize on import
initializeOfflineStorage();
