'use client';
import { useState, useEffect } from 'react';
import { MonitorSmartphone, X, Download, CheckCircle2 } from 'lucide-react';

export default function PWAInstaller() {
  const [showPopup, setShowPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already running inside the standalone mobile app wrapper
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // 2. Capture the default browser PWA install availability trigger
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Auto-trigger prompt on load only if they haven't closed it this session
      const isDismissed = sessionStorage.getItem('pwa_dismissed');
      if (!isDismissed) {
        setShowPopup(true);
      }
    };

    // 3. FIX: Listen explicitly to the "Install Mobile App" click from the Footer
    const handleFooterClickTrigger = () => {
      // Force display the installation popup state
      setShowPopup(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('open-pwa-installer', handleFooterClickTrigger);

    // 4. Listen for completion confirmation from the mobile OS engine
    const handleSuccessInstall = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setTimeout(() => setShowPopup(false), 3000);
    };

    window.addEventListener('appinstalled', handleSuccessInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('open-pwa-installer', handleFooterClickTrigger);
      window.removeEventListener('appinstalled', handleSuccessInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    // FALLBACK RULE: If browser profile hasn't captured the device system capability prompt yet
    if (!deferredPrompt) {
      alert(
        "To install, use your browser options directly (Tap Chrome Menu ⋮ or Safari Share button, then choose 'Add to Home screen')."
      );
      setShowPopup(false);
      return;
    }

    // Trigger the native OS system engine prompt overlay
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const dismiss = () => {
    setShowPopup(false);
    sessionStorage.setItem('pwa_dismissed', 'true');
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-emerald-50 animate-in slide-in-from-bottom-10 duration-500">
        
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <MonitorSmartphone className="text-white w-8 h-8" />
          </div>
          {!isInstalled && (
            <button onClick={dismiss} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        {isInstalled ? (
          <div className="text-center py-4 animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Installation Started!</h3>
            <p className="text-slate-500 text-sm mt-2">Check your home screen in a few moments.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-slate-900 mb-2">BotanyHub App</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Install the Dhakuakhana College Botany app for instant access to AI tools and departmental updates.
            </p>

            <button 
              onClick={handleInstallClick}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-5 h-5" />
              Install to Home Screen
            </button>
          </>
        )}
      </div>
    </div>
  );
}