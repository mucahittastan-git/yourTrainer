import React from 'react';

/**
 * yourTrainer Button Design System
 * Variants: primary | secondary | ghost | danger | success | whatsapp | fab | icon | icon-danger | icon-success
 * Sizes:    sm | md (default) | lg
 */
const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

const VARIANT_CLASSES = {
  primary:      'btn-primary',
  secondary:    'btn-secondary',
  ghost:        'btn-ghost',
  danger:       'btn-danger',
  success:      'btn-success',
  whatsapp:     'btn-whatsapp',
  fab:          'btn-fab',
  icon:         'btn-icon',
  'icon-danger':  'btn-icon btn-icon--danger',
  'icon-success': 'btn-icon btn-icon--success',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  magnetic = false,
  darkBg = false,
  ...props
}) => {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  // Icon & FAB variants manage their own sizing — skip size class for those
  const isSizeControlled = ['fab', 'icon', 'icon-danger', 'icon-success'].includes(variant);
  const sizeClass = isSizeControlled ? '' : SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const magneticClass = magnetic ? `btn-magnetic${darkBg ? ' btn-dark-bg' : ''}` : '';

  return (
    <button
      className={`${variantClass} ${sizeClass} ${magneticClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
