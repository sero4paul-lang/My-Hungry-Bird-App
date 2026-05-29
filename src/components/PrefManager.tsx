import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Save, Trash2, ShieldCheck, Info } from 'lucide-react';
import { SavedPreferences } from '../types';

export const PrefManager: React.FC = () => {
  const [prefs, setPrefs] = useState<SavedPreferences>({
    senderName: '',
    senderPhone: '',
    defaultLocation: '',
    dietaryRestriction: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  // Load preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hungry_bird_prefs');
      if (saved) {
        setPrefs(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading preferences', e);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrefs(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('hungry_bird_prefs', JSON.stringify(prefs));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      // Trigger update event
      window.dispatchEvent(new Event('hb_prefs_updated'));
    } catch (e) {
      console.error('Error saving preferences', e);
    }
  };

  const handleClear = () => {
    const cleared = {
      senderName: '',
      senderPhone: '',
      defaultLocation: '',
      dietaryRestriction: ''
    };
    setPrefs(cleared);
    localStorage.removeItem('hungry_bird_prefs');
    setIsSaved(false);
    window.dispatchEvent(new Event('hb_prefs_updated'));
  };

  return (
    <div className="bg-white/[0.06] backdrop-blur-[12px] mx-4 p-6 rounded-[20px] border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.3)] text-white">
      <div className="flex items-center gap-2 mb-4">
        <User className="text-[#b084ff]" size={22} />
        <h3 className="text-xl font-black tracking-tight">Saved Preferences</h3>
      </div>
      <p className="text-xs text-gray-300 mb-6">
        Store your recipient defaults and customized dietary regulations. Your settings securely auto-populate checkout screens for speed.
      </p>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase pl-1 tracking-wider">Default Receiver Name</label>
          <input
            type="text"
            name="senderName"
            value={prefs.senderName}
            onChange={handleChange}
            placeholder="e.g. Grandma, My Aunt, Bro"
            className="w-full p-3 rounded-lg border-none bg-white/10 text-white placeholder:text-white/30 text-xs focus:ring-0"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase pl-1 tracking-wider">Default Receiver Phone</label>
          <input
            type="tel"
            name="senderPhone"
            value={prefs.senderPhone}
            onChange={handleChange}
            placeholder="e.g. +234 812 345 6789"
            className="w-full p-3 rounded-lg border-none bg-white/10 text-white placeholder:text-white/30 text-xs focus:ring-0"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase pl-1 tracking-wider">Default Delivery Address / Landmark</label>
          <input
            type="text"
            name="defaultLocation"
            value={prefs.defaultLocation}
            onChange={handleChange}
            placeholder="e.g. Victoria Island, Lagos"
            className="w-full p-3 rounded-lg border-none bg-white/10 text-white placeholder:text-white/30 text-xs focus:ring-0"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase pl-1 tracking-wider">Kitchen Dietary Instructions / Allergies</label>
          <textarea
            name="dietaryRestriction"
            value={prefs.dietaryRestriction}
            onChange={handleChange}
            placeholder="e.g. Diabetic-friendly, dairy-free, no peanuts, mild spicy"
            rows={2}
            className="w-full p-3 rounded-lg border-none bg-white/10 text-white placeholder:text-white/30 text-xs focus:ring-0 resize-none"
          />
        </div>

        <div className="pt-2 flex gap-2">
          {(prefs.senderName || prefs.senderPhone || prefs.defaultLocation || prefs.dietaryRestriction) && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-red-500/30 text-xs font-bold text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
            >
              <Trash2 size={14} />
              Reset
            </button>
          )}

          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4c1d95] to-[#7b2ff7] text-white p-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(123,47,247,0.3)] transition-all text-xs active:scale-95"
          >
            <Save size={14} />
            Save Preferences
          </button>
        </div>
      </form>

      {isSaved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] rounded-lg text-center flex items-center justify-center gap-1.5 text-xs font-bold"
        >
          <ShieldCheck size={14} />
          Preferences Saved Successfully!
        </motion.div>
      )}

      <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg flex gap-1.5 text-[10px] text-gray-400 leading-normal">
        <Info size={14} className="flex-shrink-0 text-amber-400 mt-0.5" />
        <p>This data stays cached privately in your secure browser sandbox. Hungry Bird respects absolute client-first metadata privacy constraints.</p>
      </div>
    </div>
  );
};
