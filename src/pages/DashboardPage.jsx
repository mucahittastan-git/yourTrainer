import React, { useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useLessons } from '../hooks/useLessons';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Star,
  AlertCircle,
  CheckCircle,
  Target,
  Award,
  Calendar,
  ChevronRight,
  Zap
} from 'lucide-react';
import LessonList from '../components/lesson-tracking/LessonList';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import Alert from '../components/ui/Alert';

const DashboardPage = () => {
  const { currentPT } = useAuth();
  const navigate = useNavigate();
  const { 
    clients, 
    todaysLessons, 
    stats: lessonStats,
    loading: lessonsLoading 
  } = useLessons();

  const clientStats = useMemo(() => {
    const clientList = Object.values(clients);
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const totalClients = clientList.length;
    const activeClients = clientList.filter(client => {
      if (!client.tahmini_bitis_tarihi) return true;
      return new Date(client.tahmini_bitis_tarihi) > now;
    }).length;
    
    const totalRevenue = clientList.reduce((sum, client) => sum + (client.toplam_ucret || 0), 0);
    const thisMonthRevenue = clientList
      .filter(client => new Date(client.kayit_tarihi || client.created_at) >= thisMonth)
      .reduce((sum, client) => sum + (client.toplam_ucret || 0), 0);
    
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);
    
    const upcomingEnds = clientList
      .filter(client => {
        if (!client.tahmini_bitis_tarihi) return false;
        const endDate = new Date(client.tahmini_bitis_tarihi);
        return endDate > now && endDate <= thirtyDaysLater;
      })
      .sort((a, b) => new Date(a.tahmini_bitis_tarihi) - new Date(b.tahmini_bitis_tarihi))
      .slice(0, 3);

    return {
      totalClients,
      activeClients,
      totalRevenue,
      thisMonthRevenue,
      upcomingEnds
    };
  }, [clients]);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  if (lessonsLoading) return <DashboardSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-0 lg:p-0 animate-fade-in">
      
      {/* 🚀 Elite Bento Hero Section */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-white p-8 lg:p-12 shadow-xl border border-slate-100 transition-all duration-500">
        {/* Subtle Background Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary-100/30 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-emerald-100/20 blur-[80px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-[10px] font-black uppercase tracking-widest">
              <Zap className="h-3.5 w-3.5 fill-primary-600" />
              <span>Elite Trainer Aktif</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-950 leading-tight">
              Hoş geldin, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-600">{currentPT?.ad}</span>
            </h1>
            <p className="text-slate-600 text-lg lg:text-xl max-w-2xl font-medium leading-relaxed">
              Bugün performansını zirveye taşıma vakti. <span className="text-primary-600 font-bold">{todaysLessons.length} dersin</span> seni bekliyor.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => navigate('/clients/new')}
                className="btn-magnetic btn-dark-bg btn-primary flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-950/20 hover:scale-[1.03] active:scale-[0.97]"
              >
                <UserPlus className="h-5 w-5 text-indigo-200" />
                <span>Yeni Üye Ekle</span>
              </button>
              <button 
                onClick={() => navigate('/lessons')}
                className="btn-magnetic btn-ghost flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm"
              >
                <Calendar className="h-5 w-5" />
                <span>Programı Yönet</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex justify-center">
            <div className="relative group cursor-pointer hover:rotate-2 transition-transform duration-500">
              <div className="absolute inset-0 bg-primary-500 rounded-[2.5rem] blur-3xl opacity-10 group-hover:opacity-20" />
              <div className="relative glass-card !bg-white p-10 rounded-[2.5rem] border-slate-100 shadow-2xl">
                <Activity className="h-24 w-24 text-primary-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🍱 THE BENTO GRID */}
      <div className="bento-grid">
        
        {/* Main Stats Bento - Revenue */}
        <div className="bento-col-8 glass-card rounded-[2.5rem] p-8 group hover-lift overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="h-32 w-32" />
          </div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Finansal Özet</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-600">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase">Toplam Kazanç</span>
              </div>
              <p className="text-4xl lg:text-5xl font-black text-main tracking-tighter">
                {formatCurrency(clientStats.totalRevenue)}
              </p>
            </div>
            <div className="space-y-4 border-l border-slate-200 pl-0 md:pl-8">
              <div className="flex items-center space-x-3 text-primary-600">
                <div className="p-2 rounded-lg bg-primary-50">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-500">Bu Ay</span>
              </div>
              <p className="text-3xl lg:text-4xl font-black text-primary-700 tracking-tighter">
                {formatCurrency(clientStats.thisMonthRevenue)}
              </p>
              <div className="flex items-center space-x-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 w-fit px-2 py-1 rounded-md">
                <TrendingUp className="h-3 w-3" />
                <span>+12% artış</span>
              </div>
            </div>
          </div>
        </div>

        {/* Member Stats Bento */}
        <div className="bento-col-4 bg-white rounded-[2.5rem] p-8 group hover-lift relative overflow-hidden flex flex-col justify-between border border-slate-100 shadow-sm transition-all duration-300">
          <div className="absolute bottom-0 right-0 -mb-8 -mr-8 opacity-5 text-primary-600">
            <Users className="h-32 w-32" />
          </div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Müşteri Gücü</h3>
          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-5xl font-black tracking-tighter text-slate-950">{clientStats.activeClients}</p>
              <p className="text-primary-600 font-black text-[10px] uppercase tracking-widest mt-1 bg-primary-50 w-fit px-2 py-0.5 rounded-md">Aktif Kursiyer</p>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black text-slate-950">{clientStats.totalClients}</p>
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">Toplam Portföy</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <Users className="h-6 w-6 text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule Bento */}
        <div className="bento-col-8 bento-row-2">
          <LessonList 
            lessons={todaysLessons}
            clients={clients}
            title="Günlük Akış"
            showProgress={true}
            onLessonClick={(lesson) => navigate('/lessons', { state: { lessonId: lesson.id } })}
            onViewAll={() => navigate('/lessons')}
            variant="premium"
          />
        </div>

        {/* Performance Bento */}
        <div className="bento-col-4 glass-card rounded-[2.5rem] p-8 group hover-lift flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verimlilik</h3>
            <Award className="h-5 w-5 text-primary-500" />
          </div>
          <div className="space-y-8 flex-1 flex flex-col justify-center">
            <div className="relative h-32 w-32 mx-auto">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-100 stroke-[3]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                />
                <path
                  className="stroke-primary-500 stroke-[3] transition-all duration-1000 ease-out"
                  strokeDasharray={`${lessonStats.completionRate || 0}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-main">{lessonStats.completionRate || 0}%</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Başarı</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-500 mb-1 uppercase tracking-tighter">TAMAMLANAN</p>
                <p className="text-lg font-black text-main">{lessonStats.completed || 0}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-500 mb-1 uppercase tracking-tighter">PLANLANAN</p>
                <p className="text-lg font-black text-main">{lessonStats.planned || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Alerts Bento */}
        <div className="bento-col-4 glass-card rounded-[2.5rem] p-8 border-orange-500/10 group hover-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Kritik Takipler</h3>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="space-y-4">
              {clientStats.upcomingEnds.length > 0 ? (
                clientStats.upcomingEnds.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 group/item hover:bg-orange-500/10 transition-colors">
                    <div className="min-w-0">
                      <p className="font-black text-main truncate text-sm">{client.ad} {client.soyad}</p>
                      <p className="text-[9px] text-orange-600 font-bold uppercase tracking-widest mt-1">Bitiş Yaklaşıyor</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-orange-600/30 group-hover/item:translate-x-1 transition-transform" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Target className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-tight">Şu an kritik bildirim yok.</p>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => navigate('/clients/list')}
            className="btn-ghost w-full mt-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest"
          >
            Tüm Listeyi Gör
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;