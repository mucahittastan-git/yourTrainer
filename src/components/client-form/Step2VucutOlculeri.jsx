import React, { memo, useMemo } from 'react';
import { Activity, Ruler, Scale, Heart, Target } from 'lucide-react';
import FormField from '../form/FormField';

const MEASUREMENT_FIELDS = [
  {
    name: 'boy',
    label: 'Boy',
    unit: 'cm',
    icon: Ruler,
    placeholder: '170',
    min: 140,
    max: 220,
    required: true,
    category: 'basic',
    helpText: 'Ayakkabısız boy ölçüsü'
  },
  {
    name: 'kilo',
    label: 'Kilo',
    unit: 'kg',
    icon: Scale,
    placeholder: '70',
    min: 40,
    max: 200,
    required: true,
    category: 'basic',
    helpText: 'Sabah, aç karnına ölçülen kilo'
  },
  {
    name: 'bel',
    label: 'Bel Çevresi',
    unit: 'cm',
    icon: Target,
    placeholder: '80',
    min: 50,
    max: 150,
    required: false,
    category: 'measurements',
    helpText: 'En dar noktadan ölçülür'
  },
  {
    name: 'kalca',
    label: 'Kalça Çevresi',
    unit: 'cm',
    icon: Target,
    placeholder: '95',
    min: 60,
    max: 160,
    required: false,
    category: 'measurements',
    helpText: 'En geniş noktadan ölçülür'
  },
  {
    name: 'gogus',
    label: 'Göğüs Çevresi',
    unit: 'cm',
    icon: Target,
    placeholder: '85',
    min: 60,
    max: 150,
    required: false,
    category: 'measurements',
    helpText: 'Nefes verirken ölçülür'
  }
];

const BMI_CATEGORIES = [
  { min: 0, max: 18.5, label: 'Zayıf', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { min: 18.5, max: 25, label: 'Normal', color: 'text-green-600', bgColor: 'bg-green-50' },
  { min: 25, max: 30, label: 'Fazla Kilolu', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { min: 30, max: 100, label: 'Obez', color: 'text-red-600', bgColor: 'bg-red-50' }
];

const BMIIndicator = memo(({ bmi }) => {
  if (!bmi) return null;

  const category = BMI_CATEGORIES.find(cat => bmi >= cat.min && bmi < cat.max);
  const percentage = Math.min((bmi / 35) * 100, 100); // Scale to 35 as max for visual

  return (
    <div className={`${category?.bgColor} border border-gray-200 rounded-xl p-6 card-animate`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Vücut Kitle İndeksi (BMI)</h4>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-bold text-gray-900">{bmi}</span>
            {category && (
              <span className={`text-lg font-medium ${category.color}`}>
                ({category.label})
              </span>
            )}
          </div>
        </div>
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm hover-scale">
          <Heart className={`h-8 w-8 ${category?.color || 'text-gray-400'}`} />
        </div>
      </div>

      {/* BMI Visual Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Zayıf</span>
          <span>Normal</span>
          <span>Fazla Kilolu</span>
          <span>Obez</span>
        </div>
        <div className="h-3 bg-gradient-to-r from-blue-200 via-green-200 via-yellow-200 to-red-200 rounded-full relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full w-1 bg-gray-800 rounded-full transition-all duration-500"
            style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
          />
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mt-2">
            BMI = Kilo (kg) ÷ Boy² (m²)
          </p>
        </div>
      </div>
    </div>
  );
});

BMIIndicator.displayName = 'BMIIndicator';

const MeasurementTips = memo(() => (
  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 card-animate">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <Activity className="h-6 w-6 text-purple-600 mt-1" />
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-semibold text-purple-900 mb-3">Ölçüm İpuçları</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-700">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Boy ve kilo ölçüleri zorunludur</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Sabah, aç karnına ölçüm yapın</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Çevre ölçüleri için esnek olmayan mezura kullanın</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>İlerleme takibi için çevre ölçüleri önerilir</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

MeasurementTips.displayName = 'MeasurementTips';

const Step2VucutOlculeri = memo(({ formData, updateFormData, errors }) => {
  const measurements = formData.vucut_olculeri || {};

  const handleOlcuChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      vucut_olculeri: {
        ...measurements,
        [name]: value
      }
    });
  };

  // `handleMeasurementChange` removed — use `handleOlcuChange` which handles the same case

  const bmi = useMemo(() => {
    const height = parseFloat(measurements.boy);
    const weight = parseFloat(measurements.kilo);
    
    if (height && weight && height > 0) {
      const heightInMeters = height / 100;
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      return calculatedBMI.toFixed(1);
    }
    return null;
  }, [measurements.boy, measurements.kilo]);

  const basicFields = MEASUREMENT_FIELDS.filter(field => field.category === 'basic');
  const measurementFields = MEASUREMENT_FIELDS.filter(field => field.category === 'measurements');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-200">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Activity className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vücut Ölçüleri</h2>
        <p className="text-gray-600">İlerleme takibi için başlangıç ölçülerini girin</p>
      </div>

      {/* Basic Measurements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Scale className="h-5 w-5 text-gray-600 mr-2" />
          Temel Ölçüler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {basicFields.map((field) => {
            const Icon = field.icon;
            return (
              <FormField
                key={field.name}
                label={`${field.label} (${field.unit})`}
                name={field.name}
                type="number"
                value={measurements[field.name] || ''}
                onChange={handleOlcuChange}
                error={errors[field.name]}
                required={field.required}
                min={field.min}
                max={field.max}
                step="0.1"
                placeholder={field.placeholder}
                icon={Icon}
                helpText={field.helpText}
              />
            );
          })}
        </div>
      </div>

      {/* BMI Display */}
      {bmi && <BMIIndicator bmi={parseFloat(bmi)} />}

      {/* Additional Measurements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 text-gray-600 mr-2" />
          Çevre Ölçüleri <span className="text-sm font-normal text-gray-500 ml-2">(Opsiyonel)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {measurementFields.map((field) => {
            const Icon = field.icon;
            return (
              <FormField
                key={field.name}
                label={`${field.label} (${field.unit})`}
                name={field.name}
                type="number"
                value={measurements[field.name] || ''}
                onChange={handleOlcuChange}
                min={field.min}
                max={field.max}
                step="0.1"
                placeholder={field.placeholder}
                icon={Icon}
                helpText={field.helpText}
              />
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notlar" className="block text-sm font-medium text-gray-700 mb-3">
          Ek Notlar
          <span className="text-xs font-normal text-gray-500 ml-2">(Opsiyonel)</span>
        </label>
        <textarea
          id="notlar"
          name="notlar"
          rows={4}
          value={formData.notlar || ''}
          onChange={(e) => updateFormData({ notlar: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none"
          placeholder="Üyenin hedefleri, sağlık durumu, dikkat edilmesi gereken özel durumlar..."
        />
        <p className="mt-2 text-xs text-gray-500">
          Antrenman programı hazırlarken dikkate alınacak özel durumlar, hedefler veya notlar
        </p>
      </div>

      {/* Tips */}
      <MeasurementTips />
    </div>
  );
});

Step2VucutOlculeri.displayName = 'Step2VucutOlculeri';

export default Step2VucutOlculeri;
