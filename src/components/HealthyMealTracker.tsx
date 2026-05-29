import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Plus, 
  Trash2, 
  Heart, 
  Award, 
  Droplet, 
  Check, 
  ChevronRight, 
  Sparkles, 
  Utensils, 
  Calendar, 
  Dumbbell, 
  ChevronDown, 
  Info,
  Gift
} from 'lucide-react';
import { DailyLog, FavoriteMeal } from '../types';
import { PRODUCTS } from '../constants';

interface HealthyMealTrackerProps {
  onSelectProductWithNote: (productName: string, noteText: string) => void;
}

// Initial seed data to give immediate visual feedback of progress, streaks and charts
const SEED_LOGS: Record<string, DailyLog> = {
  '2026-05-25': {
    dateKey: '2026-05-25',
    breakfast: 'Oatmeal & Banana',
    lunch: 'Grilled Chicken Salad with avocado',
    dinner: 'Salmon fillets with broccoli',
    snack: 'Mixed walnuts and Greek yogurt',
    waterCups: 8,
    isHighProtein: true,
    isHighFiber: true,
    isLowSugar: true,
    calorieEst: 1850
  },
  '2026-05-26': {
    dateKey: '2026-05-26',
    breakfast: 'Chia Seed Pudding with strawberries',
    lunch: 'Brown Rice with turkey slice & steamed greens',
    dinner: 'Quinoa & baked cod',
    snack: 'Apple with peanut butter',
    waterCups: 7,
    isHighProtein: true,
    isHighFiber: true,
    isLowSugar: true,
    calorieEst: 1900
  },
  '2026-05-27': {
    dateKey: '2026-05-27',
    breakfast: 'Scrambled eggs with spinach',
    lunch: 'Wholewheat wraps with tuna salad',
    dinner: 'Stir fried vegetables with tofu',
    snack: 'Protein shake',
    waterCups: 6,
    isHighProtein: true,
    isHighFiber: false,
    isLowSugar: true,
    calorieEst: 1720
  },
  '2026-05-28': {
    dateKey: '2026-05-28',
    breakfast: 'Fruit smoothie with hemp seeds',
    lunch: 'Lentil soup & brown rice',
    dinner: 'Baked chicken supreme with sweet potato mash',
    snack: 'Rice cakes with cottage cheese',
    waterCups: 8,
    isHighProtein: true,
    isHighFiber: true,
    isLowSugar: false,
    calorieEst: 1980
  }
};

const SEED_FAVORITES: FavoriteMeal[] = [
  {
    id: 'fav-1',
    name: 'Grilled Chicken & Quinoa Energy Prep',
    category: 'High Protein',
    calories: 550,
    proteinGrams: 45,
    notes: 'Chefs suggestion: Add premium olive oil drizzle.'
  },
  {
    id: 'fav-2',
    name: 'Oats & Berries High-Fiber Support Bowl',
    category: 'Fiber Packed',
    calories: 380,
    proteinGrams: 14,
    notes: 'Low sodium, highly filling, superb for breakfast digests'
  },
  {
    id: 'fav-3',
    name: 'Low Carb Baked Cod and Asparagus',
    category: 'Low Carb',
    calories: 320,
    proteinGrams: 35,
    notes: 'Great ketogenic and cardiac health support'
  }
];

