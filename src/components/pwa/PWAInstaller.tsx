'use client';
import { useState, useEffect } from 'react';
import { MonitorSmartphone, X, Download, Share } from 'lucide-react';

export default function PWAInstaller() {
  const [showPopup, setShowPopup] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    // 2. Check if user dismissed it recently
    const isDismissed = localStorage.getItem('pwa-ignore-until');
    if (isDismissed && Date.now() < parseInt(isDismissed)) return;

    // 3. Detect Platform
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
      setShowPopup(true);
    } else if (/android/.test(ua)) {
      setPlatform('android');
      // Android triggers "beforeinstallprompt" automatically, 
      // but we show our custom UI for a better experience
      setShowPopup(true);
    }
  }, []);

  const dismiss = () => {
    // Hide for 7 days
    const sevenDays = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('pwa-ignore-until', sevenDays.toString());
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-emerald-50 animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <MonitorSmartphone className="text-white w-8 h-8" />
          </div>
          <button onClick={dismiss} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">Install BotanyHub</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Get the full experience of the Dhakuakhana College Botany Portal. Fast, offline-ready, and easy to access from your home screen.
        </p>

        {platform === 'ios' ? (
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">How to Install</p>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <div className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm">
                <Share className="w-4 h-4 text-blue-500" />
              </div>
              <span>Tap the "Share" icon below</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <div className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-lg">＋</div>
              <span>Select "Add to Home Screen"</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => window.alert('Tap the three dots in your browser and select "Install App"')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-5 h-5" />
            Install as Mobile App
          </button>
        )}
      </div>
    </div>
  );
}