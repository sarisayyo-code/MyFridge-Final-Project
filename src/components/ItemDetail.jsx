import { ChevronLeft, Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ItemDetail({ item, onBack, onUpdateQuantity, onRemove, showToast }) {
  const initialConsumedPercent = item.originalQuantity 
    ? Math.round(((item.originalQuantity - item.quantity) / item.originalQuantity) * 100) 
    : 0;

  const [consumePercent, setConsumePercent] = useState(initialConsumedPercent);

  const getExpiryStyle = (days) => {
    if (days <= 2) return 'bg-red-50 text-red-500';
    if (days <= 5) return 'bg-orange-50 text-orange-500';
    return 'bg-green-50 text-green-500';
  };

  const handleUpdate = () => {
    if (consumePercent !== initialConsumedPercent) {
      const original = item.originalQuantity || item.quantity;
      const leftPercent = 100 - consumePercent;
      const newQuantity = original * (leftPercent / 100);
      
      let rounded = newQuantity;
      if (item.unit === 'g' || item.unit === 'ml' || item.unit === 'pcs') {
         rounded = Math.round(newQuantity);
      } else {
         rounded = Math.round(newQuantity * 10) / 10;
      }
      
      if (rounded <= 0 || consumePercent === 100) {
        onRemove(item.id);
      } else {
        onUpdateQuantity(item.id, rounded);
        if (showToast) showToast(`Quantity updated! ${leftPercent}% left. ✅`);
        onBack();
      }
    } else {
      // Just go back if no change
      onBack();
    }
  };

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + item.expiryDays);
  const formattedExpiry = expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const addedDate = new Date();
  addedDate.setDate(addedDate.getDate() - 5); // mock added date
  const formattedAdded = addedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col h-full bg-[#f4f5f6] relative overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Header Image - Expanded to fill more space as requested */}
        <div className="h-[260px] w-full relative shrink-0">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
            onContextMenu={(e) => e.preventDefault()} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          {/* Top Buttons */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
             <button onClick={onBack} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
               <ChevronLeft size={22} className="stroke-[2.5]" />
             </button>
             <button onClick={() => onRemove(item.id)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
               <Trash2 size={18} />
             </button>
          </div>

          {/* Title & Info Overlay - Larger and clearer */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1.5 text-white">
            <h2 className="text-3xl font-bold tracking-tight leading-tight">{item.name}</h2>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="flex items-center gap-1.5 opacity-90">
                <Clock size={16} />
                {item.expiryDays} day{item.expiryDays > 1 ? 's' : ''} left
              </div>
              <div className={`px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${getExpiryStyle(item.expiryDays)} bg-opacity-100`}>
                {item.expiryDays <= 2 ? 'Expiring Soon' : 'Fresh'}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Detailed Stats Card - Compact version */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium font-sans">Category</span>
              <span className="bg-gray-50 px-2 py-0.5 rounded-md text-gray-700 font-bold">{item.category}</span>
            </div>
            <div className="w-full h-px bg-gray-50" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Expiry Date</span>
              <span className="text-gray-900 font-semibold">{formattedExpiry}</span>
            </div>
            <div className="w-full h-px bg-gray-50" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Current Quantity</span>
              <span className="text-gray-900 font-bold">{item.quantity} {item.unit}</span>
            </div>
          </div>

          {/* Consumed Actions Card - Compact version */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-bold text-gray-900">Consume Item</h3>
               <span className="text-[#FF7A59] font-bold text-sm">{consumePercent}% consumed</span>
            </div>
            
            <div className="flex flex-col gap-2.5">
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5" 
                value={consumePercent}
                onChange={(e) => setConsumePercent(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer outline-none bg-gray-100 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#FF7A59] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                style={{
                  background: `linear-gradient(to right, #FF7A59 0%, #FF7A59 ${consumePercent}%, #f3f4f6 ${consumePercent}%, #f3f4f6 100%)`
                }}
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider relative px-0.5">
                 <span className="w-1/3 text-left">Fresh</span>
                 <span className="w-1/3 text-center">Half</span>
                 <span className="w-1/3 text-right">Finished</span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col items-center gap-2 pb-2">
            <span className="text-[11px] text-gray-400 font-medium">Added to fridge on {formattedAdded}</span>
            
            <button 
              onClick={handleUpdate}
              disabled={consumePercent === initialConsumedPercent}
              className={`w-full py-3.5 rounded-xl font-bold text-[16px] shadow-lg transition-all ${
                consumePercent !== initialConsumedPercent 
                  ? 'bg-[#FF7A59] text-white shadow-[#FF7A59]/20 hover:bg-[#fa6b48]' 
                  : 'bg-gray-300 text-white cursor-not-allowed shadow-none'
              }`}
            >
              Update Quantity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
