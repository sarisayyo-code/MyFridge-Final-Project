import { ChevronLeft, Clock, Trash2, Plus, X } from 'lucide-react';
import { useState } from 'react';

function BadgeBox({ badge, unit, getExpiryStyle, onConsumeChange }) {
  const initialConsumedPercent = badge.originalQuantity 
    ? Math.round(((badge.originalQuantity - badge.quantity) / badge.originalQuantity) * 100) 
    : 0;

  const [consumePercent, setConsumePercent] = useState(initialConsumedPercent);

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setConsumePercent(val);
    onConsumeChange(badge.id, val, initialConsumedPercent);
  };

  const addedDate = new Date(badge.dateAdded);
  const formattedAdded = addedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const expiryDate = new Date();
  expiryDate.setDate(new Date(badge.dateAdded).getDate() + badge.expiryDays);
  const formattedExpiry = expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3 relative overflow-hidden">
       {/* Badge info header */}
       <div className="flex items-start justify-between">
         <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">Added: {formattedAdded}</span>
            {badge.note && <span className="text-[13px] font-bold text-[#FF7A59] mt-0.5">{badge.note}</span>}
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-xs text-gray-500">Exp: {formattedExpiry}</span>
               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getExpiryStyle(badge.expiryDays)}`}>
                 {badge.expiryDays} day{badge.expiryDays !== 1 ? 's' : ''} left
               </span>
            </div>
         </div>
         <span className="text-gray-900 font-bold text-sm bg-gray-50 px-2.5 py-1 rounded-lg">{badge.quantity} {unit}</span>
       </div>

       {/* Slider */}
       <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-gray-600">Consume</span>
             <span className="text-[#FF7A59] font-bold text-xs">{consumePercent}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="5" 
            value={consumePercent}
            onChange={handleChange}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer outline-none bg-gray-100 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#FF7A59] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
            style={{
              background: `linear-gradient(to right, #FF7A59 0%, #FF7A59 ${consumePercent}%, #f3f4f6 ${consumePercent}%, #f3f4f6 100%)`
            }}
          />
          <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider relative px-0.5">
             <span className="w-1/3 text-left">Fresh</span>
             <span className="w-1/3 text-center">Half</span>
             <span className="w-1/3 text-right">Finished</span>
          </div>
       </div>
    </div>
  );
}