export const HealthyMealTracker: React.FC<HealthyMealTrackerProps> = ({ onSelectProductWithNote }) => {
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Today Date details
  const todayKey = new Date().toISOString().split('T')[0];
  
  // Tab within Health Tracker block
  const [activeSubTab, setActiveSubTab] = useState<'log' | 'favorites'>('log');

  // Input states for logging today
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [snack, setSnack] = useState('');
  const [waterCups, setWaterCups] = useState(4);
  const [isHighProtein, setIsHighProtein] = useState(false);
  const [isHighFiber, setIsHighFiber] = useState(false);
  const [isLowSugar, setIsLowSugar] = useState(false);
  const [calorieEst, setCalorieEst] = useState(1800);

  // New favorite form states
  const [newFavName, setNewFavName] = useState('');
  const [newFavCategory, setNewFavCategory] = useState<'High Protein' | 'Low Carb' | 'Fiber Packed' | 'Balanced'>('Balanced');
  const [newFavCalories, setNewFavCalories] = useState(400);
  const [newFavProtein, setNewFavProtein] = useState(25);
  const [newFavNotes, setNewFavNotes] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem('hb_health_logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      } else {
        // Prep seed data so page doesn't look empty and dull
        localStorage.setItem('hb_health_logs', JSON.stringify(SEED_LOGS));
        setLogs(SEED_LOGS);
      }

      const savedFavs = localStorage.getItem('hb_health_favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      } else {
        localStorage.setItem('hb_health_favorites', JSON.stringify(SEED_FAVORITES));
        setFavorites(SEED_FAVORITES);
      }
    } catch (e) {
      console.error('Error loading health tracker storage logs', e);
    }
  }, []);

  // Update today's log inputs if today already exists in the loaded state
  useEffect(() => {
    if (logs[todayKey]) {
      const todayLog = logs[todayKey];
      setBreakfast(todayLog.breakfast || '');
      setLunch(todayLog.lunch || '');
      setDinner(todayLog.dinner || '');
      setSnack(todayLog.snack || '');
      setWaterCups(todayLog.waterCups || 0);
      setIsHighProtein(todayLog.isHighProtein || false);
      setIsHighFiber(todayLog.isHighFiber || false);
      setIsLowSugar(todayLog.isLowSugar || false);
      setCalorieEst(todayLog.calorieEst || 1800);
    }
  }, [logs, todayKey]);

  // Handle Save Daily Log
  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedLogs = {
      ...logs,
      [todayKey]: {
        dateKey: todayKey,
        breakfast,
        lunch,
        dinner,
        snack,
        waterCups,
        isHighProtein,
        isHighFiber,
        isLowSugar,
        calorieEst
      }
    };
    try {
      localStorage.setItem('hb_health_logs', JSON.stringify(updatedLogs));
      setLogs(updatedLogs);
      triggerNotification('Diet log saved for today! Keep up the brilliant habit!');
    } catch (err) {
      console.error(err);
    }
  };

  // Add Favorite Meal
  const handleAddFavorite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFavName.trim()) return;

    const newFav: FavoriteMeal = {
      id: `fav-${Date.now()}`,
      name: newFavName,
      category: newFavCategory,
      calories: newFavCalories,
      proteinGrams: newFavProtein,
      notes: newFavNotes
    };

    const updatedFavs = [newFav, ...favorites];
    try {
      localStorage.setItem('hb_health_favorites', JSON.stringify(updatedFavs));
      setFavorites(updatedFavs);
      setNewFavName('');
      setNewFavNotes('');
      triggerNotification('Gourmet meal added to your Favorites list!');
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Favorite
  const handleDeleteFav = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    try {
      localStorage.setItem('hb_health_favorites', JSON.stringify(updated));
      setFavorites(updated);
      triggerNotification('Favorite removed');
    } catch (err) {
      console.error(err);
    }
  };

  // Pre-fill log from favorite meal
  const handlePreFillMeal = (fav: FavoriteMeal, targetMeal: 'breakfast' | 'lunch' | 'dinner') => {
    if (targetMeal === 'breakfast') {
      setBreakfast(fav.name);
    } else if (targetMeal === 'lunch') {
      setLunch(fav.name);
    } else {
      setDinner(fav.name);
    }
    
    // Automatically flag nutritional goals
    if (fav.category === 'High Protein') setIsHighProtein(true);
    if (fav.category === 'Fiber Packed') setIsHighFiber(true);
    if (fav.calories) setCalorieEst(fav.calories + 1000); // adjust estimates nicely

    triggerNotification(`Injected "${fav.name}" into your ${targetMeal} log!`);
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // STREAK CALCULATOR
  // Walks backward from today (or the latest log) and counts how many consecutive calendar days have any healthy tracking log saved
  const calculateStreak = () => {
    const listDates = Object.keys(logs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    if (listDates.length === 0) return 0;

    let streakCount = 0;
    const testDate = new Date(); // Start checking from today

    while (true) {
      const dateStringCheck = testDate.toISOString().split('T')[0];
      if (logs[dateStringCheck]) {
        streakCount++;
        // Go 1 day back
        testDate.setDate(testDate.getDate() - 1);
      } else {
        // If they missed today, check if yesterday was logged to preserve streak if today isn't logged yet
        if (dateStringCheck === todayKey) {
          testDate.setDate(testDate.getDate() - 1);
          const yesterdayString = testDate.toISOString().split('T')[0];
          if (logs[yesterdayString]) {
            // Yes yesterday exists, continue tracking backwards
            continue;
          }
        }
        break;
      }
    }
    return streakCount;
  };

  const currentStreak = calculateStreak();

  // Weekly scoring helper (percentage calculation based on milestones of logged days)
  const getWeeklyDates = () => {
    const days = [];
    const dateRunner = new Date();
    // Offset to start 6 days ago (total 7 days including today)
    dateRunner.setDate(dateRunner.getDate() - 6);

    for (let i = 0; i < 7; i++) {
      const dateKeyStr = dateRunner.toISOString().split('T')[0];
      const dayShortName = dateRunner.toLocaleDateString([], { weekday: 'short' });
      const dayNum = dateRunner.getDate();
      days.push({
        dateKey: dateKeyStr,
        dayName: dayShortName,
        dayNumber: dayNum
      });
      dateRunner.setDate(dateRunner.getDate() + 1);
    }
    return days;
  };

  const weeklyData = getWeeklyDates().map(day => {
    const log = logs[day.dateKey];
    let score = 0;
    if (log) {
      if (log.waterCups >= 6) score += 25;
      if (log.isHighProtein) score += 25;
      if (log.isHighFiber) score += 25;
      if (log.isLowSugar) score += 25;
    }
    return {
      ...day,
      score,
      logged: !!log,
      details: log
    };
  });

  // Calculate generic advice based on logged metrics
  const getSmartAdvisory = () => {
    const todayLog = logs[todayKey];
    if (!todayLog) {
      return {
        prompt: 'You have not logged meals for today yet!',
        advice: 'Log ingredients for breakfast or apply one of your Favorite meals below to construct your nutrient score map.',
        recommendedPack: PRODUCTS[0], // Breakfast Pack
        noteFill: 'Order for healthy energy breakfast start!'
      };
    }

    if (todayLog.waterCups < 5) {
      return {
        prompt: 'Your hydration level looks low today!',
        advice: 'You have logged only ' + todayLog.waterCups + ' cups of water. Supplement hydration with our organic Breakfast Support Pack, rich in high-water content chia seeds & electrolyte juices.',
        recommendedPack: PRODUCTS.find(p => p.id === 'breakfast-support') || PRODUCTS[0],
        noteFill: 'Order to supplement lower body-water levels'
      };
    }

    if (!todayLog.isHighProtein) {
      return {
        prompt: 'High Quality Protein Threshold unmet today',
        advice: 'Protein supports skeletal muscle preservation and dynamic fullness hormones. Select the Hungry Bird Full Meal Pack to inject 45g of clean premium proteins.',
        recommendedPack: PRODUCTS.find(p => p.id === 'full-meal') || PRODUCTS[2],
        noteFill: 'Incorporate extra premium protein counts into meal plan'
      };
    }

    if (!todayLog.isHighFiber) {
      return {
        prompt: 'Fiber intake is currently running low',
        advice: 'Fiber is vital for intestinal wellness. Adding family vegetables and whole food portions helps. Order the Family Food Support Pack to support your digestive health.',
        recommendedPack: PRODUCTS.find(p => p.id === 'family-food') || PRODUCTS[1],
        noteFill: 'Increase fibrous greens and nutritious complex food intake'
      };
    }

    // Default fully complete
    return {
      prompt: 'Absolute nutritional gold star performance!',
      advice: 'You have met your healthy milestones, hydration targets and low-sugar limits today! Spread the clean fitness aura by sending a healthy Gifting Pack to a colleague or close family relative.',
      recommendedPack: PRODUCTS[2], // Full meal support
      noteFill: 'Sending nutritious wellness support with care!'
    };
  };

  const adviceObj = getSmartAdvisory();

  return (
    <div className="bg-white/[0.06] backdrop-blur-[12px] mx-4 p-6 rounded-[20px] border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.3)] text-white">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Heart className="text-[#b084ff] animate-pulse" size={22} />
          <h3 className="text-xl font-black tracking-tight font-sans">Healthy Meal Tracker</h3>
        </div>
        
        {/* Dynamic Streak Indicator */}
        <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full text-orange-400">
          <Flame size={16} className={`${currentStreak > 0 ? 'fill-orange-400 animate-bounce' : ''}`} />
          <span className="text-xs font-black tracking-tight">{currentStreak} Day Streak</span>
        </div>
      </div>

      <p className="text-xs text-gray-300 mb-6 leading-relaxed">
        Achieve wellness landmarks by logging eating habits and monitoring macro health metrics.
      </p>

      {/* FLASH NOTIFICATION BANNER */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-2.5 text-center text-xs font-black tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVE STREAK CAPTION */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-6 flex items-start gap-3">
        <div className="p-2 bg-[#7b2ff7]/20 rounded-lg text-[#b084ff] flex-shrink-0">
          <Award size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Streak Achievements</h4>
          <p className="text-[11px] text-gray-300 mt-1 leading-normal">
            {currentStreak > 0 
              ? `Incredible dedication! You have successfully established a ${currentStreak}-day healthy meal streak. Keep supporting cellular health!`
              : "Start fresh today! Record your first clean meal entry to capture high-fever fitness milestones and earn streak achievements."}
          </p>
        </div>
      </div>

      {/* NUTRITION VISUALIZER / WEEKLY PERFORMANCE CHART */}
      <div className="mb-6 bg-white/[0.04] p-4 rounded-xl border border-white/5">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3.5 font-mono">My Weekly Diet Log Score %</h4>
        
        {/* Customized Flex Bar Chart */}
        <div className="flex items-end justify-between h-24 pt-2 px-1">
          {weeklyData.map((day) => (
            <div key={day.dateKey} className="flex flex-col items-center flex-1 group">
              <div className="w-full max-w-[24px] bg-white/10 h-16 rounded-t-md relative overflow-hidden flex items-end">
                {/* Score bar */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${day.score}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`w-full rounded-t-sm ${
                    day.score === 100 
                      ? 'bg-gradient-to-t from-[#4c1d95] to-emerald-400' 
                      : day.score >= 50 
                      ? 'bg-gradient-to-t from-[#4c1d95] to-[#7b2ff7]' 
                      : day.score > 0 
                      ? 'bg-[#7b2ff7]/40' 
                      : 'bg-transparent'
                  }`}
                />
                
                {/* TOOLTIP ON HOVER */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 bg-[#14183a]/95 text-white text-[9px] p-2 rounded border border-white/20 shadow-xl whitespace-nowrap leading-tight">
                  <p className="font-extrabold">{day.dayName} {day.dayNumber}</p>
                  {day.logged ? (
                    <>
                      <p className="text-[#b084ff] font-bold">Score: {day.score}%</p>
                      <p className="text-gray-400 font-mono text-[8px] mt-0.5">Water: {day.details?.waterCups}/8 c</p>
                      <p className="text-gray-400 font-mono text-[8px]">Prot: {day.details?.isHighProtein ? 'Yes' : 'No'}</p>
                      <p className="text-gray-400 font-mono text-[8px]">Fiber: {day.details?.isHighFiber ? 'Yes' : 'No'}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">No logs captured</p>
                  )}
                </div>
              </div>
              <span className={`text-[9px] mt-2 font-black ${day.dateKey === todayKey ? 'text-[#b084ff]' : 'text-gray-405 opacity-60'}`}>
                {day.dayName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TRACKER INNER TAB SELECT */}
      <div className="flex bg-white/5 rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => setActiveSubTab('log')}
          className={`flex-1 py-1.5 text-center font-bold text-xs rounded-md transition-all ${
            activeSubTab === 'log' ? 'bg-[#7b2ff7] text-white shadow-md' : 'text-gray-400'
          }`}
        >
          Daily log details
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('favorites')}
          className={`flex-1 py-1.5 text-center font-bold text-xs rounded-md transition-all ${
            activeSubTab === 'favorites' ? 'bg-[#7b2ff7] text-white shadow-md' : 'text-gray-400'
          }`}
        >
          My Meal Favorites ({favorites.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'log' && (
          <motion.div
            key="subtab-log"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {/* SAVED TODAY LOG INDICATOR */}
            {logs[todayKey] && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="stroke-[3]" size={16} />
                  <span>Today's health logs are fully cached!</span>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#25D366]">Locked</span>
              </div>
            )}

            {/* MEAL INTAKE INPUT FORM */}
            <form onSubmit={handleSaveLog} className="space-y-4">
              <h4 className="text-xs font-bold text-[#b084ff] uppercase tracking-wider pl-1 font-mono">Today's Gourmet Plates</h4>
              
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Breakfast Slot</label>
                    <input
                      type="text"
                      value={breakfast}
                      onChange={(e) => setBreakfast(e.target.value)}
                      placeholder="e.g., Avocado Poached Toast..."
                      className="w-full p-2.5 rounded-lg border-none bg-white/10 text-xs text-white placeholder:text-white/20 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Lunch Slot</label>
                    <input
                      type="text"
                      value={lunch}
                      onChange={(e) => setLunch(e.target.value)}
                      placeholder="e.g., Spicy Grilled Chicken & Rice"
                      className="w-full p-2.5 rounded-lg border-none bg-white/10 text-xs text-white placeholder:text-white/20 focus:ring-0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Dinner Slot</label>
                    <input
                      type="text"
                      value={dinner}
                      onChange={(e) => setDinner(e.target.value)}
                      placeholder="e.g., Baked Salmon & Asparagus"
                      className="w-full p-2.5 rounded-lg border-none bg-white/10 text-xs text-white placeholder:text-white/20 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Snack / Side Slot</label>
                    <input
                      type="text"
                      value={snack}
                      onChange={(e) => setSnack(e.target.value)}
                      placeholder="e.g., Greek Yogurt, Raw Almonds"
                      className="w-full p-2.5 rounded-lg border-none bg-white/10 text-xs text-white placeholder:text-white/20 focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* DYNAMIC WATER GLIDE SELECTOR */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1 font-mono flex items-center gap-1.5">
                    <Droplet size={12} className="text-blue-400 fill-blue-400" />
                    Hydration level (Water Intake)
                  </span>
                  <span className="text-xs font-black text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    {waterCups} / 8 Cups
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white/5 p-3 rounded-lg border border-white/5 justify-between">
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const cupIndex = idx + 1;
                    const isActive = waterCups >= cupIndex;
                    return (
                      <button
                        type="button"
                        key={cupIndex}
                        onClick={() => setWaterCups(cupIndex)}
                        className={`w-7 h-10 rounded-b-md relative flex items-end border-2 ${
                          isActive 
                            ? 'border-blue-400 bg-blue-500/20' 
                            : 'border-white/20 bg-transparent hover:border-white/40'
                        } transition-all active:scale-90`}
                        title={`Log ${cupIndex} cup(s)`}
                      >
                        {/* Interactive fluid container */}
                        {isActive && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: '70%' }}
                            className="absolute bottom-0 left-0 w-full bg-blue-500/40 rounded-b-[4px]"
                          />
                        )}
                        <span className={`text-[8px] mx-auto z-10 font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {cupIndex}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* HEALTH CONTROL milestons switches */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider pl-1 mb-2 font-mono">Today's Healthy Milestones</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'High Protein Met 💪', active: isHighProtein, setter: setIsHighProtein, desc: 'E.g., Chicken, Eggs, Salmon' },
                    { label: 'High Fiber Met 🥗', active: isHighFiber, setter: setIsHighFiber, desc: 'E.g., Quinoa, Oats, Greens' },
                    { label: 'Sugar-Free Focus 🚫', active: isLowSugar, setter: setIsLowSugar, desc: 'Zero processed sugar' }
                  ].map((chk, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => chk.setter(!chk.active)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        chk.active 
                          ? 'border-violet-500 bg-violet-600/10 text-white' 
                          : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex gap-2 items-center">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          chk.active ? 'bg-[#7b2ff7] border-violet-400 text-white' : 'border-white/30 bg-transparent'
                        }`}>
                          {chk.active && <Check size={10} className="stroke-[3]" />}
                        </span>
                        <span className="text-xs font-bold block">{chk.label}</span>
                      </div>
                      <p className="text-[9px] text-gray-450 mt-1 pl-6 leading-tight">{chk.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* CALORIES ESTIMATION SLIDER */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center px-1 font-mono">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Calories Traps</label>
                  <span className="text-xs font-extrabold text-[#b084ff]">{calorieEst} kcal</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="3500"
                  step="50"
                  value={calorieEst}
                  onChange={(e) => setCalorieEst(Number(e.target.value))}
                  className="w-full accent-[#7b2ff7] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-gray-500 px-1 font-mono">
                  <span>800 kcal (Deficit)</span>
                  <span>2200 kcal</span>
                  <span>3500 kcal (Surplus)</span>
                </div>
              </div>

              {/* SAVE DAILY LOG BUTTON */}
              <button
                type="submit"
                className="w-full bg-gradient-to-br from-[#4c1d95] to-[#6c2bd9] text-white p-3.5 rounded-xl font-bold cursor-pointer hover:shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest font-mono"
              >
                Sync Today's Calorie & Habit Metrics
              </button>
            </form>

            {/* DYNAMIC SMART ADVICE & PRODUCT RECOMMENDATION BOARD */}
            <div className="p-4 bg-gradient-to-br from-[#14183a] to-[#200d3d]/90 border border-[#7b2ff7]/30 rounded-2xl relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
                <Sparkles size={120} className="text-purple-300" />
              </div>

              <div className="flex gap-2 items-center mb-2">
                <Sparkles className="text-yellow-400 fill-yellow-400" size={16} />
                <h5 className="text-xs font-bold uppercase text-white tracking-widest font-mono">My Smart Health Advisor</h5>
              </div>

              <p className="text-xs font-bold text-[#b084ff] leading-snug">{adviceObj.prompt}</p>
              <p className="text-[11px] text-gray-300 mt-1 leading-relaxed max-w-lg mb-4">{adviceObj.advice}</p>

              {adviceObj.recommendedPack && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <img 
                    src={adviceObj.recommendedPack.image} 
                    alt={adviceObj.recommendedPack.name} 
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h6 className="text-[11px] font-black leading-tight text-white">{adviceObj.recommendedPack.name}</h6>
                    <p className="text-[10px] text-gray-400">{adviceObj.recommendedPack.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectProductWithNote(adviceObj.recommendedPack.name, `Recommended by Healthy Meal Tracker for: ${adviceObj.noteFill}`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#7b2ff7] hover:bg-[#6c2bd9] text-white text-[10px] font-bold active:scale-95 transition-all text-nowrap"
                  >
                    <Gift size={10} />
                    <span>Send Pack</span>
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {activeSubTab === 'favorites' && (
          <motion.div
            key="subtab-favorites"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6"
          >
            {/* ADD MEAL TO FAVORITE RECIPES FORM */}
            <form onSubmit={handleAddFavorite} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3.5">
              <h4 className="text-xs font-black tracking-wider text-[#b084ff] uppercase font-mono flex items-center gap-1.5 mb-1">
                <Plus size={14} />
                Add Customized Gifting Meal Recipe
              </h4>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Favorite Meal Title</label>
                <input
                  type="text"
                  required
                  value={newFavName}
                  onChange={(e) => setNewFavName(e.target.value)}
                  placeholder="e.g., Organic Honey Oats Bowl & Fruit Mix"
                  className="w-full p-2.5 rounded-lg border-none bg-white/10 text-xs text-white placeholder:text-white/20 focus:ring-0"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Protein Group Filter</label>
                  <select
                    value={newFavCategory}
                    onChange={(e) => setNewFavCategory(e.target.value as any)}
                    className="w-full p-2 rounded-lg border-none bg-white/10 text-xs text-white focus:ring-0"
                  >
                    <option value="High Protein" className="bg-[#1a0f2c]">High Protein</option>
                    <option value="Low Carb" className="bg-[#1a0f2c]">Low Carb</option>
                    <option value="Fiber Packed" className="bg-[#1a0f2c]">Fiber Packed</option>
                    <option value="Balanced" className="bg-[#1a0f2c]">Balanced Intake</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Calories (kcal)</label>
                  <input
                    type="number"
                    min="10"
                    max="1500"
                    value={newFavCalories}
                    onChange={(e) => setNewFavCalories(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border-none bg-white/10 text-xs text-white focus:ring-0"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Protein grams (g)</label>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={newFavProtein}
                    onChange={(e) => setNewFavProtein(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border-none bg-white/10 text-xs text-white focus:ring-0"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-gray-400 pl-1">Healthy Chef Prep Notes</label>
                <input
                  type="text"
                  value={newFavNotes}
                  onChange={(e) => setNewFavNotes(e.target.value)}
                  placeholder="e.g., Allergen triggers: contains walnuts"
                  className="w-full p-2 rounded-lg border-none bg-white/10 text-xs text-white placeholder:text-white/20 focus:ring-0"
                />
              </div>

              <button
                type="submit"
                className="w-full p-2 bg-[#7b2ff7]/30 hover:bg-[#7b2ff7]/40 border border-[#7b2ff7]/55 text-white text-xs font-bold rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span>Add Favorite Gifting Meal Slot</span>
              </button>
            </form>

            {/* LIST OF SAVED FAVORITES */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider pl-1 font-mono">My Favorite Healthy Meals</h4>
              
              {favorites.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-gray-400">
                  <Utensils size={24} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-xs">No favorites added yet. Register custom meals above to allow rapid logging pre-fills.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-white/[0.08] transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h6 className="font-extrabold text-xs text-white">{fav.name}</h6>
                          <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded leading-none ${
                            fav.category === 'High Protein' 
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                              : fav.category === 'Fiber Packed' 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                              : fav.category === 'Low Carb' 
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                              : 'bg-white/10 text-gray-300'
                          }`}>
                            {fav.category}
                          </span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-gray-400 mt-1.5 font-mono">
                          <span>Est: <b className="text-white">{fav.calories} kcal</b></span>
                          <span>|</span>
                          <span>Protein: <b className="text-white">{fav.proteinGrams}g</b></span>
                        </div>
                        {fav.notes && (
                          <p className="text-[10px] italic text-gray-500 mt-1 font-sans">
                            Chef's note: {fav.notes}
                          </p>
                        )}
                      </div>

                      {/* ACTIONS BAR FOR EACH FAVORITE ELEMENT */}
                      <div className="flex items-center gap-2 self-stretch sm:self-auto pt-2.5 sm:pt-0 border-t border-white/5 sm:border-none justify-end">
                        <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 text-[10px] text-gray-300 font-bold items-center gap-0.5">
                          <span className="px-1 text-gray-400">Pre-fill:</span>
                          <button
                            type="button"
                            onClick={() => handlePreFillMeal(fav, 'breakfast')}
                            className="px-1.5 py-0.5 text-[8px] bg-[#7b2ff7]/30 rounded hover:bg-[#7b2ff7]/50 transition-all font-mono"
                          >
                            Breakfast
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePreFillMeal(fav, 'lunch')}
                            className="px-1.5 py-0.5 text-[8px] bg-[#7b2ff7]/30 rounded hover:bg-[#7b2ff7]/50 transition-all font-mono"
                          >
                            Lunch
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePreFillMeal(fav, 'dinner')}
                            className="px-1.5 py-0.5 text-[8px] bg-[#7b2ff7]/30 rounded hover:bg-[#7b2ff7]/50 transition-all font-mono"
                          >
                            Dinner
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteFav(fav.id)}
                          className="p-1 px-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-90 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK FOOTNOTE DISCLAIMER */}
      <div className="mt-6 flex gap-2 p-3 bg-white/[0.03] rounded-lg border border-white/5 leading-normal text-[9px] text-gray-400">
        <Info size={14} className="text-amber-500/80 flex-shrink-0 mt-0.5" />
        <p>This tracking is private and sandbox local to this browser context. Tips and recommendations are customized rule suggestions to encourage clean eating, protein balances, and healthy water levels.</p>
      </div>

    </div>
  );
};
