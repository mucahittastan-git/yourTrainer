import React from 'react';
import { ServerCrash, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageErrorState = ({
  title = 'Veriler yüklenemedi',
  message = 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
  onRetry,
  showBack = false,
  icon: CustomIcon,
}) => {
  const navigate = useNavigate();
  const Icon = CustomIcon ?? ServerCrash;

  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-100 rounded-[1.5rem] blur-lg opacity-60" />
        <div className="relative w-20 h-20 bg-white border border-red-100 rounded-[1.5rem] flex items-center justify-center shadow-sm">
          <Icon className="h-9 w-9 text-red-400" />
        </div>
      </div>

      <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-8">{message}</p>

      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Tekrar Dene
          </button>
        )}
      </div>
    </div>
  );
};

export default PageErrorState;
