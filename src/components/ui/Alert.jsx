import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';

const CONFIGS = {
  error: {
    Icon: AlertCircle,
    wrap: 'bg-red-50 border-red-200 text-red-900',
    icon: 'text-red-500',
    bar: 'bg-red-500',
  },
  warning: {
    Icon: AlertTriangle,
    wrap: 'bg-amber-50 border-amber-200 text-amber-900',
    icon: 'text-amber-500',
    bar: 'bg-amber-500',
  },
  info: {
    Icon: Info,
    wrap: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: 'text-blue-500',
    bar: 'bg-blue-500',
  },
  success: {
    Icon: CheckCircle,
    wrap: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    icon: 'text-emerald-500',
    bar: 'bg-emerald-500',
  },
};

const Alert = ({ type = 'info', title, message, onDismiss, action, className = '' }) => {
  const cfg = CONFIGS[type] ?? CONFIGS.info;
  const { Icon } = cfg;

  return (
    <div className={`relative overflow-hidden flex items-start gap-3 p-4 rounded-xl border ${cfg.wrap} ${className}`}>
      <div className={`absolute left-0 inset-y-0 w-1 ${cfg.bar} rounded-l-xl`} />
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ml-2 ${cfg.icon}`} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
        {message && <p className="text-sm opacity-80 leading-relaxed">{message}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-xs font-bold underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Kapat"
          className="flex-shrink-0 opacity-40 hover:opacity-80 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
