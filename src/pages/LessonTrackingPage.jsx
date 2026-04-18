import React, { useState, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import { useLessons } from '../hooks/useLessons';
import { loadDemoLessons, addSingleLesson } from '../utils/lessonGenerators';

// Components
import LessonCalendar from '../components/lesson-tracking/LessonCalendar';
import LessonModal from '../components/lesson-tracking/LessonModal';
import QuickLessonForm from '../components/lesson-tracking/QuickLessonForm';
import LessonList from '../components/lesson-tracking/LessonList';
import WhatsAppModal from '../components/whatsapp/WhatsAppModal';

// Mobile components
import { MobileHeader, FloatingActionButton } from '../components/mobile';
import useMobile from '../hooks/useMobile';
import { LessonPageSkeleton } from '../components/ui/Skeleton';

// Icons
import { 
  Calendar, 
  Clock, 
  Activity, 
  TrendingUp, 
  CheckCircle, 
  CalendarPlus, 
  Eye, 
  MessageCircle,
  Award,
  Zap,
  Star
} from 'lucide-react';

const LessonTrackingPage = () => {
  const { currentPT } = useAuth();
  const { toast } = useToast();
  const { isMobile } = useMobile();
  const { 
    clients, 
    todaysLessons, 
    upcomingLessons, 
    allLessons, 
    stats: lessonStats,
    refresh,
    handleMarkNoShow,
    handleCancelLesson
  } = useLessons();
  
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppSelectedClient, setWhatsAppSelectedClient] = useState(null);
  const [whatsAppSelectedDate, setWhatsAppSelectedDate] = useState(null);
  const [view, setView] = useState('calendar'); // 'calendar', 'today', 'upcoming'

  React.useEffect(() => {
    loadDemoLessons();
  }, []);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const handleQuickComplete = (lessonId) => {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (lesson) {
      setSelectedLesson(lesson);
      setShowQuickForm(true);
    }
  };

  const handleQuickCompleteSubmit = (_updatedLesson) => {
    setShowQuickForm(false);
    setSelectedLesson(null);
    refresh();
    toast.success('Ders başarıyla tamamlandı! 🎉');
  };

  const handleLessonUpdate = (_updatedLesson) => {
    setShowLessonModal(false);
    setSelectedLesson(null);
    refresh();
    toast.success('Ders güncellendi');
  };

  const handleLessonDelete = (_lessonId) => {
    setShowLessonModal(false);
    setSelectedLesson(null);
    refresh();
    toast.info('Ders silindi');
  };

  const handleAddLesson = (selectedDate) => {
    const dateStr = selectedDate ? (selectedDate instanceof Date ? selectedDate.toISOString().split('T')[0] : selectedDate) : null;
    const availableClients = Object.values(clients).filter(client => {
      if (!client.tahmini_bitis_tarihi) return true;
      return new Date(client.tahmini_bitis_tarihi) > new Date();
    });
    
    if (availableClients.length === 0) {
      toast.warning('Aktif üyeniz yok. Önce bir üye ekleyin.');
      return;
    }
    
    const firstClient = availableClients[0];
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const dayName = days[(selectedDate || new Date()).getDay()];
    
    try {
      addSingleLesson({
        musteri_id: firstClient.id,
        pt_id: currentPT?.id,
        planlanan_tarih: dateStr || new Date().toISOString().split('T')[0],
        planlanan_saat: '14:00',
        planlanan_gun: dayName
      });
      refresh();
      toast.success(`${firstClient.ad} ${firstClient.soyad} için ders eklendi`);
    } catch (error) {
      toast.error('Ders eklenirken bir hata oluştu');
    }
  };

  const handleOpenWhatsApp = (client = null, date = null) => {
    setWhatsAppSelectedClient(client);
    setWhatsAppSelectedDate(date);
    setShowWhatsAppModal(true);
  };

  const handleCloseWhatsApp = () => {
    setShowWhatsAppModal(false);
    setWhatsAppSelectedClient(null);
    setWhatsAppSelectedDate(null);
  };

  const ViewToggle = () => (
    <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
      {[
        { id: 'calendar', label: 'Takvim', icon: Calendar },
        { id: 'today', label: 'Bugün', icon: Clock },
        { id: 'upcoming', label: 'Gelecek', icon: TrendingUp }
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex items-center space-x-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${
            view === item.id 
              ? 'bg-white text-primary-500 shadow-xl shadow-primary-500/10 scale-105' 
              : 'text-slate-400 hover:text-main hover:bg-white/50'
          }`}
        >
          <item.icon className={`h-3.5 w-3.5 ${view === item.id ? 'text-primary-500' : 'text-slate-400'}`} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0 mb-20 md:mb-0">
      <MobileHeader 
        title="Ders Takibi"
        subtitle={`${lessonStats.total || 0} toplam seans`}
        showBack={false}
      />

      <div className={`space-y-12 ${isMobile ? 'pt-4' : 'pt-0'}`}>
        {/* 👑 Elite Header */}
        {!isMobile && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-black uppercase tracking-widest">
                <Activity className="h-3 w-3" />
                <span>Performans Takvimi</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-main tracking-tight">
                Ders <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">Planlama</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
                Haftalık programını optimize et, üyelerinin ilerlemesini anlık takip et ve seanslarını yönet.
              </p>
            </div>
            <ViewToggle />
          </div>
        )}

        {isMobile && <div className="flex justify-center"><ViewToggle /></div>}

        {/* 📊 Premium Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Bugünkü Seans', val: todaysLessons.length, icon: Clock, color: 'text-primary-500', bg: 'bg-primary-500/10' },
            { label: 'Tamamlanan', val: lessonStats.completed, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Planlanan', val: lessonStats.planned, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Başarı Skoru', val: `%${lessonStats.completionRate}`, icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-[2rem] p-6 hover-lift border-none shadow-xl shadow-primary-500/5 group transition-all duration-500">
              <div className="flex flex-col space-y-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-main tracking-tighter">{stat.val}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🗓️ Main Interface */}
        <div className="animate-fade-in pb-12">
          {view === 'calendar' && (
            <div className="glass-card rounded-[2.5rem] p-8 lg:p-12 border-white/20 shadow-2xl">
              <LessonCalendar
                onLessonClick={handleLessonClick}
                onAddLesson={handleAddLesson}
                ptId={currentPT?.id}
                isMobile={isMobile}
              />
            </div>
          )}

          {view === 'today' && (
            <div className="space-y-8">
              <LessonList 
                lessons={todaysLessons}
                clients={clients}
                title="BUGÜNKÜ AKIŞ"
                showProgress={true}
                onLessonClick={handleLessonClick}
                onQuickComplete={handleQuickComplete}
                variant="premium"
                maxItems={50}
              />
            </div>
          )}

          {view === 'upcoming' && (
            <div className="space-y-8">
              <LessonList 
                lessons={upcomingLessons}
                clients={clients}
                title="YAKLAŞAN SEANSLAR"
                onLessonClick={handleLessonClick}
                onQuickComplete={handleQuickComplete}
                variant="premium"
                maxItems={50}
              />
            </div>
          )}
        </div>

        <FloatingActionButton
          actions={[
            {
              icon: MessageCircle,
              label: 'WhatsApp Bildirimi',
              color: 'bg-emerald-500',
              textColor: 'text-white',
              onClick: () => handleOpenWhatsApp()
            },
            {
              icon: CalendarPlus,
              label: 'Ders Ekle',
              color: 'bg-indigo-600',
              textColor: 'text-white',
              onClick: () => handleAddLesson()
            }
          ]}
        />

        <LessonModal
          lesson={selectedLesson}
          client={selectedLesson ? clients[selectedLesson.musteri_id] : null}
          isOpen={showLessonModal}
          onClose={() => { setShowLessonModal(false); setSelectedLesson(null); }}
          onUpdate={handleLessonUpdate}
          onDelete={handleLessonDelete}
          onMarkNoShow={() => handleMarkNoShow(selectedLesson?.id)}
          onCancel={() => handleCancelLesson(selectedLesson?.id)}
        />

        <QuickLessonForm
          lesson={selectedLesson}
          isOpen={showQuickForm}
          onComplete={handleQuickCompleteSubmit}
          onCancel={() => { setShowQuickForm(false); setSelectedLesson(null); }}
        />

        <WhatsAppModal
          isOpen={showWhatsAppModal}
          onClose={handleCloseWhatsApp}
          selectedClient={whatsAppSelectedClient}
          selectedDate={whatsAppSelectedDate}
        />
      </div>
    </div>
  );
};

export default LessonTrackingPage;
