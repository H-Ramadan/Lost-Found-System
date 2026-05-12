import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, glow = false, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } } : {}}
      className={`glass-card group ${glow ? 'hover:shadow-glow' : ''} ${className}`}
      {...props}
    >
      {/* Ambient glow layer — visible on hover */}
      {glow && (
        <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl bg-primary/10" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
