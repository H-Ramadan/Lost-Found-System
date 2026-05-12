import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110',
  secondary:
    'bg-white/[0.04] border border-border text-slate-300 hover:bg-white/[0.08] hover:text-white hover:border-border-hover',
  ghost:
    'text-slate-400 hover:text-white hover:bg-white/[0.06]',
  danger:
    'bg-danger-muted text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-2xl gap-2.5',
};

const Button = forwardRef(({ 
  variant = 'primary', size = 'md', loading = false, disabled = false, 
  children, className = '', ...props 
}, ref) => (
  <motion.button
    ref={ref}
    whileHover={!disabled ? { y: -1 } : {}}
    whileTap={!disabled ? { scale: 0.97 } : {}}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center font-semibold transition-all duration-200
      disabled:opacity-40 disabled:pointer-events-none cursor-pointer
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    {...props}
  >
    {loading && <Loader2 size={16} className="animate-spin" />}
    {children}
  </motion.button>
));

Button.displayName = 'Button';
export default Button;
