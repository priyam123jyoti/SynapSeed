"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/lib/utils';
import { Loader2, Plus, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Components
import { InputGroup } from '@/components/events/event-manager/InputGroup';
import { AdminLogin } from '@/components/events/event-manager/AdminLogin';
import { LiveDatabase } from '@/components/events/event-manager/LiveDatabase';

export default function EventAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Seminar');
  const [dateShort, setDateShort] = useState('');
  const [descShort, setDescShort] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const BUCKET_NAME = 'botany-events';

  // --- AUTH & DATA FETCHING ---
  
  useEffect(() => {
    const auth = sessionStorage.getItem('dept_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchEvents();
    }
  }, []);

  const fetchEvents = async () => {
    setFetching(true);
    // Crucial: We must select thumbnail and gallery so handleDelete knows what to delete
    const { data } = await supabase
      .from('events')
      .select('id, title, slug, date_short, thumbnail, gallery') 
      .order('created_at', { ascending: false });
    if (data) setEvents(data);
    setFetching(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === process.env.NEXT_PUBLIC_DEPT_PASSCODE) {
      setIsAuthenticated(true);
      sessionStorage.setItem('dept_auth', 'true');
      fetchEvents();
    } else {
      alert("❌ Invalid Passcode");
      setPasscode('');
    }
  };

  // --- HANDLERS ---

  const addObjective = () => setObjectives([...objectives, '']);
  const updateObjective = (index: number, val: string) => {
    const newObs = [...objectives];
    newObs[index] = val;
    setObjectives(newObs);
  };

  /**
   * FIXED DELETE FUNCTION
   * This now cleans up Supabase Storage before deleting the DB row.
   */
  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ This will permanently delete the event AND all images from the server. Continue?")) return;
    
    setLoading(true);
    try {
      // 1. Find the event in our local state to get the URLs
      const eventToCleanup = events.find((e) => e.id === id);
      if (!eventToCleanup) throw new Error("Event not found in local list.");

      // Helper: Converts full public URL to a relative storage path
      const getStoragePath = (url: string) => {
        if (!url) return null;
        const parts = url.split(`${BUCKET_NAME}/`);
        return parts.length > 1 ? decodeURIComponent(parts[1]) : null;
      };

      const filesToRemove: string[] = [];

      // 2. Extract Thumbnail path
      const thumbPath = getStoragePath(eventToCleanup.thumbnail);
      if (thumbPath) filesToRemove.push(thumbPath);

      // 3. Extract Gallery paths
      if (eventToCleanup.gallery && Array.isArray(eventToCleanup.gallery)) {
        eventToCleanup.gallery.forEach((url: string) => {
          const path = getStoragePath(url);
          if (path) filesToRemove.push(path);
        });
      }

      // 4. Physically remove files from Supabase Storage
      if (filesToRemove.length > 0) {
        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove(filesToRemove);
          
        if (storageError) {
          console.warn("Storage cleanup warning:", storageError.message);
        }
      }

      // 5. Delete the database record
      const { error: dbError } = await supabase.from('events').delete().eq('id', id);
      if (dbError) throw dbError;

      // 6. Update local UI state
      setEvents(events.filter((e) => e.id !== id));
      alert("✅ Event and all associated images deleted successfully.");
      
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!thumbFile || !title) return alert("Title and Thumbnail are required.");
    setLoading(true);
    try {
      const slug = generateSlug(title);
      
      // 1. Upload Thumbnail
      const thumbPath = `thumbnails/${slug}-${Date.now()}`;
      await supabase.storage.from(BUCKET_NAME).upload(thumbPath, thumbFile);
      const { data: tURL } = supabase.storage.from(BUCKET_NAME).getPublicUrl(thumbPath);

      // 2. Upload Gallery
      const galleryUrls = [];
      for (const file of galleryFiles) {
        const path = `gallery/${slug}/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        await supabase.storage.from(BUCKET_NAME).upload(path, file);
        const { data: gURL } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
        galleryUrls.push(gURL.publicUrl);
      }

      // 3. Insert Row
      const { error } = await supabase.from('events').insert({
        title, slug, category, date_short: dateShort,
        description_short: descShort, full_description: fullDesc,
        key_objectives: objectives.filter(o => o.trim() !== ''),
        thumbnail: tURL.publicUrl,
        gallery: galleryUrls
      });

      if (error) throw error;
      alert("Event Published!");
      window.location.reload(); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin passcode={passcode} setPasscode={setPasscode} onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <Link href="/events" className="group inline-flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-8 bg-white px-4 py-2 rounded-md shadow-sm border border-emerald-100 hover:bg-emerald-50 transition-all">
        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
        Back to Events
      </Link>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
          
          {/* LEFT: MAIN EDITOR */}
          <div className="lg:col-span-2 space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em]">Editor</span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">New Event</h1>
              </div>
              <button 
                onClick={handlePublish} 
                disabled={loading || !title}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                Publish Event
              </button>
            </header>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <InputGroup label="Event Title" value={title} onChange={setTitle} placeholder="e.g. Annual Botanical Seminar" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Display Date" value={dateShort} onChange={setDateShort} placeholder="e.g. 12 OCT" />
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Event Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Seminar</option>
                      <option>Field Trip</option>
                      <option>Workshop</option>
                      <option>Exhibition</option>
                    </select>
                  </div>
                </div>

                <InputGroup 
                  label="Summary (Cards)" 
                  value={descShort} 
                  onChange={setDescShort} 
                  placeholder="Appears on the main events listing..." 
                  maxLength={100} 
                  textarea 
                />
                
                <InputGroup 
                  label="Full Details" 
                  value={fullDesc} 
                  onChange={setFullDesc} 
                  placeholder="Detailed description of the event..." 
                  maxLength={1000} 
                  textarea 
                  rows={8} 
                />
            </div>
          </div>

          {/* RIGHT: SIDEBAR TOOLS */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Hero Thumbnail</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setThumbFile(e.target.files?.[0] || null)} 
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 font-bold cursor-pointer w-full" 
                  />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Gallery Upload</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))} 
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100 file:text-slate-700 font-bold cursor-pointer w-full" 
                  />
                  <p className="mt-2 text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                    {galleryFiles.length} images selected
                  </p>
                </div>
            </div>

            <div className="bg-emerald-900 p-6 rounded-2xl text-white shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-emerald-300">Key Objectives</h3>
              <div className="space-y-3">
                {objectives.map((obj, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      value={obj} 
                      onChange={(e) => updateObjective(i, e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2.5 text-xs outline-none focus:border-lime-400 placeholder:text-emerald-800"
                      placeholder="e.g. Biodiversity study"
                    />
                    <button 
                      onClick={() => setObjectives(objectives.filter((_, idx) => idx !== i))} 
                      className="text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addObjective} 
                  className="flex items-center gap-2 text-[10px] font-bold text-lime-400 mt-2 uppercase tracking-widest hover:text-white transition-colors"
                >
                  <Plus size={14} /> Add Objective
                </button>
              </div>
            </div>

            <LiveDatabase events={events} fetching={fetching} onDelete={handleDelete} />
          </div>

        </div>
      </div>
    </main>
  );
}