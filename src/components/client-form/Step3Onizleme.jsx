import React from 'react';
import { User, Calendar, DollarSign, Activity, FileText, Clock, Users } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const Step3Onizleme = ({ formData, loading }) => {
  
  const bilgiSeksiylari = [
    {
      baslik: 'Kişisel Bilgiler',
      icon: User,
      items: [
        { label: 'Ad Soyad', value: `${formData.ad} ${formData.soyad}` },
        { label: 'Yaş', value: `${formData.yas} yaşında` },
      ]
    },
    {
      baslik: 'Ders Bilgileri',
      icon: Calendar,
      items: [
        { label: 'Alınan Ders Sayısı', value: `${formData.alinan_ders_sayisi} ders` },
        { label: 'Ders Başına Ücret', value: `${formData.ders_basina_ucret} TL` },
        { label: 'Toplam Ücret', value: `${formData.toplam_ucret?.toLocaleString('tr-TR')} TL`, highlighted: true },
        { label: 'Başlangıç Tarihi', value: formatDate(formData.ders_baslangic_tarihi) },
        { label: 'Tahmini Bitiş Tarihi', value: formData.tahmini_bitis_tarihi ? formatDate(formData.tahmini_bitis_tarihi) : 'Hesaplanmadı' },
      ]
    },
    {
      baslik: 'Haftalık Program',
      icon: Clock,
      items: [
        { 
          label: 'Ders Günleri', 
          value: formData.haftalik_ders_gunleri?.join(', ') || 'Seçilmedi' 
        },
        { 
          label: 'Haftalık Ders Sayısı', 
          value: `${formData.haftalik_ders_gunleri?.length || 0} gün` 
        },
        {
          label: 'Tahmini Süre',
          value: formData.alinan_ders_sayisi && formData.haftalik_ders_gunleri?.length 
            ? `${Math.ceil(formData.alinan_ders_sayisi / formData.haftalik_ders_gunleri.length)} hafta`
            : 'Hesaplanmadı'
        }
      ]
    }
  ];

  // Vücut ölçüleri varsa ekle
  if (formData.vucut_olculeri && Object.values(formData.vucut_olculeri).some(value => value)) {
    const vucutOlculeri = {
      baslik: 'Vücut Ölçüleri',
      icon: Activity,
      items: []
    };

    if (formData.vucut_olculeri.boy) {
      vucutOlculeri.items.push({ label: 'Boy', value: `${formData.vucut_olculeri.boy} cm` });
    }
    if (formData.vucut_olculeri.kilo) {
      vucutOlculeri.items.push({ label: 'Kilo', value: `${formData.vucut_olculeri.kilo} kg` });
    }
    if (formData.vucut_olculeri.bel) {
      vucutOlculeri.items.push({ label: 'Bel Çevresi', value: `${formData.vucut_olculeri.bel} cm` });
    }
    if (formData.vucut_olculeri.kalca) {
      vucutOlculeri.items.push({ label: 'Kalça Çevresi', value: `${formData.vucut_olculeri.kalca} cm` });
    }
    if (formData.vucut_olculeri.gogus) {
      vucutOlculeri.items.push({ label: 'Göğüs Çevresi', value: `${formData.vucut_olculeri.gogus} cm` });
    }

    // BMI hesaplama
    if (formData.vucut_olculeri.boy && formData.vucut_olculeri.kilo) {
      const boy = parseFloat(formData.vucut_olculeri.boy);
      const kilo = parseFloat(formData.vucut_olculeri.kilo);
      const boyMetre = boy / 100;
      const bmi = (kilo / (boyMetre * boyMetre)).toFixed(1);
      vucutOlculeri.items.push({ label: 'BMI', value: bmi, highlighted: true });
    }

    bilgiSeksiylari.push(vucutOlculeri);
  }

  // Notlar varsa ekle
  if (formData.notlar?.trim()) {
    bilgiSeksiylari.push({
      baslik: 'Ek Notlar',
      icon: FileText,
      items: [
        { label: 'Not', value: formData.notlar, isNote: true }
      ]
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Bilgileri Kontrol Et</h2>
        <p className="text-gray-600">
          Aşağıdaki bilgileri kontrol edin ve doğruysa <strong>Üyeliği Tamamla</strong> butonuna tıklayın.
        </p>
      </div>

      {/* Özet Kartı */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <User className="h-8 w-8" />
          <div>
            <h3 className="text-xl font-bold">{formData.ad} {formData.soyad}</h3>
            <p className="text-primary-100">{formData.yas} yaşında</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Toplam Ders</span>
            </div>
            <p className="text-2xl font-bold mt-1">{formData.alinan_ders_sayisi}</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Toplam Ücret</span>
            </div>
            <p className="text-2xl font-bold mt-1">{formData.toplam_ucret?.toLocaleString('tr-TR')} ₺</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Haftalık</span>
            </div>
            <p className="text-2xl font-bold mt-1">{formData.haftalik_ders_gunleri?.length || 0} gün</p>
          </div>
        </div>
      </div>

      {/* Detaylı Bilgi Seksiyonları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bilgiSeksiylari.map((seksiy, index) => {
          const Icon = seksiy.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">{seksiy.baslik}</h3>
              </div>
              
              <div className="space-y-3">
                {seksiy.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-start">
                    <span className="text-sm text-gray-600 font-medium">
                      {item.label}:
                    </span>
                    <span className={`text-sm text-right max-w-xs ${
                      item.highlighted 
                        ? 'font-bold text-primary-700' 
                        : item.isNote 
                          ? 'text-gray-700 text-xs leading-relaxed'
                          : 'text-gray-900'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Uyarı Mesajı */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-amber-800">Önemli Bilgi</h4>
            <div className="mt-1 text-sm text-amber-700">
              <p>Üyelik kaydı tamamlandıktan sonra Üyeniz sisteme eklenecektir. 
              Bilgilerde değişiklik yapmak için geri tuşlarını kullanabilirsiniz.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-700 font-medium">Üyelik kaydediliyor...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3Onizleme;
