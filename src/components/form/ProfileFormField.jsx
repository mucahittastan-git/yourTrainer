import React, { memo, useId } from 'react';

const ProfileFormField = memo(({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  icon: Icon,
  min,
  max,
  step,
  disabled = false,
  className = '',
  helpText,
  autoFocus = false,
  isEditing = false,
  displayValue,
  rows = 4,
  ...props
}) => {
  const fieldId = useId();
  const hasError = error && touched;
  const isTextarea = type === 'textarea';

  const finalDisplayValue = displayValue !== undefined ? displayValue : value;

  if (!isEditing) {
    return (
      <div className={`space-y-3 ${className}`}>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className={`
          w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-900 relative transition-all duration-300
          ${isTextarea ? 'min-h-[100px] whitespace-pre-wrap' : ''}
          ${Icon ? 'pl-2' : ''}
        `}>
          <div className="flex items-center space-x-4">
            {Icon && (
              <Icon className="h-5 w-5 text-slate-500 shrink-0" />
            )}
            <div className="font-black tracking-tight text-main">
              {finalDisplayValue || <span className="text-slate-400 italic font-medium">Belirtilmemiş</span>}
            </div>
          </div>
        </div>

        {helpText && (
          <p className="text-[10px] text-slate-500 font-medium ml-1">
            {helpText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <label 
        htmlFor={fieldId} 
        className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative group">
        {Icon && !isTextarea && (
          <Icon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary-500 transition-colors z-10" />
        )}
        
        {isTextarea ? (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            rows={rows}
            className={`
              input-premium min-h-[120px] resize-none
              ${hasError ? 'border-red-300 ring-4 ring-red-500/10' : ''}
              ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-50' : ''}
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
            {...props}
          />
        ) : (
          <input
            id={fieldId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            autoFocus={autoFocus}
            className={`
              input-premium
              ${Icon ? 'pl-14' : ''}
              ${hasError ? 'border-red-300 ring-4 ring-red-500/10' : ''}
              ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-50' : ''}
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
            {...props}
          />
        )}
      </div>

      {helpText && !hasError && (
        <p id={`${fieldId}-help`} className="text-[10px] text-slate-400 font-medium ml-1">
          {helpText}
        </p>
      )}

      {hasError && (
        <p id={`${fieldId}-error`} className="text-xs font-bold text-red-500 ml-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

ProfileFormField.displayName = 'ProfileFormField';

export default ProfileFormField;
