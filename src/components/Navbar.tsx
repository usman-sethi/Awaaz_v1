import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../App';
import { isDemoMode } from '../lib/ai/provider';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const demoMode = isDemoMode();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/report', label: 'Report' },
    { to: '/history', label: 'History' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/demo', label: 'Demo' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/50 backdrop-blur-xl dark:bg-zinc-950/80 bg-white/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold dark:text-zinc-100 text-zinc-900">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <span className="text-[15px] tracking-tight">Awaaz</span>
            {demoMode && (
              <span className="ml-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">
                DEMO
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  isActive(link.to)
                    ? 'dark:bg-zinc-800 dark:text-zinc-100 bg-zinc-100 text-zinc-900'
                    : 'dark:text-zinc-400 text-zinc-600 dark:hover:text-zinc-200 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 dark:text-zinc-400 text-zinc-600 transition-colors dark:hover:bg-zinc-800 hover:bg-zinc-100 dark:hover:text-zinc-200 hover:text-zinc-900"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-md p-2 dark:text-zinc-400 text-zinc-600 transition-colors dark:hover:bg-zinc-800 hover:bg-zinc-100 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-800/50 dark:bg-zinc-950 bg-white md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'dark:bg-zinc-800 dark:text-zinc-100 bg-zinc-100 text-zinc-900'
                      : 'dark:text-zinc-400 text-zinc-600 dark:hover:text-zinc-200 hover:text-zinc-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
