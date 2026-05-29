import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  ShoppingBag, 
  CreditCard, 
  Info, 
  ChevronRight, 
  Gift, 
  Sparkles, 
  Clock, 
  Sliders, 
  User, 
  Menu, 
  X, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Heart 
} from 'lucide-react';
import { 
  PRODUCTS, 
  WHATSAPP_NUMBER, 
  BANK_DETAILS, 
  VERSE_WALLET_ADDRESS, 
  VERSE_LOGO_URL, 
  LOGO_PATH 
} from './constants';
import { SmartAdvisor } from './components/SmartAdvisor';
import { OrderTracker } from './components/OrderTracker';
import { PrefManager } from './components/PrefManager';
import { HealthyMealTracker } from './components/HealthyMealTracker';
import { SimulatedOrder } from './types';

// --- Sub-Components ---
interface ProductCardProps {
  product: typeof PRODUCTS[0];
  onSelect: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex bg-white/[0.06] backdrop-blur-[12px] mx-4 my-3 rounded-[14px] overflow-hidden shadow-lg text-white border border-white/10 group transition-all"
    id={`product-${product.id}`}
  >
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        referrerPolicy="no-referrer" 
      />
    </div>
    <div className="p-3 flex-1 flex flex-col justify-between">
      <div>
        <h4 className="font-bold text-gray-100 text-sm sm:text-base leading-tight">{product.name}</h4>
        {product.description && <p className="text-[10px] sm:text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>}
        <span className="font-bold text-[#b084ff] text-sm mt-1 inline-block">₦{product.numericPrice.toLocaleString()}</span>
      </div>
      <button 
        onClick={onSelect}
        className="bg-gradient-to-br from-[#4c1d95] to-[#6c2bd9] text-white py-1.5 px-3 mt-2 rounded-lg cursor-pointer font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1 w-fit"
        id={`select-btn-${product.id}`}
      >
        Select <ChevronRight size={12} />
      </button>
    </div>
  </motion.div>
);

interface OrderFormProps {
  selectedProduct: string;
  setSelectedProduct: (p: string) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  receiverName: string;
  setReceiverName: (n: string) => void;
  receiverPhone: string;
  setReceiverPhone: (p: string) => void;
  receiverLocation: string;
  setReceiverLocation: (l: string) => void;
  note: string;
  setNote: (n: string) => void;
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  selectedProduct,
  setSelectedProduct,
  quantity,
  setQuantity,
  receiverName,
  setReceiverName,
  receiverPhone,
  setReceiverPhone,
  receiverLocation,
  setReceiverLocation,
  note,
  setNote,
  paymentMethod,
  setPaymentMethod
}) => {

  const total = useMemo(() => {
    const product = PRODUCTS.find(p => p.name === selectedProduct);
    const basePrice = product ? product.numericPrice : 0;
    let t = (basePrice * quantity);
    if (paymentMethod === 'verse') t *= 0.9;
    return Math.round(t);
  }, [selectedProduct, quantity, paymentMethod]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Save to tracking list in localstorage first
    const newOrder: SimulatedOrder = {
      id: `HB-${Math.floor(1000 + Math.random() * 9000)}`,
      packageName: selectedProduct,
      quantity,
      receiverName,
      receiverPhone,
      receiverLocation,
      note,
      paymentMethod,
      total,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'placed',
      lastUpdated: Date.now()
    };

    try {
      const saved = localStorage.getItem('hungry_bird_orders');
      const orderList = saved ? JSON.parse(saved) : [];
      localStorage.setItem('hungry_bird_orders', JSON.stringify([newOrder, ...orderList]));
      // Emit trigger event
      window.dispatchEvent(new Event('hb_order_created'));
    } catch (err) {
      console.error('Error saving simulated order details', err);
    }

    const message = `Hello Hungry Bird.%0A%0A` +
      `Package: ${selectedProduct}%0A` +
      `Quantity: ${quantity}%0A` +
      `Receiver: ${receiverName}%0A` +
      `Phone: ${receiverPhone}%0A` +
      `Location: ${receiverLocation}%0A` +
      `Note: ${note}%0A` +
      `Payment: ${paymentMethod}%0A` +
      `Total: ₦${total.toLocaleString()}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const handleApplyPreferences = () => {
    try {
      const saved = localStorage.getItem('hungry_bird_prefs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.senderName) setReceiverName(parsed.senderName);
        if (parsed.senderPhone) setReceiverPhone(parsed.senderPhone);
        if (parsed.defaultLocation) setReceiverLocation(parsed.defaultLocation);
        if (parsed.dietaryRestriction) {
          setNote(prev => prev ? `${prev}\nDiet preference: ${parsed.dietaryRestriction}` : `Diet preference: ${parsed.dietaryRestriction}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white/[0.06] backdrop-blur-[12px] mx-4 p-6 rounded-[14px] border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.3)] text-white" 
      id="order-form-container"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Gift className="text-[#b084ff]" size={22} />
          <h3 className="text-xl font-bold tracking-tight">Send Food Package</h3>
        </div>
        <button
          type="button"
          onClick={handleApplyPreferences}
          className="text-[10px] font-black tracking-wide uppercase text-[#b084ff] border border-[#b084ff]/30 py-1 px-2.5 rounded hover:bg-[#b084ff]/10 active:scale-95 transition-all"
        >
          Autofill Profile Preferences ⚡
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4" id="checkout-form">
        <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 pl-1 uppercase tracking-wider">Select Food Package</label>
            <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)} 
                className="w-full p-3 rounded-lg border-none bg-white/10 text-white focus:ring-0 transition-all appearance-none text-sm font-medium"
                id="form-product-select"
            >
                {PRODUCTS.map(p => <option key={p.id} value={p.name} className="bg-[#1a0f2c]">{p.name} - {p.price}</option>)}
            </select>
        </div>

        <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 pl-1 uppercase tracking-wider">Portion Quantity</label>
            <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
                className="w-full p-3 rounded-lg border-none bg-white/10 text-white focus:ring-0 transition-all text-sm font-medium" 
                placeholder="Quantity"
                id="form-quantity-input"
            />
        </div>

        <div className="pt-4 space-y-3">
            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-widest px-1">Receiver Details</h4>
            
            <div className="space-y-1">
              <input 
                type="text" 
                name="receiver" 
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Receiver's Name" 
                required 
                className="w-full p-3 rounded-lg border-none bg-white/10 text-white placeholder:text-white/30 focus:ring-0 transition-all text-sm" 
                id="form-receiver-name"
              />
            </div>
            
            <div className="space-y-1">
              <input 
                type="tel" 
                name="phone" 
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="Receiver's Phone Number" 
                required 
                className="w-full p-3 rounded-lg border-none bg-white/10 text-white placeholder:text-white/30 focus:ring-0 transition-all text-sm" 
                id="form-receiver-phone"
              />
            </div>

            <div className="space-y-1">
              <input 
                type="text" 
                name="location" 
                value={receiverLocation}
                onChange={(e) => setReceiverLocation(e.target.value)}
                placeholder="Delivery Address / Landmark" 
                required 
                className="w-full p-3 rounded-lg border-none bg-white/10 text-white placeholder:text-white/30 focus:ring-0 transition-all text-sm" 
                id="form-receiver-location"
              />
            </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 pl-1 uppercase tracking-wider">Custom Message / Dietary Restrictions</label>
          <textarea 
            name="note" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Please deliver by 1PM, include a surprise card, diabetic-friendly food request, etc." 
            rows={3} 
            className="w-full p-3 rounded-lg border-none bg-white/10 text-white placeholder:text-white/30 focus:ring-0 transition-all resize-none text-sm"
            id="form-note-textarea"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 pl-1 uppercase tracking-wider">Payment Gateway</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            className="w-full p-3 rounded-lg border-none bg-white/10 text-white focus:ring-0 transition-all appearance-none text-sm font-medium"
            id="form-payment-select"
          >
            <option value="Pay on Delivery" className="bg-[#1a0f2c]">Pay on Delivery</option>
            <option value="verse" className="bg-[#1a0f2c]">Pay with Verse (10% off)</option>
          </select>
        </div>

        <div className="pt-2 px-1">
          <p className="text-[#b084ff] font-bold text-lg" id="form-total-display">
            Total: ₦{total.toLocaleString()}
          </p>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-br from-[#4c1d95] to-[#6c2bd9] text-white p-4 rounded-xl font-bold cursor-pointer hover:opacity-90 transition-all text-base shadow-lg active:scale-95"
          id="submit-order-btn"
        >
          Send Gifting Order on WhatsApp
        </button>
      </form>

      <AnimatePresence>
        {paymentMethod === 'verse' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-5 bg-white/5 border-2 border-[#7b2ff7]/30 rounded-xl text-center overflow-hidden verse-highlight"
            id="verse-payment-info"
          >
            <img src={VERSE_LOGO_URL} alt="Verse Logo" className="h-12 mb-3 mx-auto object-contain" referrerPolicy="no-referrer" />
            <p className="text-sm text-[#b084ff] font-extrabold uppercase tracking-wider mb-3">Pay with Verse & Save 10%</p>
            <div className="bg-white/10 p-3 rounded-lg border border-white/20">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Wallet Address</p>
              <p className="break-all text-xs font-mono select-all text-white">{VERSE_WALLET_ADDRESS}</p>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                 <Info size={12} />
                 <span>Copy address and pay in your Verse app</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab ] = useState<'order' | 'advisor' | 'tracker' | 'preferences' | 'healthTracker'>('order');
  const [showMenuPop, setShowMenuPop] = useState(false);

  // Form Pre-fill States
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].name);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Pay on Delivery');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverLocation, setReceiverLocation] = useState('');
  const [note, setNote] = useState('');

  // Handle re-fill from tracker
  const handleReorderFill = (
    packageName: string,
    qty: number,
    reName: string,
    rePhone: string,
    reLocation: string,
    reNote: string
  ) => {
    setSelectedProduct(packageName);
    setQuantity(qty);
    setReceiverName(reName);
    setReceiverPhone(rePhone);
    setReceiverLocation(reLocation);
    setNote(reNote);
    setActiveTab('order');
    scrollToSection('order-form-container');
  };

  // Handle apply recommendation
  const handleApplyRecommendation = (packName: string, notes: string) => {
    setSelectedProduct(packName);
    setNote(notes);
    setActiveTab('order');
    scrollToSection('order-form-container');
  };

  const scrollToSection = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const menuOptions = [
    {
      id: 'order',
      title: '🎁 Gifting Catalog',
      desc: 'Browse and order luxury chef-made culinary gift packages.',
      color: 'border-[#7b2ff7]/30 hover:bg-[#7b2ff7]/10'
    },
    {
      id: 'healthTracker',
      title: '🥗 Health Meal Tracker',
      desc: 'Monitor streaks, lock daily water logs, and save favorite recipes.',
      color: 'border-pink-500/30 hover:bg-pink-500/10'
    },
    {
      id: 'advisor',
      title: '✨ Smart Diet Matcher',
      desc: 'Discover your optimal chef-prepared boxes from nutrition goals.',
      color: 'border-emerald-500/30 hover:bg-emerald-500/10'
    },
    {
      id: 'tracker',
      title: '🕒 Order delivery Tracker',
      desc: 'Simulate and watch live cooking & courier distribution steps on timelines.',
      color: 'border-blue-500/30 hover:bg-blue-500/10'
    },
    {
      id: 'preferences',
      title: '⚙️ Settings Profile',
      desc: 'Define default delivery coordinates and custom dietary restrictions.',
      color: 'border-amber-500/30 hover:bg-amber-500/10'
    }
  ];

  return (
    <div className="min-h-screen pb-24 font-sans text-white bg-[#0a0f2c]">
      
      {/* HEADER BAR & INTERACTIVE APP LOGO SECTION */}
      <header className="text-center py-10 px-4 relative overflow-hidden" id="app-header">
        <div className="flex justify-between items-center max-w-2xl mx-auto px-4 mb-3">
          {/* Logo container style */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 p-2 px-3 rounded-xl bg-white/5 backdrop-blur-md shadow-md border border-white/10"
          >
            <img 
              src={LOGO_PATH} 
              alt="Hungry Bird Logo" 
              className="h-7 w-auto object-contain opacity-95" 
              referrerPolicy="no-referrer" 
            />
            <span className="text-xs font-black tracking-widest text-[#b084ff] uppercase">Hungry Bird</span>
          </motion.div>

          {/* Core Master Interactive Menu Button in Home Page */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={() => setShowMenuPop(true)}
            className="flex items-center gap-1.5 p-2 px-4 rounded-xl bg-gradient-to-r from-[#4c1d95] to-[#7b2ff7] text-white shadow-lg shadow-purple-900/30 border border-white/10 hover:brightness-110 active:scale-95 transition-all text-xs font-bold font-mono"
            id="home-menu-trigger-btn"
          >
            <Menu size={14} />
            <span>App Menu Hub</span>
          </motion.button>
        </div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="mt-6"
        >
          <h1 className="text-3xl font-black tracking-tight mb-1">Send Food to Loved One</h1>
          <p className="text-xs opacity-70 font-medium tracking-[0.05em]">Personalized, Healthy Meal preps powered by Verse</p>
        </motion.div>
      </header>
      
      <main className="max-w-2xl mx-auto space-y-6">
        
        {/* APP MENU GRID ON HOME PAGE (Lets users explore functions and choose the one they want) */}
        <div className="px-4">
          <div className="grid grid-cols-2 gap-2.5">
            {menuOptions.map(opt => (
              <button
                type="button"
                key={opt.id}
                onClick={() => {
                  setActiveTab(opt.id as any);
                  scrollToSection('console-workspace');
                }}
                className={`p-3.5 rounded-xl border text-left backdrop-blur-md bg-white/[0.03] hover:border-[#b084ff]/50 transition-all ${
                  activeTab === opt.id ? 'border-[#b084ff] bg-[#7b2ff7]/10' : 'border-white/10'
                }`}
                id={`dashboard-card-${opt.id}`}
              >
                <h4 className="font-bold text-xs text-white tracking-wide">{opt.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1 pl-0.5 line-clamp-2 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* VERSE PROMO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-4 p-5 rounded-2xl border border-[#7b2ff7]/30 text-center shadow-xl flex flex-col items-center bg-gradient-to-br from-[#4c1d1d95]/20 to-[#6c2bd9]/20 backdrop-blur-xl"
          id="verse-discount-banner"
        >
          <img 
            src={VERSE_LOGO_URL}
            className="h-8 mb-2 opacity-95"
            alt="Verse Logo"
            referrerPolicy="no-referrer"
          />
          <p className="text-[#b084ff] font-bold text-sm tracking-wide">
            Pay with Verse and get 10% discount on every order
          </p>
        </motion.div>

        {/* ACTIVE MODULE CONTAINER */}
        <div className="relative pt-2" id="console-workspace">
          
          {/* HORIZONTAL PILL SUBSECTION HEADER */}
          <div className="flex border-b border-white/5 mx-4 mb-6 overflow-x-auto no-scrollbar scroll-smooth gap-1">
            {[
              { id: 'order', label: 'Culinary Gift Packs', icon: Gift },
              { id: 'healthTracker', label: 'Health Tracker', icon: Heart },
              { id: 'advisor', label: 'Diet Matcher', icon: Sparkles },
              { id: 'tracker', label: 'Order Status Log', icon: Clock },
              { id: 'preferences', label: 'My Preferences', icon: User }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    scrollToSection('console-workspace');
                  }}
                  className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 font-bold text-xs whitespace-nowrap transition-all focus:outline-none ${
                    activeTab === tab.id 
                      ? 'border-[#b084ff] text-[#b084ff]' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                  id={`tab-pill-${tab.id}`}
                >
                  <IconComp size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'order' && (
              <motion.div
                key="tab-order"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="px-4">
                   <h2 className="text-xl font-bold flex items-center gap-2 mb-4 px-2" id="packs-section-title">
                     <div className="w-1.5 h-6 bg-[#b084ff] rounded-full" />
                     Select Gifting Pack
                   </h2>
                   <div className="space-y-4">
                     {PRODUCTS.map(product => (
                       <ProductCard 
                         key={product.id} 
                         product={product} 
                         onSelect={() => {
                           setSelectedProduct(product.name);
                           scrollToSection('order-form-container');
                         }}
                       />
                     ))}
                   </div>
                </div>

                <OrderForm 
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  receiverName={receiverName}
                  setReceiverName={setReceiverName}
                  receiverPhone={receiverPhone}
                  setReceiverPhone={setReceiverPhone}
                  receiverLocation={receiverLocation}
                  setReceiverLocation={setReceiverLocation}
                  note={note}
                  setNote={setNote}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              </motion.div>
            )}

            {activeTab === 'advisor' && (
              <motion.div
                key="tab-advisor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SmartAdvisor onSelectRecommendedPack={handleApplyRecommendation} />
              </motion.div>
            )}

            {activeTab === 'tracker' && (
              <motion.div
                key="tab-tracker"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <OrderTracker onReorder={handleReorderFill} />
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="tab-preferences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PrefManager />
              </motion.div>
            )}

            {activeTab === 'healthTracker' && (
              <motion.div
                key="tab-healthTracker"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <HealthyMealTracker onSelectProductWithNote={handleApplyRecommendation} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-16 mb-12 text-center px-4" id="app-footer">
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Secure Payments Powered by</span>
            <img 
              src={VERSE_LOGO_URL} 
              alt="Verse" 
              className="h-8 opacity-70 filter brightness-110" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <p className="text-[10px] text-white/40 mt-8 font-medium tracking-[0.3em] uppercase">© 2026 Hungry Bird Global</p>
        </footer>
      </main>

      {/* Floating WhatsApp Button */}
      <motion.a 
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href={`https://wa.me/${WHATSAPP_NUMBER}`} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 flex items-center justify-center hover:bg-[#128C7E] transition-colors"
        id="whatsapp-floating-trigger"
      >
        <MessageCircle size={28} />
      </motion.a>

      {/* INTERACTIVE MENU OVERLAY MODAL */}
      <AnimatePresence>
        {showMenuPop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            id="mobile-menu-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md p-6 rounded-2xl bg-[#14183a] border border-white/10 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowMenuPop(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-90 transition-all text-white/70 hover:text-white"
                id="close-menu-pop-btn"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 mb-5 pt-1">
                <div className="p-2 rounded-lg bg-[#7b2ff7]/30 text-[#b084ff]">
                    <Sliders size={20} />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Smart Console Hub</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Explore all helper functions of Hungry Bird</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'order', title: '🎁 Send Foods & Gifting packs', desc: 'Browse the checkout form and select curated luxury kitchen preps.', icon: Gift, border: 'border-l-4 border-l-[#7b2ff7]' },
                  { id: 'healthTracker', title: '🥗 Healthy Streak meal log Tracker', desc: 'Track streaks, monitor water glasses, configure raw favorites.', icon: Heart, border: 'border-l-4 border-l-pink-500' },
                  { id: 'advisor', title: '✨ Personalized Diet Matcher', desc: 'Determine optimized nutrition packages tailored for health objectives.', icon: Sparkles, border: 'border-l-4 border-l-emerald-500' },
                  { id: 'tracker', title: '🕒 Live Order delivery tracking', desc: 'Track preparation in our kitchen, delivery rider assignments, and drops.', icon: Clock, border: 'border-l-4 border-l-blue-500' },
                  { id: 'preferences', title: '⚙️ My Saved Profile settings', desc: 'Register default target names and custom allergen triggers.', icon: User, border: 'border-l-4 border-l-amber-500' }
                ].map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        setActiveTab(opt.id as any);
                        setShowMenuPop(false);
                        scrollToSection('console-workspace');
                      }}
                      className={`w-full text-left p-3.5 rounded-xl bg-white/5 border border-white/5 transition-all outline-none flex gap-3 ${opt.border} hover:bg-white/10 hover:translate-x-1`}
                      id={`menu-overlay-button-${opt.id}`}
                    >
                      <div className="p-1.5 self-center rounded-lg bg-white/5 text-[#b084ff]">
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-xs text-white flex items-center gap-1">
                          <span>{opt.title}</span>
                          <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 pl-0.5 leading-normal">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-[9px] text-center text-gray-500 mt-6 font-semibold uppercase tracking-wider">
                Hungry Bird Global Console v1.2
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
