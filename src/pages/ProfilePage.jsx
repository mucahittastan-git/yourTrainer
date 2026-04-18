import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import { User, Edit3, Save, X, Calendar, Award, DollarSign, Zap, Star, ShieldCheck, Activity } from 'lucide-react';
import { formatDate, generateUsername } from '../utils/helpers';
import { IMAGES } from '../assets';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import ProfileFormField from '../components/form/ProfileFormField';

const ProfilePage = () => {
  const { currentPT, updatePTProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    ad: currentPT?.ad || '',
    soyad: currentPT?.soyad || '',
    kullanici_adi: currentPT?.kullanici_adi || '',
    ders_basina_ucret: currentPT?.ders_basina_ucret || 200,
    uzmanlik_alani: currentPT?.uzmanlik_alani || '',
    yas: currentPT?.yas || '',
    profil_resmi_url: currentPT?.profil_resmi_url || IMAGES.PROFILE_MUCAHIT
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'ad' || name === 'soyad') {
        const ad = name === 'ad' ? value : prev.ad;
        const soyad = name === 'soyad' ? value : prev.soyad;
        if (ad && soyad) {
          newData.kullanici_adi = generateUsername(ad, soyad);
        }
      }
      return newData;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!editData.ad.trim()) return toast.error('Ad boş bırakılamaz');
      if (!editData.soyad.trim()) return toast.error('Soyad boş bırakılamaz');
      if (!editData.kullanici_adi.trim()) return toast.error('Kullanıcı adı boş bırakılamaz');
      if (!editData.uzmanlik_alani.trim()) return toast.error('Uzmanlık alanı boş bırakılamaz');
      
      updatePTProfile(editData);
      setIsEditing(false);
      toast.success('Profil güncellendi!');
    } catch (error) {
      toast.error('Giriş değerlerini kontrol edin');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      ad: currentPT?.ad || '',
      soyad: currentPT?.soyad || '',
      kullanici_adi: currentPT?.kullanici_adi || '',
      ders_basina_ucret: currentPT?.ders_basina_ucret || 200,
      uzmanlik_alani: currentPT?.uzmanlik_alani || '',
      yas: currentPT?.yas || '',
      profil_resmi_url: currentPT?.profil_resmi_url || IMAGES.PROFILE_MUCAHIT
    });
    setIsEditing(false);
  };

  const handlePhotoChange = (photoDataUrl) => {
    setEditData(prev => ({ ...prev, profil_resmi_url: photoDataUrl || '' }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in mb-20 md:mb-0 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3" />
            <span>Hesap Güvenliği Aktif</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-main tracking-tight">
            Eğitmen <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">Profili</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-lg leading-relaxed">
            Kişisel markanı yönet, uzmanlık alanlarını sergile ve performans metriklerini takip et.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary btn-magnetic btn-dark-bg flex items-center justify-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-sm shadow-lg hover:scale-[1.02]"
            >
              <Edit3 className="h-5 w-5 text-indigo-200" />
              <span>Profili Düzenle</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={handleCancel}
                className="btn-ghost flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[1.5rem] font-black text-sm"
              >
                <X className="h-5 w-5" />
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[1.5rem] font-black text-sm shadow-xl shadow-primary-500/20"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                  <>
                    <Save className="h-5 w-5" />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card rounded-[3rem] overflow-hidden border-none shadow-2xl sticky top-8">
            <div className="bg-slate-950 p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-indigo-900/40 opacity-50" />
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <div className="mb-6 inline-block">
                  <ProfilePhotoUpload
                    currentPhoto={editData.profil_resmi_url}
                    onPhotoChange={handlePhotoChange}
                    disabled={!isEditing}
                    theme="profile"
                  />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {isEditing ? `${editData.ad} ${editData.soyad}` : `${currentPT?.ad} ${currentPT?.soyad}`}
                </h2>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-[10px] font-black uppercase tracking-widest border border-white/10">
                  <Award className="h-3 w-3 mr-1.5 text-primary-400" />
                  Elite Personal Trainer
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary-500/10 transition-colors">
                    <Calendar className="h-5 w-5 text-slate-500 group-hover:text-primary-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">KAYIT TARİHİ</p>
                    <p className="text-sm font-bold text-main">{formatDate(currentPT?.kayit_tarihi)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-500/10 transition-colors">
                    <DollarSign className="h-5 w-5 text-slate-500 group-hover:text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SEANS ÜCRETİ</p>
                    <p className="text-sm font-bold text-main">{isEditing ? editData.ders_basina_ucret : currentPT?.ders_basina_ucret}₺ / Saat</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary-500/10 transition-colors">
                    <Zap className="h-5 w-5 text-slate-500 group-hover:text-primary-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AKTİF DURUM</p>
                    <div className="mt-1 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-lg shadow-emerald-500/20" />
                      <span className="text-sm font-bold text-emerald-500">AKTİF EĞİTMEN</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                <p className="text-xs font-medium text-slate-500 italic leading-relaxed">
                  "Sınırlarını aşmak için ihtiyacın olan tek şey, vazgeçmemek."
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'ÜYE PORTFÖYÜ', val: '24', icon: User, color: 'text-primary-500', bg: 'bg-primary-500/10' },
              { label: 'AYLIK SEANS', val: '142', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'MEMNUNİYET', val: '4.9', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' }
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-[2rem] p-6 border-none shadow-xl hover-lift">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-main leading-none">{stat.val}</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-[3rem] p-10 border-none shadow-2xl space-y-10">
            <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
              <div className="w-1.5 h-8 bg-primary-500 rounded-full" />
              <h3 className="text-xl font-black text-main tracking-tight uppercase">Kişisel Bilgiler</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfileFormField
                label="AD"
                name="ad"
                value={editData.ad}
                onChange={handleInputChange}
                isEditing={isEditing}
                displayValue={currentPT?.ad}
                required
                placeholder="Adınız"
              />
              <ProfileFormField
                label="SOYAD"
                name="soyad"
                value={editData.soyad}
                onChange={handleInputChange}
                isEditing={isEditing}
                displayValue={currentPT?.soyad}
                required
                placeholder="Soyadınız"
              />
              <ProfileFormField
                label="KULLANICI ADI"
                name="kullanici_adi"
                value={editData.kullanici_adi}
                onChange={handleInputChange}
                isEditing={isEditing}
                displayValue={`@${currentPT?.kullanici_adi}`}
                required
              />
              <ProfileFormField
                label="YAŞ"
                name="yas"
                type="number"
                value={editData.yas}
                onChange={handleInputChange}
                isEditing={isEditing}
                displayValue={currentPT?.yas ? `${currentPT.yas} Yaşında` : null}
              />
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 border-none shadow-2xl space-y-10">
            <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
              <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
              <h3 className="text-xl font-black text-main tracking-tight uppercase">Profesyonel Vizyon</h3>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileFormField
                  label="DERS BAŞINA ÜCRET"
                  name="ders_basina_ucret"
                  type="number"
                  value={editData.ders_basina_ucret}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                  displayValue={`${currentPT?.ders_basina_ucret} TL / Seans`}
                  icon={DollarSign}
                />
                <ProfileFormField
                  label="SERTİFİKA TARİHİ"
                  isEditing={false}
                  displayValue={formatDate(currentPT?.kayit_tarihi)}
                  icon={Calendar}
                />
              </div>
              <ProfileFormField
                label="UZMANLIK ALANI & TEKNİKLER"
                name="uzmanlik_alani"
                type="textarea"
                value={editData.uzmanlik_alani}
                onChange={handleInputChange}
                isEditing={isEditing}
                displayValue={currentPT?.uzmanlik_alani}
                rows={4}
                placeholder="Örn: Hipertrafi, HIIT, Rehabilitasyon..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
