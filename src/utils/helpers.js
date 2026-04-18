// Date utility functions (basit JavaScript Date kullanımı)
const formatDateLocale = (date, _formatString = 'dd.MM.yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}.${month}.${year}`;
};

// Tarih formatlamaları
export const formatDate = (date, formatString = 'dd.MM.yyyy') => {
  return formatDateLocale(date, formatString);
};

// Haftalık ders günlerine göre tahmini bitiş tarihi hesaplama
export const hesaplaTahminiBitisTarihi = (baslangicTarihi, toplamDers, haftalikGunler) => {
  if (!baslangicTarihi || !toplamDers || !haftalikGunler || haftalikGunler.length === 0) {
    return null;
  }

  const baslangic = typeof baslangicTarihi === 'string' ? new Date(baslangicTarihi) : baslangicTarihi;
  const gunlerMap = {
    'Pazartesi': 1,
    'Salı': 2,
    'Çarşamba': 3,
    'Perşembe': 4,
    'Cuma': 5,
    'Cumartesi': 6,
    'Pazar': 0
  };

  const secilenGunNumaralari = haftalikGunler.map(gun => gunlerMap[gun]).sort();
  let mevcutTarih = new Date(baslangic);
  let tamamlananDers = 0;

  // İlk ders gününü bul
  while (!secilenGunNumaralari.includes(mevcutTarih.getDay())) {
    mevcutTarih.setDate(mevcutTarih.getDate() + 1);
  }

  // Dersleri say
  while (tamamlananDers < toplamDers) {
    if (secilenGunNumaralari.includes(mevcutTarih.getDay())) {
      tamamlananDers++;
      if (tamamlananDers === toplamDers) {
        return mevcutTarih;
      }
    }
    mevcutTarih.setDate(mevcutTarih.getDate() + 1);
  }

  return mevcutTarih;
};

// Form validasyonları
export const validateMusteriForm = (formData) => {
  const errors = {};

  // Adım 1 validasyonları
  if (!formData.ad || formData.ad.trim().length < 2) {
    errors.ad = 'Ad en az 2 karakter olmalı';
  }

  if (!formData.soyad || formData.soyad.trim().length < 2) {
    errors.soyad = 'Soyad en az 2 karakter olmalı';
  }

  if (!formData.yas || formData.yas < 16 || formData.yas > 80) {
    errors.yas = 'Yaş 14-80 arasında olmalı';
  }

  if (!formData.alinan_ders_sayisi || formData.alinan_ders_sayisi < 1 || formData.alinan_ders_sayisi > 200) {
    errors.alinan_ders_sayisi = 'Ders sayısı 1-200 arasında olmalı';
  }

  if (!formData.ders_baslangic_tarihi) {
    errors.ders_baslangic_tarihi = 'Başlangıç tarihi seçilmeli';
  }

  if (!formData.haftalik_ders_gunleri || formData.haftalik_ders_gunleri.length === 0) {
    errors.haftalik_ders_gunleri = 'En az bir ders günü seçilmeli';
  }

  // Telefon numarası validasyonu (opsiyonel ama eğer girilmişse geçerli olmalı)
  if (formData.telefon && formData.telefon.trim()) {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    const cleanPhone = formData.telefon.replace(/\D/g, '');
    
    if (!phoneRegex.test(formData.telefon) || cleanPhone.length < 10) {
      errors.telefon = 'Geçerli bir telefon numarası girin (min 10 haneli)';
    }
  }

  // Adım 2 validasyonları
  if (formData.vucut_olculeri) {
    const { boy, kilo } = formData.vucut_olculeri;
    
    if (boy && (boy < 140 || boy > 220)) {
      errors.boy = 'Boy 140-220 cm arasında olmalı';
    }

    if (kilo && (kilo < 40 || kilo > 200)) {
      errors.kilo = 'Kilo 40-200 kg arasında olmalı';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Local Storage işlemleri
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('LocalStorage kayıt hatası:', error);
    return false;
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('LocalStorage okuma hatası:', error);
    return defaultValue;
  }
};

// Ücret hesaplama
export const hesaplaToplamUcret = (dersSayisi, dersBaginaUcret) => {
  return dersSayisi * dersBaginaUcret;
};

// Kullanıcı adı otomatik üretme
export const generateUsername = (ad, soyad) => {
  if (!ad || !soyad) return '';
  
  // Türkçe karakterleri değiştir
  const turkishChars = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };
  
  const convertTurkish = (str) => {
    return str.replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => turkishChars[match] || match);
  };
  
  // Ad ve soyadı temizle
  const cleanAd = convertTurkish(ad.trim().toLowerCase());
  const cleanSoyad = convertTurkish(soyad.trim().toLowerCase());
  
  // Kullanıcı adı formatı: ad_soyad
  const username = `${cleanAd}_${cleanSoyad}`;
  
  // Sadece harf ve alt çizgi kalacak şekilde temizle
  return username.replace(/[^a-z_]/g, '');
};

// Toast notification için (geçici - useToast kullanın)
export const showNotification = (message, type = 'success') => {
  // Bu fonksiyon artık deprecated, direkt useToast hook'u kullanın
  console.warn('showNotification deprecated, use useToast hook instead');
  if (type === 'success') {
    alert(`✅ ${message}`);
  } else if (type === 'error') {
    alert(`❌ ${message}`);
  } else {
    alert(message);
  }
};
