import React, { memo } from 'react';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle, Minus } from 'lucide-react';
import { LESSON_STATUS, lessonStatusDisplay } from '../../data/lessonsData';
import { formatLessonDate, formatLessonTime, isLessonToday } from '../../utils/lessonHelpers';
import useMobile from '../../hooks/useMobile';

const LessonCard = memo(({ 
  lesson, 
  client, 
  onComplete, 
  onCancel, 
  onMarkNoShow, 
  onEdit,
  showClientName = true,
  compact = false 
}) => {
  const { isMobile } = useMobile();
  const statusInfo = lessonStatusDisplay[lesson.durum];
  const isToday = isLessonToday(lesson.planlanan_tarih);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case LESSON_STATUS.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case LESSON_STATUS.CANCELLED:
        return <Minus className="h-4 w-4" />;
      case LESSON_STATUS.NO_SHOW:
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleQuickComplete = (e) => {
    e.stopPropagation();
    onComplete && onComplete(lesson.id);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    onCancel && onCancel(lesson.id);
  };

  const handleNoShow = (e) => {
    e.stopPropagation();
    onMarkNoShow && onMarkNoShow(lesson.id);
  };

  const handleEdit = () => {
    onEdit && onEdit(lesson);
  };

  // Rating Component - Compact version
  const CompactRating = ({ value, type, maxValue = 10 }) => {
    const percentage = (value / maxValue) * 100;
    const color = type === 'performance' ? 'bg-green-400' : 'bg-orange-400';
    const bgColor = type === 'performance' ? 'bg-green-100' : 'bg-orange-100';
    
    return (
      <div className="flex items-center space-x-1.5">
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {type === 'performance' ? 'P:' : 'Z:'}
        </span>
        <div className={`relative w-12 h-1.5 ${bgColor} rounded-full overflow-hidden`}>
          <div 
            className={`absolute left-0 top-0 h-full ${color} rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 font-medium min-w-[24px]">
          {value}/10
        </span>
      </div>
    );
  };

  // Rating Component - Full version  
  const FullRating = ({ value, type, maxValue = 10 }) => {
    const displayDots = Math.min(maxValue, 10); // Max 10 dots for UI
    const color = type === 'performance' ? 'bg-green-400' : 'bg-orange-400';
    
    return (
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {type === 'performance' ? 'Performans:' : 'Zorluk:'}
        </span>
        <div className="flex items-center space-x-0.5">
          {[...Array(displayDots)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                i < value ? color : 'bg-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1 font-medium">
            {value}/{maxValue}
          </span>
        </div>
      </div>
    );
  };

  // Compact mode - for lists and mobile views
  if (compact) {
    return (
      <div 
        className={`overflow-hidden border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95 touch-manipulation ${
          isToday ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'
        }`}
        onClick={handleEdit}
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`p-2 rounded-full ${statusInfo.bgColor} flex-shrink-0`}>
                <div className={statusInfo.textColor}>
                  {getStatusIcon(lesson.durum)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Client Name - Always show if available */}
                {showClientName && client && (
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {client.ad} {client.soyad}
                  </p>
                )}
                
                {/* Time and Date info */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{formatLessonTime(lesson.planlanan_saat)}</span>
                  {!isToday && (
                    <>
                      <span>•</span>
                      <span className="truncate">{formatLessonDate(lesson.planlanan_tarih)}</span>
                    </>
                  )}
                </div>
                
                {/* Exercise preview for completed lessons */}
                {lesson.egzersizler && lesson.egzersizler.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {lesson.egzersizler.slice(0, 2).map((exercise, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {exercise}
                      </span>
                    ))}
                    {lesson.egzersizler.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                        +{lesson.egzersizler.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-1 flex-shrink-0 ml-3">
              {isToday && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  Bugün
                </span>
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Performance indicators for completed lessons - Compact */}
          {lesson.durum === LESSON_STATUS.COMPLETED && (lesson.performance_rating || lesson.zorluk_seviyesi) && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-col space-y-2">
                {lesson.performance_rating && (
                  <CompactRating 
                    value={lesson.performance_rating} 
                    type="performance" 
                  />
                )}
                {lesson.zorluk_seviyesi && (
                  <CompactRating 
                    value={lesson.zorluk_seviyesi} 
                    type="difficulty" 
                  />
                )}
              </div>
            </div>
          )}

          {/* Action Buttons - Only for planned lessons */}
          {lesson.durum === LESSON_STATUS.PLANNED && (onComplete || onCancel || onMarkNoShow) && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {onComplete && (
                  <button
                    onClick={handleQuickComplete}
                    className="btn-success flex-1 py-2 px-3 rounded-lg text-sm font-black touch-manipulation"
                  >
                    Tamamla
                  </button>
                )}
                
                {onCancel && (
                  <button
                    onClick={handleCancel}
                    className="btn-ghost flex-1 py-2 px-3 rounded-lg text-sm font-black touch-manipulation"
                  >
                    İptal
                  </button>
                )}
                
                {onMarkNoShow && (
                  <button
                    onClick={handleNoShow}
                    className="btn-danger flex-1 py-2 px-3 rounded-lg text-sm font-black touch-manipulation"
                  >
                    Gelmedi
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full mode - for detailed views
  return (
    <div 
      className={`overflow-hidden bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover-lift active:scale-95 touch-manipulation ${
        isToday ? 'border-primary-300 shadow-md' : 'border-gray-200'
      }`}
      onClick={handleEdit}
    >
      <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className={`p-2 rounded-full ${statusInfo.bgColor} flex-shrink-0`}>
              <div className={statusInfo.textColor}>
                {getStatusIcon(lesson.durum)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              {showClientName && client && (
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {client.ad} {client.soyad}
                </h3>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{formatLessonDate(lesson.planlanan_tarih)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} border`}>
              {statusInfo.label}
            </span>
            
            {isToday && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                Bugün
              </span>
            )}
          </div>
        </div>

        {/* Time and Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">
                Planlanan: {formatLessonTime(lesson.planlanan_saat)}
              </span>
            </div>
            
            {lesson.gercek_saat && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  Gerçek: {formatLessonTime(lesson.gercek_saat)}
                </span>
              </div>
            )}
          </div>

          {/* Exercise List */}
          {lesson.egzersizler && lesson.egzersizler.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Egzersizler:</p>
              <div className="flex flex-wrap gap-1">
                {lesson.egzersizler.slice(0, 4).map((exercise, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {exercise}
                  </span>
                ))}
                {lesson.egzersizler.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                    +{lesson.egzersizler.length - 4} daha
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Notes Preview */}
          {lesson.ders_notlari && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {lesson.ders_notlari}
              </p>
            </div>
          )}

          {/* Performance Ratings - Full */}
          {lesson.durum === LESSON_STATUS.COMPLETED && (lesson.performance_rating || lesson.zorluk_seviyesi) && (
            <div className="pt-3 border-t border-gray-100">
              <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row space-x-6'} flex-wrap`}>
                {lesson.performance_rating && (
                  <FullRating 
                    value={lesson.performance_rating} 
                    type="performance" 
                  />
                )}
                {lesson.zorluk_seviyesi && (
                  <FullRating 
                    value={lesson.zorluk_seviyesi} 
                    type="difficulty" 
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Only for planned lessons */}
        {lesson.durum === LESSON_STATUS.PLANNED && (onComplete || onCancel || onMarkNoShow) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
            {onComplete && (
              <button
                onClick={handleQuickComplete}
                className={`btn-success flex-1 font-black rounded-lg touch-manipulation ${
                  isMobile ? 'text-sm py-3 px-2' : 'text-sm py-2 px-3'
                }`}
              >
                Tamamla
              </button>
            )}
            
            {onCancel && (
              <button
                onClick={handleCancel}
                className={`btn-ghost flex-1 font-black rounded-lg touch-manipulation ${
                  isMobile ? 'text-sm py-3 px-2' : 'text-sm py-2 px-3'
                }`}
              >
                İptal
              </button>
            )}
            
            {onMarkNoShow && (
              <button
                onClick={handleNoShow}
                className={`btn-danger flex-1 font-black rounded-lg touch-manipulation ${
                  isMobile ? 'text-sm py-3 px-2' : 'text-sm py-2 px-3'
                }`}
              >
                Gelmedi
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

LessonCard.displayName = 'LessonCard';

export default LessonCard;
