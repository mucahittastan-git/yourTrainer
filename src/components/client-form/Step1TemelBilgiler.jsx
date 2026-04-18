import React, { useEffect, useMemo, memo } from 'react';
import { Calendar, DollarSign, Clock, Users, User, Calculator, Phone } from 'lucide-react';
import { hesaplaTahminiBitisTarihi, hesaplaToplamUcret, formatDate } from '../../utils/helpers';
import FormField from '../form/FormField';
import DaySelector from '../form/DaySelector';

const Step1TemelBilgiler = memo(({ formData, updateFormData, errors, setErrors }) => {
  
  // Toplam ücret hesaplama (ders sayısı değiştiğinde)
  useEffect(() => {
    if (formData.alinan_ders_sayisi && formData.ders_basina_ucret) {
      const toplam = hesaplaToplamUcret(
        parseInt(formData.alinan_ders_sayisi), 
        formData.ders_basina_ucret
      );
      updateFormData({ toplam_ucret: toplam });
    }
  }, [formData.alinan_ders_sayisi, formData.ders_basina_ucret, updateFormData]);

  // Tahmini bitiş tarihi hesaplama
  useEffect(() => {
    if (
      formData.ders_baslangic_tarihi && 
      formData.alinan_ders_sayisi && 
      formData.haftalik_ders_gunleri.length > 0
    ) {
      const bitisTarihi = hesaplaTahminiBitisTarihi(
        formData.ders_baslangic_tarihi,
        parseInt(formData.alinan_ders_sayisi),
        formData.haftalik_ders_gunleri
      );
      updateFormData({ tahmini_bitis_tarihi: bitisTarihi });
    }
  }, [formData.ders_baslangic_tarihi, formData.alinan_ders_sayisi, formData.haftalik_ders_gunleri, updateFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Error'ı temizle
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // `handleFieldUpdate` removed: `handleInputChange` covers the same use-case

  const handleGunSecimi = (gunler) => {
    updateFormData({ haftalik_ders_gunleri: gunler });
    
    // Error'ı temizle
    if (errors.haftalik_ders_gunleri) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.haftalik_ders_gunleri;
        return newErrors;
      });
    }
  };

  // Program özeti hesaplama
  const programSummary = useMemo(() => {
    if (!formData.alinan_ders_sayisi || !formData.haftalik_ders_gunleri?.length) return null;
    
    const totalLessons = parseInt(formData.alinan_ders_sayisi);
    const weeklyDays = formData.haftalik_ders_gunleri.length;
    const approximateWeeks = Math.ceil(totalLessons / weeklyDays);
    
    return {
      totalLessons,
      weeklyDays,
      approximateWeeks
    };
  }, [formData.alinan_ders_sayisi, formData.haftalik_ders_gunleri]);

  // Bugünün tarihi (minimum tarih için)
  const bugun = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-200">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Temel Bilgiler</h2>
        <p className="text-gray-600">Üyenizin kişisel ve ders bilgilerini girin</p>
      </div>

      {/* Ad Soyad Satırı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Üye Adı"
          name="ad"
          value={formData.ad}
          onChange={handleInputChange}
          error={errors.ad}
          required
          placeholder="Örn: Ayşe"
          icon={User}
          autoFocus
        />

        <FormField
          label="Üye Soyadı"
          name="soyad"
          value={formData.soyad}
          onChange={handleInputChange}
          error={errors.soyad}
          required
          placeholder="Örn: Demir"
          icon={User}
        />
      </div>

      {/* Yaş ve Telefon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Üye Yaşı"
          name="yas"
          type="number"
          value={formData.yas}
          onChange={handleInputChange}
          error={errors.yas}
          required
          min="16"
          max="80"
          placeholder="25"
          helpText="14-80 yaş arası"
        />

        <FormField
          label="Telefon Numarası"
          name="telefon"
          type="tel"
          value={formData.telefon}
          onChange={handleInputChange}
          error={errors.telefon}
          placeholder="905551234567"
          icon={Phone}
          helpText="WhatsApp için gerekli"
        />
      </div>

      {/* Ders Sayısı */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <FormField
          label="Alınan Ders Sayısı"
          name="alinan_ders_sayisi"
          type="number"
          value={formData.alinan_ders_sayisi}
          onChange={handleInputChange}
          error={errors.alinan_ders_sayisi}
          required
          min="1"
          max="200"
          placeholder="40"
          icon={Users}
          helpText="1-200 ders arası"
        />
      </div>

      {/* Ücret Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Ders Başına Ücret (TL)"
          name="ders_basina_ucret"
          type="number"
          value={formData.ders_basina_ucret}
          onChange={handleInputChange}
          min="50"
          max="1000"
          placeholder="200"
          icon={DollarSign}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Toplam Ücret
          </label>
          <div className="relative">
            <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <div className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium">
              {formData.toplam_ucret ? `${formData.toplam_ucret.toLocaleString('tr-TR')} TL` : '0 TL'}
            </div>
          </div>
          <p className="text-xs text-gray-500">Otomatik hesaplanır</p>
        </div>
      </div>

      {/* Tarih Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Başlangıç Tarihi"
          name="ders_baslangic_tarihi"
          type="date"
          value={formData.ders_baslangic_tarihi}
          onChange={handleInputChange}
          error={errors.ders_baslangic_tarihi}
          required
          min={bugun}
          icon={Calendar}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tahmini Bitiş Tarihi
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <div className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {formData.tahmini_bitis_tarihi 
                ? formatDate(formData.tahmini_bitis_tarihi)
                : 'Otomatik hesaplanacak'
              }
            </div>
          </div>
          <p className="text-xs text-gray-500">Program günlerine göre hesaplanır</p>
        </div>
      </div>

      {/* Haftalık Ders Günleri */}
      <DaySelector
        selectedDays={formData.haftalik_ders_gunleri}
        onChange={handleGunSecimi}
        error={errors.haftalik_ders_gunleri}
      />

      {/* Program Summary */}
      {programSummary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 card-animate">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Clock className="h-6 w-6 text-blue-600 mt-1" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Program Özeti</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/50 rounded-lg p-3 text-center hover-lift">
                  <div className="text-2xl font-bold text-blue-600">{programSummary.totalLessons}</div>
                  <div className="text-sm text-blue-700">Toplam Ders</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3 text-center hover-lift">
                  <div className="text-2xl font-bold text-blue-600">{programSummary.weeklyDays}</div>
                  <div className="text-sm text-blue-700">Haftalık Gün</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3 text-center hover-lift">
                  <div className="text-2xl font-bold text-blue-600">~{programSummary.approximateWeeks}</div>
                  <div className="text-sm text-blue-700">Hafta Süre</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Step1TemelBilgiler.displayName = 'Step1TemelBilgiler';

export default Step1TemelBilgiler;
