import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import { 
  getTodaysLessons, 
  getUpcomingLessons, 
  getLessonsByPT,
  markLessonNoShow,
  cancelLesson as apiCancelLesson,
  getLessonStats
} from '../utils/lessonHelpers';
import { getFromLocalStorage } from '../utils/helpers';

/**
 * Centralized hook for lesson management and stats
 */
export const useLessons = () => {
  const { currentPT } = useAuth();
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Sync with Supabase if active, otherwise fallback to localStorage
  // For now, focusing on localStorage as it's the primary stable source in this build
  const clients = useMemo(() => {
    void refreshTrigger;
    const clientsData = getFromLocalStorage('musteriler', []);
    return clientsData.reduce((acc, client) => {
      acc[client.id] = client;
      return acc;
    }, {});
  }, [refreshTrigger]);

  const todaysLessons = useMemo(() => {
    void refreshTrigger;
    return getTodaysLessons(currentPT?.id);
  }, [currentPT?.id, refreshTrigger]);

  const upcomingLessons = useMemo(() => {
    void refreshTrigger;
    return getUpcomingLessons(currentPT?.id, 7);
  }, [currentPT?.id, refreshTrigger]);

  const allLessons = useMemo(() => {
    void refreshTrigger;
    return getLessonsByPT(currentPT?.id);
  }, [currentPT?.id, refreshTrigger]);

  const stats = useMemo(() => {
    void refreshTrigger;
    return getLessonStats(null, currentPT?.id);
  }, [currentPT?.id, refreshTrigger]);

  const handleMarkNoShow = useCallback(async (lessonId, reason = 'Müşteri gelmedi') => {
    try {
      markLessonNoShow(lessonId, reason);
      refresh();
      toast.warning('Ders "Gelmedi" olarak işaretlendi');
      return true;
    } catch (error) {
      toast.error('Bir hata oluştu');
      return false;
    }
  }, [refresh, toast]);

  const handleCancelLesson = useCallback(async (lessonId, reason = 'İptal edildi') => {
    try {
      apiCancelLesson(lessonId, reason);
      refresh();
      toast.info('Ders iptal edildi');
      return true;
    } catch (error) {
      toast.error('Bir hata oluştu');
      return false;
    }
  }, [refresh, toast]);

  return {
    clients,
    todaysLessons,
    upcomingLessons,
    allLessons,
    stats,
    loading,
    refresh,
    handleMarkNoShow,
    handleCancelLesson
  };
};

export default useLessons;
