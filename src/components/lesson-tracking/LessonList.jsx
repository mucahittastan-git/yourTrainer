import React, { useMemo, memo } from 'react';
import { Clock, CheckCircle, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { LESSON_STATUS, lessonStatusDisplay } from '../../data/lessonsData';
import { formatLessonTime } from '../../utils/lessonHelpers';

/**
 * Universal Lesson List component for Dashboard and Tracking views
 */
const LessonList = memo(({ 
  lessons = [], 
  clients = {}, 
  title = "Dersler",
  icon: Icon = Clock,
  emptyMessage = "Planlanmış ders yok",
  emptySubMessage = "Güzel bir dinlenme günü! 😊",
  onLessonClick,
  onQuickComplete,
  onViewAll,
  maxItems = 4,
  showProgress = false,
  variant = 'default' // 'default', 'compact', 'warning', 'premium'
}) => {
  const completedCount = useMemo(() => 
    lessons.filter(l => l.durum === LESSON_STATUS.COMPLETED).length
  , [lessons]);

  const totalCount = lessons.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const containerStyles = useMemo(() => {
    switch(variant) {
      case 'premium':
        return 'glass-card rounded-[2rem] p-8 border-white/20 shadow-2xl';
      case 'warning':
        return 'bg-white rounded-2xl shadow-sm border border-orange-100 p-6';
      default:
        return 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6';
    }
  }, [variant]);

  const titleStyles = useMemo(() => {
    switch(variant) {
      case 'premium':
        return 'text-xs font-black text-slate-400 uppercase tracking-[0.2em]';
      default:
        return 'text-lg font-bold text-gray-900';
    }
  }, [variant]);

  if (totalCount === 0) {
    return (
      <div className={containerStyles}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${titleStyles} flex items-center`}>
            {variant !== 'premium' && <Icon className={`h-5 w-5 mr-2 ${variant === 'warning' ? 'text-orange-500' : 'text-primary-600'}`} />}
            {title}
          </h3>
        </div>
        <div className="text-center py-10">
          <Calendar className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">{emptyMessage}</p>
          <p className="text-xs text-slate-400 mt-1">{emptySubMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerStyles} card-animate`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`${titleStyles} flex items-center`}>
          {variant !== 'premium' && <Icon className={`h-5 w-5 mr-2 ${variant === 'warning' ? 'text-orange-500' : 'text-primary-600'}`} />}
          {title}
        </h3>
        
        <div className="flex items-center space-x-4">
          {showProgress && (
            <span className="text-xs font-black text-primary-600 uppercase tracking-wider bg-primary-50 px-2 py-1 rounded-md">
              {completedCount}/{totalCount} BİTTİ
            </span>
          )}
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-primary-500 hover:text-primary-600 text-xs font-black uppercase tracking-widest flex items-center group transition-colors"
            >
              Tümü
              <ArrowRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {showProgress && (
        <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.1em] mb-2 text-slate-500">
            <span>Günlük İlerleme</span>
            <span className="text-primary-600">{progress}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {lessons.slice(0, maxItems).map((lesson) => {
          const client = clients[lesson.musteri_id];
          const statusInfo = lessonStatusDisplay[lesson.durum];
          const isCompleted = lesson.durum === LESSON_STATUS.COMPLETED;

          return (
            <div
              key={lesson.id}
              onClick={() => onLessonClick && onLessonClick(lesson)}
              className="group flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl cursor-pointer hover:bg-white hover:shadow-xl border border-transparent hover:border-primary-100/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-1.5 h-10 rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-primary-500'
                } ${isCompleted ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
                
                <div>
                  <p className="font-black text-slate-900 text-sm">
                    {client ? `${client.ad} ${client.soyad}` : 'Misafir Müşteri'}
                  </p>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center font-bold">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-primary-400" />
                      {formatLessonTime(lesson.planlanan_saat)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {lesson.durum === LESSON_STATUS.PLANNED && onQuickComplete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickComplete(lesson.id);
                  }}
                  className="btn-magnetic flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <CheckCircle className="h-3 w-3" />
                  <span>Bitir</span>
                </button>
              )}
            </div>
          );
        })}

        {lessons.length > maxItems && !onViewAll && (
          <div className="text-center pt-4 border-t border-slate-100 mt-4">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              VE {lessons.length - maxItems} DERS DAHA
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

LessonList.displayName = 'LessonList';

export default LessonList;
