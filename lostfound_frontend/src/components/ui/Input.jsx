import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, icon: Icon, error, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </label>
    )}
    <div className="relative group">
      {Icon && (
        <Icon
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors duration-200"
        />
      )}
      <input
        ref={ref}
        className={`
          input-field
          ${Icon ? 'pl-11' : ''}
          ${error ? 'border-danger ring-2 ring-danger/20' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-danger pl-1">{error}</p>}
  </div>
));

Input.displayName = 'Input';

export const Select = forwardRef(({ label, children, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </label>
    )}
    <select
      ref={ref}
      className={`input-field appearance-none cursor-pointer pr-10 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
      }}
      {...props}
    >
      {children}
    </select>
  </div>
));

Select.displayName = 'Select';

export const Textarea = forwardRef(({ label, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      className={`input-field resize-none ${className}`}
      {...props}
    />
  </div>
));

Textarea.displayName = 'Textarea';

export default Input;
