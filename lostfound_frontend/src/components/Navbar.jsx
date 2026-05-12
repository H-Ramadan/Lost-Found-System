import React from 'react';
import { motion } from 'framer-motion';
import { Plus, LogOut } from 'lucide-react';
import Button from './ui/Button';

export default function Navbar({ user, onNavigate, onLogout }) {
  return (
    <nav className="fixed top-0 inset-x-0 h-16 z-50 border-b border-border bg-bg/70 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <motion.button
          onClick={() => onNavigate('home')}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-bold tracking-tight text-gradient cursor-pointer"
        >
          LostFound
        </motion.button>

        {/* Actions */}
        {user && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('add')}
              aria-label="Report a new item"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Report</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              aria-label="Sign out"
              className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={15} />
            </Button>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
