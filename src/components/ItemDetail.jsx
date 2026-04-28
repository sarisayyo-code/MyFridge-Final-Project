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
    <div className="flex flex-col h-full bg-[#f4f5f6] relative">
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Header Image */}
        <div className="h-[300px] w-full relative shrink-0">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
            onContextMenu={(e) => e.preventDefault()} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Top Buttons matching RecipeDetail style */}
          <div className="absolute top-6 left-4 right-4 flex justify-between items-center z-10">
             <button onClick={onBack} className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
               <ChevronLeft size={22} className="stroke-[2.5] -ml-0.5" />
             </button>
             <button onClick={() => onRemove(item.id)} className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
               <Trash2 size={18} />
             </button>
          </div>

          {/* Title & Info Overlay at bottom of image */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2 text-white">
            <h2 className="text-3xl font-bold tracking-wide leading-tight">{item.name}</h2>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="flex items-center gap-1.5 opacity-90">
                <Clock size={16} />
                {item.expiryDays} day{item.expiryDays > 1 ? 's' : ''} left
              </div>
              <div className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-wide ${getExpiryStyle(item.expiryDays)} bg-opacity-90`}>
                {item.expiryDays <= 2 ? 'Expiring Soon' : item.expiryDays <= 5 ? 'Fresh' : 'Very Fresh'}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 flex flex-col gap-5 flex-1">
          {/* Detailed Stats Card */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium text-[15px]">Category</span>
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-800 font-bold text-[13px]">{item.category}</span>
              </div>
              <div className="w-full h-[1px] bg-gray-50" />
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium text-[15px]">Expiry Date</span>
                <span className="text-gray-900 font-semibold text-[15px]">{formattedExpiry}</span>
              </div>
              <div className="w-full h-[1px] bg-gray-50" />
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium text-[15px]">Current Quantity</span>
                <span className="text-gray-900 font-bold text-[16px]">{item.quantity} {item.unit}</span>
              </div>
            </div>
          </div>

          {/* Consumed Actions Card */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col gap-5">
            <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Consume Item</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                 <span className="text-gray-600 font-medium text-[15px]">Progress:</span>
                 <span className="text-[#FF7A59] font-bold">{consumePercent}% consumed</span>
              </div>
              
              <div className="flex flex-col gap-4 pt-1">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5" 
                  value={consumePercent}
                  onChange={(e) => setConsumePercent(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#FF7A59] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#FF7A59] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:rounded-full"
                  style={{
                    background: `linear-gradient(to right, #FF7A59 0%, #FF7A59 ${consumePercent}%, #e5e7eb ${consumePercent}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-[11px] text-gray-400 font-bold uppercase tracking-widest px-1">
                   <span>Fresh</span>
                   <span>Half</span>
                   <span>Finished</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Info Row */}
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <span className="text-[13px] text-gray-400 font-medium">Added to fridge on {formattedAdded}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Button matching RecipeDetail style */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-8 bg-gradient-to-t from-[#f4f5f6] via-[#f4f5f6] to-transparent pointer-events-none">
        <button 
          onClick={handleUpdate}
          disabled={consumePercent === initialConsumedPercent}
          className={`w-full py-4 rounded-[18px] font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg transition-all pointer-events-auto ${
            consumePercent !== initialConsumedPercent 
              ? 'bg-[#FF7A59] text-white shadow-[#FF7A59]/30 hover:bg-[#fa6b48] hover:-translate-y-0.5 active:translate-y-0' 
              : 'bg-gray-300 text-white cursor-not-allowed shadow-none'
          }`}
        >
          Check-in Quantity Update
        </button>
      </div>
    </div>
  );
}
