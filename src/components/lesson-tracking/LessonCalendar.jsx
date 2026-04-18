import React, { useState, useMemo, useCallback, memo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home
} from 'lucide-react';
import { getLessonsByDateRange } from '../../utils/lessonHelpers';
import { LESSON_STATUS, lessonStatusDisplay } from '../../data/lessonsData';

// Date utilities
const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
const getMonthName = (date) => date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};
// removed unused isSameMonth helper (kept calendar logic simpler)

// Status icon mapping
const StatusIcon = memo(({ status, size = 'w-3 h-3' }) => {
  const iconClass = `${size} flex-shrink-0`;
  
  switch (status) {
    case LESSON_STATUS.COMPLETED:
      return <CheckCircle className={`${iconClass} text-green-600`} />;
    case LESSON_STATUS.CANCELLED:
      return <XCircle className={`${iconClass} text-yellow-600`} />;
    case LESSON_STATUS.NO_SHOW:
      return <AlertCircle className={`${iconClass} text-red-600`} />;
    case LESSON_STATUS.PLANNED:
    default:
      return <Clock className={`${iconClass} text-blue-600`} />;
  }
});

StatusIcon.displayName = 'StatusIcon';

// Lesson indicator component
const LessonIndicator = memo(({ lessons, isCompact = false }) => {
  if (lessons.length === 0) return null;
  
  if (isCompact) {
    // Mobile: Show count with dominant status color
    const statusCounts = lessons.reduce((acc, lesson) => {
      acc[lesson.durum] = (acc[lesson.durum] || 0) + 1;
      return acc;
    }, {});
    
    const dominantStatus = Object.keys(statusCounts).reduce((a, b) => 
      statusCounts[a] > statusCounts[b] ? a : b
    );
    
    const statusConfig = lessonStatusDisplay[dominantStatus];
    
    return (
      <div className={`
        inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-xs font-medium
        ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}
      `}>
        {lessons.length}
      </div>
    );
  }
  
  // Desktop: Show individual status dots
  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {lessons.slice(0, 3).map((lesson) => {
        const statusConfig = lessonStatusDisplay[lesson.durum];
        return (
          <div
            key={lesson.id}
            className={`
              w-2 h-2 rounded-full 
              ${statusConfig.bgColor.replace('100', '500')}
              hover:scale-110 transition-transform duration-150
            `}
            title={`${statusConfig.label} - ${lesson.planlanan_saat || 'Zaman belirsiz'}`}
          />
        );
      })}
      {lessons.length > 3 && (
        <div className="w-2 h-2 rounded-full bg-gray-400 flex items-center justify-center">
          <span className="text-[6px] text-white font-bold">+</span>
        </div>
      )}
    </div>
  );
});

LessonIndicator.displayName = 'LessonIndicator';

