import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFromLocalStorage } from '../utils/helpers';
import { 
  Zap, 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Dumbbell,
  ChevronRight,
  Activity
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const MemberPortal = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const allClients = getFromLocalStorage('musteriler', []);
      const foundClient = allClients.find(c => c.id === id);
      setClient(foundClient);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Activity className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-black text-main uppercase tracking-tighter">Profil Bulunamadı</h1>
        <p className="text-slate-500 mt-2 max-w-xs">Paylaşılan link hatalı olabilir veya antrenörünüz kaydı güncellemiş olabilir.</p>
      </div>
    );
  }

  const progress = Math.min(Math.round(((client.alinan_ders_sayisi || 0) / 20) * 100), 100); // Mock progress logic

  return (
    <div className="min-h-screen pb-12 bg-page">
      {/* Header HUD */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-primary-600">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#fff_0%,transparent_100%)]"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black mb-4 shadow-2xl border border-white/30 animate-fade-in">
            {client.ad?.charAt(0)}
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter animate-fade-in animate-stagger-1">
            {client.ad} {client.soyad}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mt-1 animate-fade-in animate-stagger-2">
            Personal Training HUB
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-md mx-auto -mt-12 px-6 space-y-4">
        {/* Progress Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-5 rounded-[2rem] animate-slide-up animate-stagger-1 text-slate-600">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              <Zap className="h-3 w-3 text-primary-500" />
              <span>Ders Sayısı</span>
            </div>
            <div className="text-2xl font-black text-main">{client.alinan_ders_sayisi}</div>
            <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Tamamlanan Seans</div>
          </div>
          
          <div className="glass-card p-5 rounded-[2rem] animate-slide-up animate-stagger-2">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              <Target className="h-3 w-3 text-emerald-500" />
              <span>Uyum Skoru</span>
            </div>
            <div className="text-2xl font-black text-main">%94</div>
            <div className="text-[9px] font-bold text-emerald-600 mt-1 uppercase">Harika Gidiyorsun!</div>
          </div>
        </div>

        {/* Measurements Card */}
        <div className="glass-card p-6 rounded-[2.5rem] animate-slide-up animate-stagger-3">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Güncel Ölçüler</span>
            <TrendingUp className="h-4 w-4 text-primary-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-primary-500 transition-colors">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ağırlık</div>
                  <div className="text-sm font-black text-main">{client.vucut_olculeri?.kilo || '--'} KG</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-primary-500 transition-colors">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Boy</div>
                  <div className="text-sm font-black text-main">{client.vucut_olculeri?.boy || '--'} CM</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Schedule Highlight */}
        <div className="glass-card p-6 rounded-[2.5rem] animate-slide-up animate-stagger-4 overflow-hidden relative">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-main">Sıradaki Seans</h3>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-[10px] font-black text-primary-500 uppercase">Pazartesi</div>
                <div className="text-xl font-black text-main">14</div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Clock className="h-3 w-3" />
                  <span>19:00 - 20:00</span>
                </div>
                <div className="text-xs font-bold text-main">HIIT & CORE STRENGTH</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full py-4 btn-primary rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95">
              ANTRENÖRÜNE MESAJ GÖNDER
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white/10 opacity-60">
          <Dumbbell className="h-3 w-3 text-primary-500" />
          <span className="text-[9px] font-black uppercase tracking-tighter text-main">Elite Powered by YourTrainer</span>
        </div>
      </div>
    </div>
  );
};

export default MemberPortal;
