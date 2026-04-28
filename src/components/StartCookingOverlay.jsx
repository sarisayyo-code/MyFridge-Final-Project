import { motion } from 'motion/react';
import { Flame, Check } from 'lucide-react';

export default function StartCookingOverlay({ recipe, inventory, onClose, onCook }) {
  const hasIngredient = (ingredient) => {
    return inventory.some(item => 
      item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
      ingredient.toLowerCase().includes(item.name.toLowerCase())
    );
  };
  const matchedIngredients = recipe.ingredients.filter(hasIngredient);

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
        className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] pt-3 pb-8 px-6 flex flex-col items-center shadow-2xl max-w-[450px] mx-auto"
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-6" />
        
        <div className="w-14 h-14 bg-[#FFF0EC] rounded-2xl flex items-center justify-center text-[#FF7A59] mb-4">
          <Flame size={28} strokeWidth={2.5} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Log Recipe as Used?</h2>
        <p className="text-[14.5px] text-gray-400 text-center mb-6 px-4">
          This will use up the matched ingredients from your fridge.
        </p>

        {matchedIngredients.length > 0 && (
          <div className="w-full bg-[#FFF5F2] rounded-2xl p-5 mb-8 flex flex-col gap-3 border border-[#FFE4DC]">
            <span className="text-[13px] font-bold text-[#FF7A59]">Will be used from fridge</span>
            <div className="flex flex-wrap gap-2">
              {matchedIngredients.map(ing => (
                <div key={ing} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#FFE4DC] rounded-full text-[13px] font-semibold text-[#FF7A59] shadow-sm">
                  <Check size={14} className="stroke-[3]" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-[16px] bg-gray-50 text-gray-900 font-bold text-[15px] transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={() => onCook(matchedIngredients)}
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
