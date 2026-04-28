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
    <div className="flex flex-col h-full bg-gray-50 pb-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 text-brand font-medium px-4 py-4 self-start hover:text-[#fa7756] transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="px-6 flex flex-col gap-4">
        {/* Detail Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col gap-5">
          {/* Image */}
          <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onContextMenu={(e) => e.preventDefault()} />
          </div>

          {/* Header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-[22px] font-bold text-gray-900 leading-tight">{item.name}</h2>
              <div className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getExpiryStyle(item.expiryDays)}`}>
                <Clock className="w-3.5 h-3.5" />
                {item.expiryDays} day{item.expiryDays > 1 ? 's' : ''}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-400">{item.category}</span>
          </div>

          <div className="w-full h-[1px] bg-gray-50" />

          {/* Info Rows */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium text-[15px]">Expiry Date</span>
              <span className="text-gray-900 font-semibold text-[15px]">{formattedExpiry}</span>
            </div>
            <div className="w-full h-[1px] bg-gray-50" />
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium text-[15px]">Quantity</span>
              <span className="text-gray-900 font-semibold text-[15px]">{item.quantity} {item.unit}</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-50" />

          {/* Consumed Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
               <span className="text-gray-900 font-semibold text-[15px]">Mark as consumed:</span>
               <span className="text-brand font-bold">{consumePercent}% consumed</span>
            </div>
            <div className="flex flex-col gap-2 pt-2 pb-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5" 
                value={consumePercent}
                onChange={(e) => setConsumePercent(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#FF7A59] [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#FF7A59] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full"
                style={{
                  background: `linear-gradient(to right, #FF7A59 0%, #FF7A59 ${consumePercent}%, #e5e7eb ${consumePercent}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                 <span>0%</span>
                 <span>50%</span>
                 <span>100%</span>
              </div>
            </div>
            <button 
              onClick={handleUpdate}
              disabled={consumePercent === initialConsumedPercent}
              className={`w-full py-3.5 rounded-xl text-[15px] font-semibold transition-all mt-1 ${
                consumePercent !== initialConsumedPercent 
                  ? 'bg-[#FF7A59] text-white hover:bg-[#fa6b48] shadow-md shadow-[#FF7A59]/20' 
                  : 'bg-brand/20 text-white cursor-not-allowed'
              }`}
            >
              Update Quantity
            </button>
            <span className="text-xs text-gray-400 font-medium mt-1 text-center">added {formattedAdded}</span>
          </div>
        </div>

        {/* Remove Button */}
        <button 
          onClick={() => onRemove(item.id)}
          className="w-full py-4 rounded-2xl border border-gray-200 bg-transparent text-gray-400 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Mark as finished & remove
        </button>
      </div>
    </div>
  );
}
