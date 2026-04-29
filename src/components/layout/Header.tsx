import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, Zap, Sun, Moon, AlertCircle, Info, Settings, LogOut, User } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const { simulateOrder, theme, toggleTheme, alerts, markAlertsRead, clearAlerts } = useSystem();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant h-14 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-on-surface-variant">
          <Menu size={20} />
        </button>
        <span className="text-lg font-bold tracking-tight text-on-surface md:hidden">OpsControl</span>
        
        <div className="hidden md:flex relative w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input 
            type="text" 
            placeholder="Search traces, orders, entities..." 
            className="w-full pl-9 pr-4 py-1.5 bg-surface-container border border-outline-variant rounded text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={simulateOrder} 
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary text-on-primary rounded text-label-caps hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Zap size={14} />
          Inject Order Event
        </button>
        <button 
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
              if (!showNotifications && unreadCount > 0) markAlertsRead();
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors relative ${showNotifications ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error"></span>}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg overflow-hidden flex flex-col z-50 text-on-surface"
              >
                <div className="p-3 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container/50">
                  <h3 className="font-medium text-body-sm">Notifications</h3>
                  {alerts.length > 0 && (
                     <button onClick={(e) => { e.stopPropagation(); clearAlerts(); }} className="text-[11px] text-outline hover:text-primary transition-colors">Clear All</button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="p-4 text-center text-outline text-body-sm">No new notifications</div>
                  ) : (
                    alerts.map(alert => (
                      <div key={alert.id} className={`p-3 border-b border-outline-variant/10 flex gap-3 ${!alert.read ? 'bg-primary-container/10' : ''}`}>
                        <div className={`mt-0.5 ${alert.type === 'error' ? 'text-error' : alert.type === 'warning' ? 'text-amber-500' : 'text-primary'}`}>
                          {alert.type === 'error' ? <AlertCircle size={16} /> : <Info size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-body-sm leading-tight text-on-surface">{alert.message}</p>
                          <p className="text-[10px] text-outline mt-1">{alert.timestamp}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full bg-primary-container text-[var(--color-primary)] flex items-center justify-center font-bold text-xs ring-1 ring-outline-variant"
          >
            AD
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg overflow-hidden flex flex-col z-50 text-on-surface"
              >
                <div className="p-4 border-b border-outline-variant bg-surface-container/50">
                  <p className="font-medium text-body-sm">Admin Desktop</p>
                  <p className="text-[11px] text-outline mt-0.5">admin@opscontrol.local</p>
                </div>
                <div className="p-1">
                  <button className="w-full text-left px-3 py-2 text-body-sm hover:bg-surface-container-low rounded transition-colors flex items-center gap-2">
                    <User size={14} className="text-outline" /> Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-body-sm hover:bg-surface-container-low rounded transition-colors flex items-center gap-2">
                    <Settings size={14} className="text-outline" /> Settings
                  </button>
                  <div className="my-1 border-t border-outline-variant/50"></div>
                  <button className="w-full text-left px-3 py-2 text-body-sm text-error hover:bg-error-container/20 rounded transition-colors flex items-center gap-2">
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Backdrop for clicking outside */}
      {(showNotifications || showProfile) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
}