// Calendar day cell component
const CalendarDay = memo(({ 
  date, 
  isCurrentMonth, 
  lessons = [], 
  onDayClick, 
  onAddLesson,
  isMobile = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const dayNumber = date.getDate();
  const isCurrentDay = isToday(date);
  const hasLessons = lessons.length > 0;
  
  const handleClick = useCallback(() => {
    if (hasLessons) {
      onDayClick(date, lessons);
    }
  }, [date, lessons, hasLessons, onDayClick]);
  
  const handleAddClick = useCallback((e) => {
    e.stopPropagation();
    onAddLesson(date);
  }, [date, onAddLesson]);
  
  const cellClasses = `
    relative group cursor-pointer transition-all duration-200 ease-in-out
    ${isMobile ? 'h-12' : 'h-16 lg:h-20'}
    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
    ${isCurrentDay 
      ? 'bg-primary-50 border-primary-200 text-primary-900 font-semibold' 
      : 'hover:bg-gray-50 border-gray-100'
    }
    border rounded-lg flex flex-col items-center justify-center
    ${hasLessons ? 'hover:shadow-md' : ''}
    ${isHovered && hasLessons ? 'ring-2 ring-primary-200' : ''}
  `;
  
  return (
    <div 
      className={cellClasses}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={hasLessons ? "button" : "gridcell"}
      aria-label={`${dayNumber} ${hasLessons ? `, ${lessons.length} ders var` : ''}`}
      tabIndex={hasLessons ? 0 : -1}
    >
      {/* Day number */}
      <span className={`${isMobile ? 'text-sm' : 'text-base'} leading-none`}>
        {dayNumber}
      </span>
      
      {/* Lesson indicators */}
      {hasLessons && (
        <div className="mt-1">
          <LessonIndicator lessons={lessons} isCompact={isMobile} />
        </div>
      )}
      
      {/* Add button (appears on hover for desktop, always visible for mobile if no lessons) */}
      {isCurrentMonth && (
        <button
          onClick={handleAddClick}
          className={`
            absolute ${isMobile ? 'bottom-1 right-1' : 'bottom-1 right-1'}
            ${isMobile && !hasLessons ? 'opacity-40' : 'opacity-0 group-hover:opacity-100'}
            w-5 h-5 bg-primary-500 text-white rounded-full
            flex items-center justify-center transition-opacity duration-200
            hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300
            ${isHovered ? 'opacity-100' : ''}
          `}
          aria-label={`${dayNumber} tarihine ders ekle`}
          title="Ders ekle"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </div>
  );
});

CalendarDay.displayName = 'CalendarDay';

// Main calendar component
const LessonCalendar = memo(({ 
  onLessonClick, 
  onAddLesson, 
  ptId,
  initialDate = new Date(),
  className = '',
  isMobile = false 
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get lessons for current month
  const monthLessons = useMemo(() => {
    if (!ptId) return [];
    
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    return getLessonsByDateRange(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    ).filter(lesson => lesson.pt_id === parseInt(ptId));
  }, [currentDate, ptId]);
  
  // Group lessons by date
  const lessonsByDate = useMemo(() => {
    return monthLessons.reduce((acc, lesson) => {
      const date = lesson.planlanan_tarih;
      if (!acc[date]) acc[date] = [];
      acc[date].push(lesson);
      return acc;
    }, {});
  }, [monthLessons]);
  
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfWeek = getFirstDayOfMonth(currentDate);
    
    // Adjust for Monday start (Turkish calendar style)
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        date,
        isCurrentMonth: false,
        lessons: lessonsByDate[dateStr] || []
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        date,
        isCurrentMonth: true,
        lessons: lessonsByDate[dateStr] || []
      });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks × 7 days
    
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateStr = date.toISOString().split('T')[0];
      
      days.push({
        date,
        isCurrentMonth: false,
        lessons: lessonsByDate[dateStr] || []
      });
    }
    
    return days;
  }, [currentDate, lessonsByDate]);
  
  // Navigation handlers
  const goToPreviousMonth = useCallback(async () => {
    setIsLoading(true);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    // Simulate loading for smooth UX
    setTimeout(() => setIsLoading(false), 150);
  }, []);
  
  const goToNextMonth = useCallback(async () => {
    setIsLoading(true);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setTimeout(() => setIsLoading(false), 150);
  }, []);
  
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);
  
  const handleDayClick = useCallback((date, lessons) => {
    if (lessons.length === 1) {
      onLessonClick?.(lessons[0]);
    } else if (lessons.length > 1) {
      // Handle multiple lessons - could show a modal or list
      onLessonClick?.(lessons[0]); // For now, show first lesson
    }
  }, [onLessonClick]);
  
  const handleAddLesson = useCallback((date) => {
    onAddLesson?.(date);
  }, [onAddLesson]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      goToPreviousMonth();
    } else if (e.key === 'ArrowRight') {
      goToNextMonth();
    } else if (e.key === 'Home') {
      goToToday();
    }
  }, [goToPreviousMonth, goToNextMonth, goToToday]);
  
  const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} flex-shrink-0`} />
            <h2 className={`font-bold capitalize ${isMobile ? 'text-lg' : 'text-xl lg:text-2xl'}`}>
              {getMonthName(currentDate)}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Today button */}
            <button
              onClick={goToToday}
              className={`
                ${isMobile ? 'p-2' : 'px-3 py-2'}
                bg-white/20 hover:bg-white/30 text-white rounded-lg
                transition-colors duration-200 flex items-center space-x-1
                focus:outline-none focus:ring-2 focus:ring-white/50
              `}
              title="Bugüne git"
            >
              <Home className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
              {!isMobile && <span className="text-sm font-medium">Bugün</span>}
            </button>
            
            {/* Navigation */}
            <button
              onClick={goToPreviousMonth}
              disabled={isLoading}
              className={`
                ${isMobile ? 'p-2' : 'p-2'}
                bg-white/20 hover:bg-white/30 disabled:opacity-50 
                text-white rounded-lg transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-white/50
              `}
              aria-label="Önceki ay"
            >
              <ChevronLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            </button>
            
            <button
              onClick={goToNextMonth}
              disabled={isLoading}
              className={`
                ${isMobile ? 'p-2' : 'p-2'}
                bg-white/20 hover:bg-white/30 disabled:opacity-50 
                text-white rounded-lg transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-white/50
              `}
              aria-label="Sonraki ay"
            >
              <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
                {monthLessons.filter(l => l.durum === LESSON_STATUS.PLANNED).length}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-90`}>Planlanmış</div>
            </div>
            <div>
              <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
                {monthLessons.filter(l => l.durum === LESSON_STATUS.COMPLETED).length}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-90`}>Tamamlandı</div>
            </div>
            <div>
              <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
                {monthLessons.filter(l => l.durum === LESSON_STATUS.CANCELLED).length}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-90`}>İptal</div>
            </div>
            <div>
              <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
                {monthLessons.filter(l => l.durum === LESSON_STATUS.NO_SHOW).length}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-90`}>Gelmedi</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar Content */}
      <div className={`${isMobile ? 'p-3' : 'p-4 lg:p-6'}`}>
        {/* Week headers */}
        <div className={`grid grid-cols-7 gap-2 mb-2 ${isMobile ? 'mb-1' : 'mb-3'}`}>
          {weekDays.map(day => (
            <div 
              key={day} 
              className={`
                ${isMobile ? 'text-xs py-2' : 'text-sm py-3'}
                font-semibold text-gray-600 text-center
              `}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div 
          className={`
            grid grid-cols-7 gap-2 transition-opacity duration-200
            ${isLoading ? 'opacity-50' : 'opacity-100'}
          `}
          role="grid"
          aria-label="Ders takvimi"
        >
          {calendarDays.map((day, index) => (
            <CalendarDay
              key={`${day.date.getTime()}-${index}`}
              date={day.date}
              isCurrentMonth={day.isCurrentMonth}
              lessons={day.lessons}
              onDayClick={handleDayClick}
              onAddLesson={handleAddLesson}
              isMobile={isMobile}
            />
          ))}
        </div>
        
        {/* Legend */}
        <div className={`${isMobile ? 'mt-3 pt-3' : 'mt-6 pt-4'} border-t border-gray-100`}>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <StatusIcon status={LESSON_STATUS.PLANNED} size="w-3 h-3" />
              <span>Planlanmış</span>
            </div>
            <div className="flex items-center space-x-1">
              <StatusIcon status={LESSON_STATUS.COMPLETED} size="w-3 h-3" />
              <span>Tamamlandı</span>
            </div>
            <div className="flex items-center space-x-1">
              <StatusIcon status={LESSON_STATUS.CANCELLED} size="w-3 h-3" />
              <span>İptal</span>
            </div>
            <div className="flex items-center space-x-1">
              <StatusIcon status={LESSON_STATUS.NO_SHOW} size="w-3 h-3" />
              <span>Gelmedi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

LessonCalendar.displayName = 'LessonCalendar';

export default LessonCalendar;
