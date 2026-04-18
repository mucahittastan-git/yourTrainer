import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X, Calendar, DollarSign, Activity, User } from 'lucide-react';
import { getFromLocalStorage, saveToLocalStorage, validateMusteriForm, formatDate, hesaplaTahminiBitisTarihi, hesaplaToplamUcret } from '../utils/helpers';
import { useToast } from '../utils/ToastContext';
import SuccessModal from '../components/SuccessModal';
import { haftaninGunleri } from '../assets/constants/app';
import { syncClientToApi } from '../utils/api';

const ClientEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    yas: '',
    alinan_ders_sayisi: '',
    ders_basina_ucret: 200,
    toplam_ucret: 0,
    ders_baslangic_tarihi: '',
    tahmini_bitis_tarihi: null,
    haftalik_ders_gunleri: [],
    vucut_olculeri: {
      boy: '',
      kilo: '',
      bel: '',
      kalca: '',
      gogus: ''
    },
    notlar: ''
  });

  // Müşteri bilgilerini yükle
  useEffect(() => {
    const loadMusteri = () => {
      try {
        const musteriler = getFromLocalStorage('musteriler', []);
        const musteri = musteriler.find(m => m.id === parseInt(id));
        
        if (musteri) {
          setFormData({
            ad: musteri.ad || '',
            soyad: musteri.soyad || '',
            yas: musteri.yas || '',
            alinan_ders_sayisi: musteri.alinan_ders_sayisi || '',
            ders_basina_ucret: musteri.ders_basina_ucret || 200,
            toplam_ucret: musteri.toplam_ucret || 0,
            ders_baslangic_tarihi: musteri.ders_baslangic_tarihi || '',
            tahmini_bitis_tarihi: musteri.tahmini_bitis_tarihi || null,
            haftalik_ders_gunleri: musteri.haftalik_ders_gunleri || [],
            vucut_olculeri: {
              boy: musteri.vucut_olculeri?.boy || '',
              kilo: musteri.vucut_olculeri?.kilo || '',
              bel: musteri.vucut_olculeri?.bel || '',
              kalca: musteri.vucut_olculeri?.kalca || '',
              gogus: musteri.vucut_olculeri?.gogus || ''
            },
            notlar: musteri.notlar || ''
          });
        } else {
          toast.error('Müşteri bulunamadı');
          navigate('/clients/list');
        }
      } catch (error) {
        toast.error('Müşteri verileri yüklenirken hata oluştu');
        navigate('/clients/list');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMusteri();
    }
  }, [id, navigate, toast]);

  // Toplam ücret hesaplama
  useEffect(() => {
    if (formData.alinan_ders_sayisi && formData.ders_basina_ucret) {
      const toplam = hesaplaToplamUcret(
        parseInt(formData.alinan_ders_sayisi), 
        formData.ders_basina_ucret
      );
      setFormData(prev => ({ ...prev, toplam_ucret: toplam }));
    }
  }, [formData.alinan_ders_sayisi, formData.ders_basina_ucret]);

  // Tahmini bitiş tarihi hesaplama
  useEffect(() => {
    if (formData.ders_baslangic_tarihi && formData.alinan_ders_sayisi && formData.haftalik_ders_gunleri.length > 0) {
      const bitisTarihi = hesaplaTahminiBitisTarihi(
        formData.ders_baslangic_tarihi,
        parseInt(formData.alinan_ders_sayisi),
        formData.haftalik_ders_gunleri
      );
      setFormData(prev => ({ ...prev, tahmini_bitis_tarihi: bitisTarihi }));
    }
  }, [formData.ders_baslangic_tarihi, formData.alinan_ders_sayisi, formData.haftalik_ders_gunleri]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Error'ı temizle
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleOlcuChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vucut_olculeri: {
        ...prev.vucut_olculeri,
        [name]: value
      }
    }));
  };

  const handleGunSecimi = (gunValue) => {
    const mevcutGunler = formData.haftalik_ders_gunleri || [];
    let yeniGunler;
    
    if (mevcutGunler.includes(gunValue)) {
      yeniGunler = mevcutGunler.filter(gun => gun !== gunValue);
    } else {
      yeniGunler = [...mevcutGunler, gunValue];
    }
    
    setFormData(prev => ({ ...prev, haftalik_ders_gunleri: yeniGunler }));
    
    if (errors.haftalik_ders_gunleri) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.haftalik_ders_gunleri;
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Validasyon
      const validation = validateMusteriForm(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error('Lütfen tüm gerekli alanları kontrol edin');
        setSaving(false);
        return;
      }

      // Müşteriyi güncelle
      const musteriler = getFromLocalStorage('musteriler', []);
      const guncellenmisMusteriler = musteriler.map(musteri => {
        if (musteri.id === parseInt(id)) {
          return {
            ...musteri,
            ...formData,
            guncelleme_tarihi: new Date().toISOString()
          };
        }
        return musteri;
      });

      saveToLocalStorage('musteriler', guncellenmisMusteriler);
      
      const musteriData = guncellenmisMusteriler.find(m => m.id === parseInt(id));
      if (musteriData) {
        await syncClientToApi(musteriData, 'PUT');
      }
      
      // Success modal'ı göster
      setShowSuccessModal(true);
      
      // Toast notification
      toast.success('Müşteri bilgileri güncellendi', {
        title: 'Başarılı!',
        duration: 4000
      });

    } catch (error) {
      console.error('Müşteri güncelleme hatası:', error);
      toast.error('Müşteri güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate(`/clients/${id}`);
  };

  // BMI hesaplama
  const hesaplaBMI = () => {
    const boy = parseFloat(formData.vucut_olculeri?.boy);
    const kilo = parseFloat(formData.vucut_olculeri?.kilo);
    
    if (boy && kilo && boy > 0) {
      const boyMetre = boy / 100;
      const bmi = kilo / (boyMetre * boyMetre);
      return bmi.toFixed(1);
    }
    return null;
  };

  const bmi = hesaplaBMI();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Müşteri bilgileri yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {/* Mobil: İlk satır - Geri buton ve başlık */}
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to={`/clients/${id}`}
            className="btn-icon flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Müşteri Düzenle</h1>
            <p className="text-sm sm:text-base text-slate-500 truncate">{formData.ad} {formData.soyad} - Bilgileri Güncelle</p>
          </div>
        </div>
        
        {/* Mobil: İkinci satır - Action Buttons */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 sm:justify-end">
          <Link
            to={`/clients/${id}`}
            className="btn-ghost inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black min-w-0"
          >
            <X className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">İptal</span>
          </Link>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-success inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black min-w-0"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin flex-shrink-0" />
                <span className="truncate">Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Kaydet</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Kişisel Bilgiler */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Kişisel Bilgiler
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="ad" className="block text-sm font-medium text-gray-700 mb-2">
                Müşteri Adı *
              </label>
              <input
                type="text"
                id="ad"
                name="ad"
                value={formData.ad}
                onChange={handleInputChange}
                className={`input-field ${errors.ad ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Örn: Ayşe"
              />
              {errors.ad && <p className="mt-1 text-sm text-red-600">{errors.ad}</p>}
            </div>

            <div>
              <label htmlFor="soyad" className="block text-sm font-medium text-gray-700 mb-2">
                Müşteri Soyadı *
              </label>
              <input
                type="text"
                id="soyad"
                name="soyad"
                value={formData.soyad}
                onChange={handleInputChange}
                className={`input-field ${errors.soyad ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Örn: Demir"
              />
              {errors.soyad && <p className="mt-1 text-sm text-red-600">{errors.soyad}</p>}
            </div>

            <div>
              <label htmlFor="yas" className="block text-sm font-medium text-gray-700 mb-2">
                Müşteri Yaşı *
              </label>
              <input
                type="number"
                id="yas"
                name="yas"
                min="16"
                max="80"
                value={formData.yas}
                onChange={handleInputChange}
                className={`input-field ${errors.yas ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="25"
              />
              {errors.yas && <p className="mt-1 text-sm text-red-600">{errors.yas}</p>}
            </div>
          </div>
        </div>

        {/* Ders Bilgileri */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Ders Bilgileri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="alinan_ders_sayisi" className="block text-sm font-medium text-gray-700 mb-2">
                Satın Alınan Özel Ders Sayısı *
              </label>
              <input
                type="number"
                id="alinan_ders_sayisi"
                name="alinan_ders_sayisi"
                min="1"
                max="200"
                value={formData.alinan_ders_sayisi}
                onChange={handleInputChange}
                className={`input-field ${errors.alinan_ders_sayisi ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="40"
              />
              {errors.alinan_ders_sayisi && <p className="mt-1 text-sm text-red-600">{errors.alinan_ders_sayisi}</p>}
            </div>

            <div>
              <label htmlFor="ders_basina_ucret" className="block text-sm font-medium text-gray-700 mb-2">
                Ders Başına Ücret (TL)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  id="ders_basina_ucret"
                  name="ders_basina_ucret"
                  min="50"
                  max="1000"
                  value={formData.ders_basina_ucret}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özel Ders Toplam Ücreti
              </label>
              <div className="input-field bg-gray-50 text-gray-700 font-medium">
                {formData.toplam_ucret ? `${formData.toplam_ucret.toLocaleString('tr-TR')} TL` : '0 TL'}
              </div>
            </div>

            <div>
              <label htmlFor="ders_baslangic_tarihi" className="block text-sm font-medium text-gray-700 mb-2">
                Özel Ders Başlangıç Tarihi *
              </label>
              <input
                type="date"
                id="ders_baslangic_tarihi"
                name="ders_baslangic_tarihi"
                value={formData.ders_baslangic_tarihi}
                onChange={handleInputChange}
                className={`input-field ${errors.ders_baslangic_tarihi ? 'border-red-300 focus:ring-red-500' : ''}`}
              />
              {errors.ders_baslangic_tarihi && <p className="mt-1 text-sm text-red-600">{errors.ders_baslangic_tarihi}</p>}
            </div>
          </div>

          {/* Haftalık Ders Günleri */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Haftalık Ders Günleri Seçimi *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {haftaninGunleri.map((gun) => {
                const isSelected = formData.haftalik_ders_gunleri?.includes(gun.value);
                return (
                  <button
                    key={gun.value}
                    type="button"
                    onClick={() => handleGunSecimi(gun.value)}
                    className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors duration-200 ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    {gun.label}
                  </button>
                );
              })}
            </div>
            {errors.haftalik_ders_gunleri && <p className="mt-2 text-sm text-red-600">{errors.haftalik_ders_gunleri}</p>}
          </div>

          {/* Tahmini Bitiş Tarihi */}
          {formData.tahmini_bitis_tarihi && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Tahmini Bitiş Tarihi</h4>
              <p className="text-blue-700">{formatDate(formData.tahmini_bitis_tarihi)}</p>
            </div>
          )}
        </div>

        {/* Vücut Ölçüleri */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Vücut Ölçüleri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="boy" className="block text-sm font-medium text-gray-700 mb-2">
                Boy (cm)
              </label>
              <input
                type="number"
                id="boy"
                name="boy"
                min="140"
                max="220"
                step="0.1"
                value={formData.vucut_olculeri?.boy || ''}
                onChange={handleOlcuChange}
                className="input-field"
                placeholder="170"
              />
            </div>

            <div>
              <label htmlFor="kilo" className="block text-sm font-medium text-gray-700 mb-2">
                Kilo (kg)
              </label>
              <input
                type="number"
                id="kilo"
                name="kilo"
                min="40"
                max="200"
                step="0.1"
                value={formData.vucut_olculeri?.kilo || ''}
                onChange={handleOlcuChange}
                className="input-field"
                placeholder="70"
              />
            </div>

            {bmi && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BMI</label>
                <div className="input-field bg-gray-50 text-gray-700 font-medium">
                  {bmi}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="bel" className="block text-sm font-medium text-gray-700 mb-2">
                Bel Çevresi (cm)
              </label>
              <input
                type="number"
                id="bel"
                name="bel"
                min="50"
                max="150"
                step="0.1"
                value={formData.vucut_olculeri?.bel || ''}
                onChange={handleOlcuChange}
                className="input-field"
                placeholder="80"
              />
            </div>

            <div>
              <label htmlFor="kalca" className="block text-sm font-medium text-gray-700 mb-2">
                Kalça Çevresi (cm)
              </label>
              <input
                type="number"
                id="kalca"
                name="kalca"
                min="60"
                max="160"
                step="0.1"
                value={formData.vucut_olculeri?.kalca || ''}
                onChange={handleOlcuChange}
                className="input-field"
                placeholder="95"
              />
            </div>

            <div>
              <label htmlFor="gogus" className="block text-sm font-medium text-gray-700 mb-2">
                Göğüs Çevresi (cm)
              </label>
              <input
                type="number"
                id="gogus"
                name="gogus"
                min="60"
                max="150"
                step="0.1"
                value={formData.vucut_olculeri?.gogus || ''}
                onChange={handleOlcuChange}
                className="input-field"
                placeholder="85"
              />
            </div>
          </div>
        </div>

        {/* Notlar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ek Notlar</h2>
          
          <div>
            <label htmlFor="notlar" className="block text-sm font-medium text-gray-700 mb-2">
              Müşteri Hakkında Notlar
            </label>
            <textarea
              id="notlar"
              name="notlar"
              rows={4}
              value={formData.notlar || ''}
              onChange={handleInputChange}
              className="input-field resize-none"
              placeholder="Müşteriyle ilgili özel notlar, sağlık durumu, hedefler vb..."
            />
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Müşteri Güncellendi!"
        message={`${formData.ad} ${formData.soyad} adlı müşterinin bilgileri başarıyla güncellendi.`}
        duration={4000}
      />
    </div>
  );
};

export default ClientEditPage;
