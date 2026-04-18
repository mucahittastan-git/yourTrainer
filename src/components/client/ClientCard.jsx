import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Eye, Edit, Trash2, Award, Zap, Share2, MessageCircle, Copy, Check } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../utils/ToastContext';

const ClientCard = memo(({ 
  client, 
  onDeleteClick,
  className = '' 
}) => {
  const { showToast } = useToast();
  const [isShareMenuOpen, setIsShareMenuOpen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const getStatusBadge = (musteri) => {
    // ... existing logic stays همان
    const now = new Date();
    const bitisTarihi = musteri.tahmini_bitis_tarihi ? new Date(musteri.tahmini_bitis_tarihi) : null;
    
    if (!bitisTarihi) {
      return (
        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
          BELİRSİZ
        </span>
      );
    }

    if (bitisTarihi > now) {
      return (
        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20">
          AKTİF ÜYE
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-slate-300 rounded-lg">
          TAMAMLANDI
        </span>
      );
    }
  };

  const handleShareWhatsApp = () => {
    const message = `Selam ${client.ad}! İlerlemen harika gidiyor. 🚀\n\nTamamlanan Seans: ${client.alinan_ders_sayisi}\nGüncel Kilo: ${client.vucut_olculeri?.kilo || '--'} kg\n\nGüncel durumunu buradan takip edebilirsin: ${window.location.origin}/portal/${client.id}`;
    const url = `https://wa.me/${client.telefon?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsShareMenuOpen(false);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/portal/${client.id}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    showToast('Link kopyalandı!', 'info');
    setTimeout(() => {
      setIsCopied(false);
      setIsShareMenuOpen(false);
    }, 2000);
  };

  const getRemainingDays = (bitisTarihi) => {
    // ... existing logic stays
    if (!bitisTarihi) return null;
    const now = new Date();
    const bitis = new Date(bitisTarihi);
    const diffTime = bitis - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} GÜN KALDI`;
    } else if (diffDays === 0) {
      return 'BUGÜN BİTİYOR';
    } else {
      return `${Math.abs(diffDays)} GÜN ÖNCE BİTTİ`;
    }
  };

  const isHighValue = client.toplam_ucret > 5000;

  return (
    <div className={`glass-card rounded-[2rem] overflow-hidden group hover-lift card-animate transition-all duration-500 border-none ${className}`}>
      {/* Header Profile Section */}
      <div className="p-8 pb-4 relative">
        <div className="absolute top-6 right-6 flex space-x-2">
          {isHighValue && (
            <div className="p-2 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20 animate-bounce-slow">
              <Award className="h-4 w-4 text-white" />
            </div>
          )}
          
          <div className="relative">
            <button
              onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
              className={`p-2 rounded-xl transition-all duration-300 border border-slate-100 hover:shadow-lg ${isShareMenuOpen ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-slate-400'}`}
            >
              <Share2 className="h-4 w-4" />
            </button>
            
            {isShareMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsShareMenuOpen(false)} />
                <div className="absolute top-full mt-2 right-0 w-48 glass-card border-none rounded-2xl shadow-2xl z-20 overflow-hidden animate-fade-in">
                  <button 
                    onClick={handleShareWhatsApp}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-emerald-500/10 text-slate-600 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp Paylaş</span>
                  </button>
                  <button 
                    onClick={handleCopyLink}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-primary-500/10 text-slate-600 transition-colors border-t border-slate-100"
                  >
                    {isCopied ? <Check className="h-4 w-4 text-primary-500" /> : <Copy className="h-4 w-4 text-primary-500" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">Linki Kopyala</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-black text-2xl group-hover:from-primary-500 group-hover:to-primary-700 group-hover:text-white transition-all duration-500 shadow-inner">
              {client.ad?.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white shadow-md flex items-center justify-center border border-slate-100">
              <Zap className="h-3 w-3 text-primary-500" />
            </div>
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-black text-main truncate tracking-tight">
                {client.ad} {client.soyad}
              </h3>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              {client.yas} YAŞINDA • ÜYE ID: {client.id}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          {getStatusBadge(client)}
          <div className="flex items-center -space-x-1">
            <Link
              to={`/clients/${client.id}`}
              className="btn-icon"
              title="Profili Gör"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              to={`/clients/${client.id}/edit`}
              className="btn-icon btn-icon--success"
              title="Düzenle"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={() => onDeleteClick(client)}
              className="btn-icon btn-icon--danger"
              title="Sil"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Divider */}
      <div className="px-8 flex items-center space-x-4">
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      {/* Metrics Body */}
      <div className="p-8 pt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-colors">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
              <Zap className="h-3 w-3 text-primary-500" />
              <span>Ders Sayısı</span>
            </div>
            <p className="text-lg font-black text-main">{client.alinan_ders_sayisi} SEANS</p>
          </div>
          
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-colors">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
              <DollarSign className="h-3 w-3 text-emerald-500" />
              <span>Harcama</span>
            </div>
            <p className="text-lg font-black text-main">{client.toplam_ucret?.toLocaleString('tr-TR')}₺</p>
          </div>
        </div>

        {/* Schedule Visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span>PROGRAM PLANI</span>
            <span className={client.tahmini_bitis_tarihi && new Date(client.tahmini_bitis_tarihi) > new Date() ? 'text-primary-500' : 'text-slate-500'}>
              {getRemainingDays(client.tahmini_bitis_tarihi)}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(gun => {
              const isActive = client.haftalik_ders_gunleri?.includes(gun);
              return (
                <div 
                  key={gun}
                  className={`flex-1 text-center py-2 rounded-lg text-[10px] font-black transition-all ${
                    isActive 
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                      : 'bg-slate-100 text-slate-500 opacity-50'
                  }`}
                >
                  {gun.charAt(0)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes Preview */}
        {client.notlar && (
          <div className="p-3 bg-primary-500/5 rounded-xl border border-primary-500/10">
            <p className="text-[11px] text-slate-600 font-medium italic line-clamp-1 leading-relaxed">
              "{client.notlar}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.client.id === nextProps.client.id &&
    prevProps.client.ad === nextProps.client.ad &&
    prevProps.client.soyad === nextProps.client.soyad &&
    prevProps.client.yas === nextProps.client.yas &&
    prevProps.client.alinan_ders_sayisi === nextProps.client.alinan_ders_sayisi &&
    prevProps.client.toplam_ucret === nextProps.client.toplam_ucret &&
    prevProps.client.tahmini_bitis_tarihi === nextProps.client.tahmini_bitis_tarihi
  );
});

ClientCard.displayName = 'ClientCard';

export default ClientCard;
