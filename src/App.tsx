import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ShoppingBag, CreditCard, Info, ChevronRight } from 'lucide-react';
import { 
  PRODUCTS, 
  LOCATIONS, 
  WHATSAPP_NUMBER, 
  BANK_DETAILS, 
  VERSE_WALLET_ADDRESS, 
  VERSE_LOGO_URL, 
  LOGO_PATH 
} from './constants';

// --- Sub-Components ---
interface ProductCardProps {
  product: typeof PRODUCTS[0];
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex bg-white/10 backdrop-blur-md mx-4 my-3 rounded-xl overflow-hidden shadow-lg text-white border border-white/10 group"
  >
    <div className="relative w-28 h-28 overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        referrerPolicy="no-referrer" 
      />
    </div>
    <div className="p-3 flex-1 flex flex-col justify-between">
      <div>
        <h4 className="font-bold text-gray-100">{product.name}</h4>
        {product.description && <p className="text-xs text-gray-300 mt-0.5 line-clamp-1">{product.description}</p>}
        {product.price && <span className="font-bold text-[#b084ff] text-sm">{product.price}</span>}
      </div>
      <button 
        onClick={() => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" })}
        className="bg-gradient-to-br from-[#4c1d95] to-[#6c2bd9] text-white py-1.5 px-3 mt-2 rounded-lg cursor-pointer font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1 w-fit"
      >
        Order Now <ChevronRight size={14} />
      </button>
    </div>
  </motion.div>
);

interface SectionProps {
  title: string;
  category: string;
  id: string;
}

const Section: React.FC<SectionProps> = ({ title, category, id }) => {
  const filteredProducts = PRODUCTS.filter(p => p.category === category);
  return (
    <div className="pb-4" id={id}>
      <div className="px-4 py-2 text-lg font-bold text-white drop-shadow-md flex items-center gap-2">
        <div className="w-1 h-6 bg-[#b084ff] rounded-full" />
        {title}
      </div>
      {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
};

const OrderForm = () => {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].name);
  const [quantity, setQuantity] = useState(1);
  const [locationFee, setLocationFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Pay on Delivery');

  const total = useMemo(() => {
    const product = PRODUCTS.find(p => p.name === selectedProduct);
    const basePrice = product ? product.numericPrice : 0;
    let t = (basePrice * quantity) + Number(locationFee);
    if (paymentMethod === 'verse') t *= 0.9;
    return Math.round(t);
  }, [selectedProduct, quantity, locationFee, paymentMethod]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = `Hello Hungry Bird.%0A%0AName: ${formData.get('name')}%0APhone: ${formData.get('phone')}%0AProduct: ${formData.get('product')}%0AQuantity: ${formData.get('quantity')}%0APayment: ${formData.get('payment')}%0ASubscription: ${formData.get('subscription')}%0AReferrer: ${formData.get('referrer')}%0ANote: ${formData.get('note')}%0ATotal: ₦${total}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md mx-4 p-5 rounded-2xl shadow-2xl text-white border border-white/10" 
      id="order"
    >
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="text-[#b084ff]" size={24} />
        <h3 className="text-xl font-bold">Place Your Order</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" name="name" placeholder="Your Name" required className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#b084ff]/50 transition-all" />
          <input type="tel" name="phone" placeholder="Phone Number" required className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#b084ff]/50 transition-all" />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-400 ml-1">Select Product</label>
          <select name="product" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#b084ff]/50 transition-all appearance-none">
            {PRODUCTS.map(p => <option key={p.id} value={p.name} className="bg-[#1a0f2c]">{p.name}</option>)}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 ml-1">Quantity</label>
            <input type="number" name="quantity" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#b084ff]/50 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 ml-1">Delivery Location</label>
            <select name="location" onChange={(e) => setLocationFee(Number(e.target.value))} className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#b084ff]/50 transition-all appearance-none">
              <option value="0" className="bg-[#1a0f2c]">Select Location</option>
              {LOCATIONS.map(loc => <option key={loc.name} value={loc.fee} className="bg-[#1a0f2c]">{loc.name} (+₦{loc.fee})</option>)}
            </select>
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-400 ml-1">Payment Method</label>
          <select name="payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#b084ff]/50 transition-all appearance-none">
            <option value="Pay on Delivery" className="bg-[#1a0f2c]">Pay on Delivery</option>
            <option value="Bank Transfer" className="bg-[#1a0f2c]">Bank Transfer</option>
            <option value="verse" className="bg-[#1a0f2c]">Pay with Verse (10% OFF ⭐)</option>
          </select>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
          <span className="text-gray-400 font-medium">Total Amount</span>
          <span className="text-2xl font-bold text-[#b084ff]">₦{total.toLocaleString()}</span>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-400 ml-1">Subscription Plan</label>
          <select name="subscription" className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#b084ff]/50 transition-all appearance-none">
            <option className="bg-[#1a0f2c]">No Subscription</option>
            <option className="bg-[#1a0f2c]">Weekly Family Pack</option>
            <option className="bg-[#1a0f2c]">Kids Snack Pack</option>
            <option className="bg-[#1a0f2c]">Office Pack</option>
          </select>
        </div>
        
        <input type="text" name="referrer" placeholder="Referral Code (optional)" className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#b084ff]/50 transition-all" />
        
        <textarea name="note" placeholder="Any special instructions or notes?" rows={3} className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#b084ff]/50 transition-all resize-none"></textarea>
        
        <button type="submit" className="w-full bg-gradient-to-r from-[#4c1d95] to-[#7b2ff7] text-white p-4 rounded-xl font-bold cursor-pointer hover:shadow-[0_0_20px_rgba(123,47,247,0.4)] transition-all text-lg flex items-center justify-center gap-2">
          <MessageCircle size={20} />
          Send Order via WhatsApp
        </button>
      </form>

      <AnimatePresence>
        {paymentMethod === 'Bank Transfer' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-white/5 border border-white/20 rounded-xl text-center overflow-hidden"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-[#b084ff]">
              <CreditCard size={18} />
              <p className="font-bold">Bank Transfer Details</p>
            </div>
            <p className="text-sm text-gray-300">
              Account: <b className="text-white">{BANK_DETAILS.accountNumber}</b><br />
              Bank: {BANK_DETAILS.bankName}<br />
              Name: {BANK_DETAILS.accountName}
            </p>
          </motion.div>
        )}

        {paymentMethod === 'verse' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-5 bg-white/5 border-2 border-[#7b2ff7]/30 rounded-xl text-center overflow-hidden verse-highlight"
          >
            <img src={VERSE_LOGO_URL} alt="Verse Logo" className="h-12 mb-3 mx-auto object-contain" referrerPolicy="no-referrer" />
            <p className="text-sm text-[#b084ff] font-extrabold uppercase tracking-wider mb-3">Pay with Verse & Save 10%</p>
            <div className="bg-white/10 p-3 rounded-lg border border-white/20">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Wallet Address</p>
              <p className="break-all text-xs font-mono select-all text-white">{VERSE_WALLET_ADDRESS}</p>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-gray-400">
              <Info size={12} />
              <span>Copy address and pay in your Verse app</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main App ---
export default function App() {
  return (
    <div className="min-h-screen pb-24 font-sans">
      <header className="bg-[#7b2ff7] text-white text-center p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center justify-center"
        >
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mb-4 shadow-inner">
            <img src={LOGO_PATH} alt="Hungry Bird Logo" className="h-20 w-20 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-1">HUNGRY BIRD</h1>
          <p className="text-xs font-bold opacity-80 tracking-[0.3em] uppercase">One Stop Kitchen Help</p>
        </motion.div>
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black rounded-full blur-3xl" />
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto pt-6 space-y-4">
        <Section title="Breakfast Packages" category="Breakfast Packages" id="breakfast" />
        <Section title="Tasty Snacks" category="Snacks" id="snacks" />
        <Section title="Kitchen Helpers" category="Kitchen Helpers" id="kitchen" />
        
        <OrderForm />
        
        <footer className="mt-16 mb-12 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="text-sm font-black text-white uppercase tracking-[0.2em]">Secure Payments Powered by</span>
            <img src={VERSE_LOGO_URL} alt="Verse" className="h-10 brightness-200 drop-shadow-[0_0_8px_rgba(176,132,255,0.5)]" referrerPolicy="no-referrer" />
          </div>
          <p className="text-[10px] text-white/60 mt-6 font-medium tracking-widest uppercase">© 2026 Hungry Bird Kitchen Services</p>
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
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 flex items-center justify-center hover:bg-[#128C7E] transition-colors"
      >
        <MessageCircle size={28} />
      </motion.a>

      {/* Quick Navigation Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 p-3 flex justify-around items-center md:hidden z-40">
        <button onClick={() => document.getElementById('breakfast')?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-bold uppercase tracking-tighter text-gray-400 hover:text-white transition-colors">Breakfast</button>
        <button onClick={() => document.getElementById('snacks')?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-bold uppercase tracking-tighter text-gray-400 hover:text-white transition-colors">Snacks</button>
        <button onClick={() => document.getElementById('kitchen')?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-bold uppercase tracking-tighter text-gray-400 hover:text-white transition-colors">Kitchen</button>
        <button onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#b084ff] text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Order</button>
      </div>
    </div>
  );
}
