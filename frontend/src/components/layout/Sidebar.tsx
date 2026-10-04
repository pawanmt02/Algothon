'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  IconRadar,
  IconLayoutDashboard,
  IconVideoPlus,
  IconHistory,
  IconShieldCheck,
  IconSettings,
  IconChartBar,
  IconBrain,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeItem?: string;
}

const navItems = [
  { href: '/dashboard', id: 'dashboard', icon: IconLayoutDashboard, label: 'Dashboard', badge: null },
  { href: '/login', id: 'login', icon: IconUser, label: 'Sign In / Account', badge: 'AUTH' },
  { href: '/dashboard', id: 'analyze', icon: IconVideoPlus, label: 'Analyze Video', badge: 'NEW' },
  { href: '/analysis/demo', id: 'demo', icon: IconShieldCheck, label: 'Demo Report', badge: null },
  { href: '/history', id: 'history', icon: IconHistory, label: 'History', badge: null },
  { href: '/reports', id: 'reports', icon: IconChartBar, label: 'Analytics', badge: null },
  { href: '/models', id: 'models', icon: IconBrain, label: 'AI Models', badge: null },
];

export default function Sidebar({ isOpen = true, onClose, activeItem }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 lg:relative lg:z-auto',
          'w-64 flex-shrink-0',
          'glass-dark border-r border-white/5',
          'flex flex-col',
          !isOpen && 'hidden lg:flex'
        )}
        initial={false}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00d4ff20, #7c3aed20)', border: '1px solid rgba(0,212,255,0.3)' }}
              >
                <IconRadar size={20} className="text-finradar-cyan" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-finradar-cyan/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="font-black text-white text-sm tracking-wider">FinRadar</span>
              <span className="text-finradar-cyan font-black text-sm"> AI</span>
              <div className="text-[10px] text-white/30 font-mono">ALGOTHON 26</div>
            </div>
          </Link>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white">
              <IconX size={20} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 mb-3">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Navigation</span>
          </div>
          {navItems.map((item, i) => {
            const isActive = activeItem ? activeItem === item.id : pathname === item.href;
            return (
              <motion.div
                key={item.href + item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                    isActive
                      ? 'bg-finradar-cyan/10 text-finradar-cyan border border-finradar-cyan/20'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-finradar-cyan" />
                  )}
                  <item.icon
                    size={18}
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-finradar-cyan' : 'text-white/40 group-hover:text-white/70'
                    )}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-finradar-cyan/10 text-finradar-cyan border border-finradar-cyan/20">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <IconSettings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <div className="px-3 py-2">
            <div className="text-[10px] font-mono text-white/20 leading-relaxed">
              v1.0.0 · Pawan Kumar M T<br />& Sachin M S
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