export default function ItemDetail({ item, onBack, onUpdateItem, onRemove, showToast }) {
  const normalizedBadges = item.batches && item.batches.length > 0 ? item.batches : [{
    id: item.id + '_badge',
    dateAdded: item.dateAdded || new Date().toISOString(),
    quantity: item.quantity,
    originalQuantity: item.originalQuantity || item.quantity,
    expiryDays: item.expiryDays
  }];

  // Track consumption changes per badge. key: badgeId, value: new percent
  const [changes, setChanges] = useState({});
  const [isAddingBadge, setIsAddingBadge] = useState(false);
  const [addQuantity, setAddQuantity] = useState('100');
  const [addExpiry, setAddExpiry] = useState('5');
  const [addNote, setAddNote] = useState('');

  const handleConsumeChange = (badgeId, percent, initialPercent) => {
    setChanges(prev => {
      const next = { ...prev };
      if (percent === initialPercent) delete next[badgeId];
      else next[badgeId] = percent;
      return next;
    });
  };

  const handleAddNewBadge = () => {
    const parsedQ = parseFloat(addQuantity);
    const parsedDays = parseInt(addExpiry, 10);
    if (!parsedQ || parsedQ <= 0 || !parsedDays || parsedDays <= 0) return;

    const newBadge = {
      id: Math.random().toString(36).substring(7) + Date.now().toString(),
      dateAdded: new Date().toISOString(),
      quantity: parsedQ,
      originalQuantity: parsedQ,
      expiryDays: parsedDays,
      note: addNote
    };

    const newBadges = [...normalizedBadges, newBadge].sort((a,b) => a.expiryDays - b.expiryDays);
    onUpdateItem({
      ...item,
      quantity: item.quantity + parsedQ,
      batches: newBadges,
      expiryDays: Math.min(item.expiryDays, parsedDays)
    });

    setIsAddingBadge(false);
    if (showToast) showToast(`Added ${parsedQ}${item.unit} to ${item.name}! ✅`);
    
    // reset form
    setAddQuantity('100');
    setAddExpiry('5');
    setAddNote('');
  };

  const hasChanges = Object.keys(changes).length > 0;

  const getExpiryStyle = (days) => {
    if (days <= 2) return 'bg-red-50 text-red-500';
    if (days <= 5) return 'bg-orange-50 text-orange-500';
    return 'bg-green-50 text-green-500';
  };

  const handleUpdate = () => {
    if (hasChanges) {
      let anyRemaining = false;
      let totalNewQuantity = 0;
      
      const newBadges = normalizedBadges.map(b => {
        if (changes[b.id] !== undefined) {
           const percent = changes[b.id];
           const leftPercent = 100 - percent;
           const newQ = Math.round(b.originalQuantity * (leftPercent / 100));
           const badgeToReturn = { ...b, quantity: Math.max(0, newQ) };
           totalNewQuantity += badgeToReturn.quantity;
           if (badgeToReturn.quantity > 0) anyRemaining = true;
           return badgeToReturn;
        }
        totalNewQuantity += b.quantity;
        if (b.quantity > 0) anyRemaining = true;
        return b;
      }).filter(b => b.quantity > 0);

      if (!anyRemaining) {
        onRemove(item.id);
      } else {
        onUpdateItem({
          ...item,
          quantity: totalNewQuantity,
          batches: newBadges
        });
        if (showToast) showToast(`Quantity updated! ✅`);
        onBack();
      }
    } else {
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f5f6] relative overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar pb-24">
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
             <div className="flex items-center gap-2">
               <button onClick={() => setIsAddingBadge(true)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                 <Plus size={20} className="stroke-[2.5]" />
               </button>
               <button onClick={() => onRemove(item.id)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                 <Trash2 size={18} />
               </button>
             </div>
          </div>

          {/* Title & Info Overlay - Larger and clearer */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1.5 text-white">
            <div className="bg-white/20 backdrop-blur-sm w-max px-2 py-0.5 rounded-md text-[10px] uppercase font-bold text-white mb-1 tracking-wider border border-white/20">{item.category}</div>
            <h2 className="text-3xl font-bold tracking-tight leading-tight">{item.name}</h2>
            <div className="flex items-center gap-3 text-sm font-medium mt-1">
               <span>Total: <strong className="text-white bg-black/30 px-2 py-0.5 rounded-md">{item.quantity} {item.unit}</strong></span>
            </div>
          </div>
        </div>

        {item.notes && (
          <div className="px-5 pt-5 pb-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Notes</span>
              <p className="text-sm text-gray-800 leading-relaxed font-medium">{item.notes}</p>
            </div>
          </div>
        )}

        {/* Badges scroll area */}
        <div className="px-4 py-5 flex flex-col gap-3">
          {normalizedBadges.map(badge => (
            <BadgeBox 
              key={badge.id} 
              badge={badge} 
              unit={item.unit} 
              getExpiryStyle={getExpiryStyle} 
              onConsumeChange={handleConsumeChange}
            />
          ))}
        </div>
      </div>

      {/* Floating Action Button for Update */}
      <div className="absolute bottom-4 left-5 right-5 z-20">
          <button 
            onClick={handleUpdate}
            disabled={!hasChanges}
            className={`w-full py-4 rounded-xl font-bold text-[16px] shadow-lg transition-all ${
              hasChanges 
                ? 'bg-[#FF7A59] text-white shadow-[#FF7A59]/20 hover:bg-[#fa6b48] translate-y-0 scale-100' 
                : 'bg-gray-300 text-white cursor-not-allowed shadow-none translate-y-0 scale-100'
            }`}
          >
            Update Quantities
          </button>
      </div>

      {isAddingBadge && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[24px] p-6 flex flex-col gap-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsAddingBadge(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900 pr-8">Add New Badge</h3>
            
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Quantity ({item.unit})</label>
                <input 
                  type="number" 
                  min="0"
                  step="1"
                  value={addQuantity}
                  onChange={(e) => setAddQuantity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/20 focus:border-[#FF7A59]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Expiry (days)</label>
                <input 
                  type="number" 
                  min="1"
                  step="1"
                  value={addExpiry}
                  onChange={(e) => setAddExpiry(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/20 focus:border-[#FF7A59]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Note (optional)</label>
                <input 
                  type="text" 
                  value={addNote}
                  onChange={(e) => setAddNote(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/20 focus:border-[#FF7A59]"
                />
              </div>
              
              <button 
                onClick={handleAddNewBadge}
                className="w-full mt-2 py-3 rounded-xl bg-[#FF7A59] text-white font-bold text-[15px] shadow-md transition-all hover:bg-[#fa6b48]"
              >
                Add Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
