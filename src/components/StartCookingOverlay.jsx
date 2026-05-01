import { motion } from 'motion/react';
import { Flame, Check } from 'lucide-react';
import { useState } from 'react';

export default function StartCookingOverlay({ recipe, inventory, onClose, onCook }) {
  // Find matching inventory items
  const matchedItems = inventory.filter(item => 
    recipe.ingredients.some(ing => 
      item.name.toLowerCase().includes(ing.toLowerCase()) ||
      ing.toLowerCase().includes(item.name.toLowerCase())
    )
  );

  const [usedQuantities, setUsedQuantities] = useState(() => {
    const initialState = {};
    matchedItems.forEach(item => {
      // Default to 100g or the total quantity, whichever is smaller
      initialState[item.id] = Math.min(item.quantity, 100);
    });
    return initialState;
  });

  const handleSliderChange = (id, value) => {
    setUsedQuantities(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleCookSubmit = () => {
    onCook(usedQuantities);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[60] max-w-[450px] mx-auto"
      />
      
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] pt-3 pb-8 px-6 flex flex-col items-center shadow-2xl max-w-[450px] mx-auto max-h-[85vh]"
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-6 shrink-0" />
        
        <div className="w-14 h-14 bg-[#FFF0EC] rounded-2xl flex items-center justify-center text-[#FF7A59] mb-4 shrink-0">
          <Flame size={28} strokeWidth={2.5} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2 shrink-0">Log Recipe as Used?</h2>
        <p className="text-[14.5px] text-gray-400 text-center mb-6 px-4 shrink-0">
          Adjust the quantities used for each ingredient from your fridge.
        </p>

        {matchedItems.length > 0 && (
          <div className="w-full flex-1 overflow-y-auto hide-scrollbar mb-6 px-1 flex flex-col gap-4">
            {matchedItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-50">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight">{item.name}</span>
                        <span className="text-[11px] font-bold text-[#FF7A59] uppercase tracking-wide">
                           Using: {usedQuantities[item.id]} {item.unit}
                        </span>
                      </div>
                   </div>
                   <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
                     Max: {item.quantity} {item.unit}
                   </span>
                </div>
                
                <div className="flex flex-col mt-1 px-1">
                  <input 
                    type="range" 
                    min="0" 
                    max={item.quantity} 
                    step="1" 
                    value={usedQuantities[item.id]}
                    onChange={(e) => handleSliderChange(item.id, e.target.value)}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none bg-gray-100 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#FF7A59] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                    style={{
                      background: `linear-gradient(to right, #FF7A59 0%, #FF7A59 ${(usedQuantities[item.id] / item.quantity) * 100}%, #f3f4f6 ${(usedQuantities[item.id] / item.quantity) * 100}%, #f3f4f6 100%)`
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider relative mt-1.5">
                     <span>0 {item.unit}</span>
                     <span>{item.quantity} {item.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="w-full flex gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-[16px] bg-gray-50 text-gray-900 font-bold text-[15px] transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={handleCookSubmit}
            className="flex-1 py-4 rounded-[16px] bg-[#FF7A59] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#FF7A59]/20 hover:bg-[#fa6b48] transition-colors"
          >
            <Flame size={18} strokeWidth={2.5} />
            Recipe Used
          </button>
        </div>
      </motion.div>
    </>
  );
}
