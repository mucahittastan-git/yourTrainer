// Lesson Plan Generators
import { LESSON_STATUS } from '../data/lessonsData';
import { generateLessonId, saveLessonsToStorage, getLessonsFromStorage } from './lessonHelpers';

/**
 * Yeni müşteri için otomatik ders planı oluşturur
 * @param {Object} clientData - Müşteri bilgileri
 * @param {number} ptId - PT ID
 * @returns {Array} Oluşturulan dersler listesi
 */
export const generateLessonPlan = (clientData, ptId) => {
  const {
    id: clientId,
    ders_baslangic_tarihi,
    alinan_ders_sayisi,
    haftalik_ders_gunleri
  } = clientData;

  if (!ders_baslangic_tarihi || !alinan_ders_sayisi || !haftalik_ders_gunleri?.length) {
    throw new Error('Ders planı oluşturmak için gerekli bilgiler eksik');
  }

  const lessons = [];
  const startDate = new Date(ders_baslangic_tarihi);
  const totalLessons = parseInt(alinan_ders_sayisi);
  const weeklyDays = haftalik_ders_gunleri;
  
  // Weekday mapping handled via gunlerMap below; removed unused dayMapping

  // Default lesson times for each day
  const defaultTimes = {
    'Pazartesi': '09:00',
    'Salı': '10:00',
    'Çarşamba': '14:00', 
    'Perşembe': '15:00',
    'Cuma': '16:00',
    'Cumartesi': '10:00',
    'Pazar': '11:00'
  };

  let lessonsCreated = 0;
  let currentDate = new Date(startDate);
  
  // Move to the first lesson day if start date is not a lesson day
  while (lessonsCreated < totalLessons) {
    const currentDayName = getDayNameFromDate(currentDate);
    
    if (weeklyDays.includes(currentDayName)) {
      // Create lesson for this day
      const lesson = {
        id: generateLessonId(),
        musteri_id: clientId,
        pt_id: ptId,
        
        // Planned info
        planlanan_tarih: currentDate.toISOString().split('T')[0],
        planlanan_saat: defaultTimes[currentDayName] || '14:00',
        planlanan_gun: currentDayName,
        
        // Actual info (will be filled when lesson is completed)
        gercek_tarih: null,
        gercek_saat: null,
        
        // Status
        durum: LESSON_STATUS.PLANNED,
        
        // Content (empty initially)
        ders_notlari: "",
        egzersizler: [],
        zorluk_seviyesi: null,
        performance_rating: null,
        
        // Metadata
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      lessons.push(lesson);
      lessonsCreated++;
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
    
    // Safety check to prevent infinite loop
    if (currentDate.getFullYear() > startDate.getFullYear() + 2) {
      console.warn('Lesson plan generation stopped - date exceeded 2 years');
      break;
    }
  }
  
  // Save lessons to localStorage
  const existingLessons = getLessonsFromStorage();
  const allLessons = [...existingLessons, ...lessons];
  saveLessonsToStorage(allLessons);
  
  return lessons;
};

/**
 * Müşteri bilgileri güncellendiğinde ders planını günceller
 * @param {number} clientId - Müşteri ID
 * @param {Object} updatedClientData - Güncellenmiş müşteri bilgileri
 * @param {number} ptId - PT ID
 * @returns {Object} Güncelleme sonucu
 */
export const updateLessonPlan = (clientId, updatedClientData, ptId) => {
  const existingLessons = getLessonsFromStorage();
  const clientLessons = existingLessons.filter(lesson => lesson.musteri_id === clientId);
  
  // Tamamlanmış/iptal edilmiş dersleri koru, sadece planlanmış dersleri güncelle
  const completedLessons = clientLessons.filter(lesson => 
    lesson.durum !== LESSON_STATUS.PLANNED
  );
  
  const plannedLessons = clientLessons.filter(lesson => 
    lesson.durum === LESSON_STATUS.PLANNED
  );
  
  // Yeni ders sayısına göre plan oluştur
  const {
    ders_baslangic_tarihi,
    alinan_ders_sayisi,
    haftalik_ders_gunleri
  } = updatedClientData;
  
  const totalNeeded = parseInt(alinan_ders_sayisi);
  const completedCount = completedLessons.length;
  const remainingNeeded = totalNeeded - completedCount;
  
  if (remainingNeeded <= 0) {
    // Tüm dersler tamamlanmış, planlanmış dersleri sil
    const otherLessons = existingLessons.filter(lesson => lesson.musteri_id !== clientId);
    const finalLessons = [...otherLessons, ...completedLessons];
    saveLessonsToStorage(finalLessons);
    
    return {
      success: true,
      message: 'Tüm dersler tamamlanmış',
      lessonsRemoved: plannedLessons.length,
      lessonsAdded: 0
    };
  }
  
  // Son tamamlanan dersten sonra yeni plan oluştur
  let startDate = new Date(ders_baslangic_tarihi);
  
  if (completedLessons.length > 0) {
    // Son tamamlanan dersten bir gün sonra başla
    const lastCompletedDate = completedLessons
      .sort((a, b) => new Date(b.gercek_tarih || b.planlanan_tarih) - new Date(a.gercek_tarih || a.planlanan_tarih))[0];
    
    startDate = new Date(lastCompletedDate.gercek_tarih || lastCompletedDate.planlanan_tarih);
    startDate.setDate(startDate.getDate() + 1);
  }
  
  // Yeni planlanmış dersleri oluştur
  const newPlannedLessons = generateLessonPlanFromDate(
    clientId,
    ptId,
    startDate,
    remainingNeeded,
    haftalik_ders_gunleri
  );
  
  // Eski planlanmış dersleri sil, yenilerini ekle
  const otherLessons = existingLessons.filter(lesson => 
    lesson.musteri_id !== clientId || lesson.durum !== LESSON_STATUS.PLANNED
  );
  
  const finalLessons = [...otherLessons, ...completedLessons, ...newPlannedLessons];
  saveLessonsToStorage(finalLessons);
  
  return {
    success: true,
    message: 'Ders planı güncellendi',
    lessonsRemoved: plannedLessons.length,
    lessonsAdded: newPlannedLessons.length,
    newLessons: newPlannedLessons
  };
};

/**
 * Belirli bir tarihten itibaren ders planı oluşturur
 * @param {number} clientId - Müşteri ID
 * @param {number} ptId - PT ID  
 * @param {Date} startDate - Başlangıç tarihi
 * @param {number} lessonCount - Oluşturulacak ders sayısı
 * @param {Array} weeklyDays - Haftalık ders günleri
 * @returns {Array} Oluşturulan dersler
 */
export const generateLessonPlanFromDate = (clientId, ptId, startDate, lessonCount, weeklyDays) => {
  const lessons = [];
  const currentDate = new Date(startDate);
  
  const defaultTimes = {
    'Pazartesi': '09:00',
    'Salı': '10:00', 
    'Çarşamba': '14:00',
    'Perşembe': '15:00',
    'Cuma': '16:00',
    'Cumartesi': '10:00',
    'Pazar': '11:00'
  };
  
  let lessonsCreated = 0;
  
  while (lessonsCreated < lessonCount) {
    const currentDayName = getDayNameFromDate(currentDate);
    
    if (weeklyDays.includes(currentDayName)) {
      const lesson = {
        id: generateLessonId(),
        musteri_id: clientId,
        pt_id: ptId,
        
        planlanan_tarih: currentDate.toISOString().split('T')[0],
        planlanan_saat: defaultTimes[currentDayName] || '14:00',
        planlanan_gun: currentDayName,
        
        gercek_tarih: null,
        gercek_saat: null,
        
        durum: LESSON_STATUS.PLANNED,
        
        ders_notlari: "",
        egzersizler: [],
        zorluk_seviyesi: null,
        performance_rating: null,
        
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      lessons.push(lesson);
      lessonsCreated++;
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
    
    // Safety check
    if (currentDate.getFullYear() > startDate.getFullYear() + 2) {
      break;
    }
  }
  
  return lessons;
};

/**
 * Tek ders ekle
 * @param {Object} lessonData - Ders bilgileri
 * @returns {Object} Oluşturulan ders
 */
export const addSingleLesson = (lessonData) => {
  const lesson = {
    id: generateLessonId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    durum: LESSON_STATUS.PLANNED,
    gercek_tarih: null,
    gercek_saat: null,
    ders_notlari: "",
    egzersizler: [],
    zorluk_seviyesi: null, 
    performance_rating: null,
    ...lessonData
  };
  
  const existingLessons = getLessonsFromStorage();
  const allLessons = [...existingLessons, lesson];
  saveLessonsToStorage(allLessons);
  
  return lesson;
};

/**
 * Müşteri silindiğinde o müşterinin tüm derslerini sil
 * @param {number} clientId - Müşteri ID
 * @returns {number} Silinen ders sayısı
 */
export const deleteLessonsByClient = (clientId) => {
  const existingLessons = getLessonsFromStorage();
  const otherLessons = existingLessons.filter(lesson => lesson.musteri_id !== clientId);
  
  const deletedCount = existingLessons.length - otherLessons.length;
  saveLessonsToStorage(otherLessons);
  
  return deletedCount;
};

// Helper functions
const getDayNameFromDate = (date) => {
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  return days[date.getDay()];
};

/**
 * Demo data loader - ilk kez çalıştırıldığında örnek dersler ekler
 */
export const loadDemoLessons = () => {
  const existingLessons = getLessonsFromStorage();
  
  if (existingLessons.length === 0) {
    // İlk kez çalışıyor, demo dersler ekle
    const demoLessons = [
      {
        id: "demo_lesson_1",
        musteri_id: 1, // Ayşe Demir
        pt_id: 1,
        planlanan_tarih: "2024-05-15",
        planlanan_saat: "14:00",
        planlanan_gun: "Çarşamba",
        gercek_tarih: "2024-05-15",
        gercek_saat: "14:15", 
        durum: LESSON_STATUS.COMPLETED,
        ders_notlari: "İlk ders, temel hareketleri öğrettik. Motivasyonu çok yüksek!",
        egzersizler: ["Squat", "Push-up", "Plank"],
        zorluk_seviyesi: 5,
        performance_rating: 8,
        created_at: "2024-05-15T14:00:00Z",
        updated_at: "2024-05-15T15:30:00Z"
      },
      {
        id: "demo_lesson_2",
        musteri_id: 1, // Ayşe Demir - bugünkü ders
        pt_id: 1,
        planlanan_tarih: new Date().toISOString().split('T')[0], // Bugün
        planlanan_saat: "14:00",
        planlanan_gun: getDayNameFromDate(new Date()),
        gercek_tarih: null,
        gercek_saat: null,
        durum: LESSON_STATUS.PLANNED,
        ders_notlari: "",
        egzersizler: [],
        zorluk_seviyesi: null,
        performance_rating: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    saveLessonsToStorage(demoLessons);
    return demoLessons;
  }
  
  return existingLessons;
};
