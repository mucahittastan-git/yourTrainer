import React, { memo } from 'react';

const S = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

export const DashboardSkeleton = memo(() => (
  <div className="max-w-7xl mx-auto space-y-8 p-4 lg:p-0">
    <div className="animate-pulse bg-slate-100 rounded-[2.5rem] h-64 lg:h-72" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map(i => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-3 shadow-sm">
          <S className="h-4 w-24" />
          <S className="h-8 w-16" />
          <S className="h-3 w-32" />
        </div>
      ))}
    </div>

    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
      <S className="h-5 w-40" />
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-4">
          <S className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <S className="h-4 w-40" />
            <S className="h-3 w-24" />
          </div>
          <S className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  </div>
));

DashboardSkeleton.displayName = 'DashboardSkeleton';

export const LessonPageSkeleton = memo(() => (
  <div className="max-w-7xl mx-auto space-y-6 p-4 lg:p-0">
    <div className="flex items-center justify-between">
      <S className="h-9 w-48" />
      <S className="h-10 w-36 rounded-xl" />
    </div>

    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <S key={i} className="h-10 rounded-lg" />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <S key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <S className="w-9 h-9 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <S className="h-4 w-28" />
                <S className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

LessonPageSkeleton.displayName = 'LessonPageSkeleton';

export const ProfilePageSkeleton = memo(() => (
  <div className="max-w-4xl mx-auto space-y-6 p-4 lg:p-0">
    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <S className="w-24 h-24 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <S className="h-8 w-48 mx-auto sm:mx-0" />
          <S className="h-4 w-32 mx-auto sm:mx-0" />
          <div className="flex gap-2 justify-center sm:justify-start">
            <S className="h-6 w-20 rounded-full" />
            <S className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <S className="h-10 w-28 rounded-xl flex-shrink-0" />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[0, 1, 2].map(i => (
        <div key={i} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-2">
          <S className="h-4 w-20" />
          <S className="h-7 w-14" />
        </div>
      ))}
    </div>

    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
      <S className="h-5 w-36" />
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="space-y-1.5">
          <S className="h-3 w-24" />
          <S className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  </div>
));

ProfilePageSkeleton.displayName = 'ProfilePageSkeleton';
