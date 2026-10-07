/**
 * @file ThemeToggle.tsx
 * @description Animated Sun/Moon toggle button for switching between light and dark themes.
 * Designed to sit in the Navbar.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => {
        // Add transitioning class for smooth crossfade
        document.documentElement.classList.add('transitioning');
        toggleTheme();
        setTimeout(() => {
          document.documentElement.classList.remove('transitioning');
        }, 350);
      }}
      className={cn(
        'relative h-10 w-10 rounded-xl flex items-center justify-center',
        'bg-surface-raised border border-border',
        'hover:bg-surface hover:border-border-dark hover:shadow-sm',
        'transition-all duration-200 focus-ring cursor-pointer',
        className
      )}
      title={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Sun className="w-[18px] h-[18px] text-accent-amber" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Moon className="w-[18px] h-[18px] text-accent-violet" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
