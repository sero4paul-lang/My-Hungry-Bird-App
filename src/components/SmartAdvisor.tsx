import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Activity, Heart, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { PRODUCTS } from '../constants';

interface SmartAdvisorProps {
  onSelectRecommendedPack: (packName: string, notes: string) => void;
}

export const SmartAdvisor: React.FC<SmartAdvisorProps> = ({ onSelectRecommendedPack }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [goal, setGoal] = useState<string>('');
  const [dietRule, setDietRule] = useState<string>('');

  const handleReset = () => {
    setGoal('');
    setDietRule('');
    setStep(1);
  };

  const getRecommendation = () => {
    // Determine recommendation based on user selections
    if (goal === 'Family Nutrition' || goal === 'Balanced Wellness') {
      return {
        product: PRODUCTS.find(p => p.id === 'family-food') || PRODUCTS[1],
        reason: 'Recommended for optimal family wellness and sharing. It features a complete range of slow-acting carbohydrates and rich proteins tailored for multiple portions and crowd-pleasing tastes.'
      };
    } else if (goal === 'Weight Management' || goal === 'Clean Fuel') {
      return {
        product: PRODUCTS.find(p => p.id === 'breakfast-support') || PRODUCTS[0],
        reason: 'Perfect for clean calories and quick premium energy. Highly recommended to keep blood sugar spikes minimum while supplying fast, heart-safe superfood vitamins.'
      };
    } else {
      return {
        product: PRODUCTS.find(p => p.id === 'full-meal') || PRODUCTS[2],
        reason: 'Chosen for ultimate protein-dense premium muscle fuel. Designed to satisfy deep nutritional thresholds, rich in macronutrients, premium protein sources, and complex carbs.'
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="bg-white/[0.06] backdrop-blur-[12px] mx-4 p-6 rounded-[20px] border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.3)] text-white">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-[#b084ff]" size={22} />
        <h3 className="text-xl font-black tracking-tight">Smart Diet Matcher</h3>
      </div>
      <p className="text-xs text-gray-300 mb-6">
        Let our smart kitchen helper suggest the perfect chef-selected meal prep based on your wellness aspirations.
      </p>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-sm font-bold text-gray-200">Step 1: What is your primary health goal?</p>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { label: 'Weight Management 🥗', desc: 'Sustain clean, controlled caloric deficits easily' },
                { label: 'Clean Fuel 💪', desc: 'High protein energy to support muscle and sports' },
                { label: 'Balanced Wellness 💚', desc: 'Boost immune, gut integrity, and active vitality' },
                { label: 'Family Nutrition 🍲', desc: 'Robust meal portions that the whole household loves' }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.label}
                  onClick={() => {
                    setGoal(opt.label);
                    setStep(2);
                  }}
                  className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-[#7b2ff7]/20 hover:border-[#7b2ff7]/30 transition-all focus:outline-none"
                >
                  <div className="font-bold text-sm text-[#b084ff]">{opt.label}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-sm font-bold text-gray-200">Step 2: Any specific dietary focuses?</p>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { label: 'Standard Balanced', desc: 'General nutritionist-approved ingredients' },
                { label: 'Gluten-Free Focus', desc: 'Sourced with completely wheat-free grains' },
                { label: 'Low Sodium / Sugar', desc: 'Carefully measured natural reduction' },
                { label: 'Ketogenic Friendly', desc: 'Higher quality healthy fats, lower starch' }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.label}
                  onClick={() => {
                    setDietRule(opt.label);
                    setStep(3);
                  }}
                  className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-[#7b2ff7]/20 hover:border-[#7b2ff7]/30 transition-all focus:outline-none"
                >
                  <div className="font-bold text-sm text-[#b084ff]">{opt.label}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-gray-400 underline pt-2"
            >
              Back to step 1
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-5"
          >
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#7b2ff7]/10 to-transparent border border-[#7b2ff7]/20 text-center">
              <span className="inline-block py-1 px-2.5 bg-[#7b2ff7]/30 rounded-full text-[10px] font-black tracking-widest text-[#d8c3ff] uppercase mb-2">
                YOUR OPTIMAL MATCH
              </span>
              <h4 className="text-lg font-black text-white">{recommendation.product.name}</h4>
              <p className="text-xs text-[#b084ff] font-bold mt-1">₦{recommendation.product.numericPrice.toLocaleString()}</p>
              
              <div className="relative w-full h-32 rounded-lg overflow-hidden mt-3 shadow-inner">
                <img src={recommendation.product.image} alt={recommendation.product.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <p className="text-xs text-gray-300 mt-3 leading-relaxed text-left italic">
                "{recommendation.reason}"
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/5 active:scale-95 transition-all"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
              <button
                type="button"
                onClick={() => onSelectRecommendedPack(
                  recommendation.product.name, 
                  `Match from Smart Advisor for: ${goal} (${dietRule}).`
                )}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4c1d95] to-[#7b2ff7] text-white p-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(123,47,247,0.3)] transition-all text-sm active:scale-95"
              >
                Apply to Gifting form <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
