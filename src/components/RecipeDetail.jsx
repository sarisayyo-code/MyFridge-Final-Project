import { ChevronLeft, Heart, Clock, Check, Flame, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function RecipeDetail({ recipe, inventory, onBack, onToggleFavorite, isFavorite, onStartCooking, onRemove }) {
  const hasIngredient = (ingredient) => {
    return inventory.some(item => 
      item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
      ingredient.toLowerCase().includes(item.name.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f5f6] relative">
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Header Image */}
        {recipe.imageUrl ? (
          <div className="h-[300px] w-full relative shrink-0">
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" onContextMenu={(e) => e.preventDefault()} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Top Buttons */}
            <div className="absolute top-6 left-4 right-4 flex justify-between items-center z-10">
               <button onClick={onBack} className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                 <ChevronLeft size={22} className="stroke-[2.5] -ml-0.5" />
               </button>
               <div className="flex gap-2">
                 {recipe.id.startsWith('mr_') && onRemove && (
                   <button onClick={() => { onRemove(recipe.id); onBack(); }} className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                     <Trash2 size={18} />
                   </button>
                 )}
                 <button onClick={() => onToggleFavorite(recipe.id)} className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center white hover:bg-white/40 transition-colors">
                   <Heart size={20} fill={isFavorite ? '#FF7A59' : 'transparent'} className={isFavorite ? 'text-[#FF7A59]' : 'text-white'} />
                 </button>
               </div>
            </div>

            {/* Title & Info */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2 text-white">
              <h2 className="text-3xl font-bold tracking-wide leading-tight">{recipe.title}</h2>
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="flex items-center gap-1.5 opacity-90">
                  <Clock size={15} />
                  {recipe.time}
                </div>
                <div className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-wide ${
                  recipe.difficulty === 'Easy' ? 'bg-[#E6F4EA] text-[#1E8E3E]' :
                  recipe.difficulty === 'Medium' ? 'bg-[#FEF7E0] text-[#F9AB00]' :
                  'bg-[#FCE8E6] text-[#D93025]'
                }`}>
                  {recipe.difficulty}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#FF7A59] pt-12 pb-6 px-6 relative shrink-0">
             {/* Top Buttons */}
            <div className="flex justify-between items-center mb-6">
               <button onClick={onBack} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                 <ChevronLeft size={22} className="stroke-[2.5] -ml-0.5" />
               </button>
               <div className="flex gap-2">
                 {recipe.id.startsWith('mr_') && onRemove && (
                   <button onClick={() => { onRemove(recipe.id); onBack(); }} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                     <Trash2 size={18} />
                   </button>
                 )}
                 <button onClick={() => onToggleFavorite(recipe.id)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                   <Heart size={20} fill={isFavorite ? 'currentColor' : 'transparent'} />
                 </button>
               </div>
            </div>
            <h2 className="text-2xl font-bold tracking-wide text-white mb-2">{recipe.title}</h2>
            <div className="flex items-center gap-3 text-sm font-medium text-white/90">
              <div className="flex items-center gap-1.5">
                <Clock size={15} />
                {recipe.time}
              </div>
              <div className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                recipe.difficulty === 'Easy' ? 'bg-[#E6F4EA]/20' :
                recipe.difficulty === 'Medium' ? 'bg-[#FEF7E0]/20' :
                'bg-[#FCE8E6]/20'
              }`}>
                {recipe.difficulty}
              </div>
            </div>
          </div>
        )}

        <div className="px-5 py-6 flex flex-col gap-5 flex-1">
          {/* Ingredients */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col gap-5">
            <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Ingredients</h3>
            <div className="flex flex-col gap-4">
              {[...recipe.ingredients]
                .sort((a, b) => {
                  const hasA = hasIngredient(a);
                  const hasB = hasIngredient(b);
                  if (hasA && !hasB) return -1;
                  if (!hasA && hasB) return 1;
                  return 0;
                })
                .map(ing => {
                  const matched = hasIngredient(ing);
                  return (
                    <div key={ing} className="flex items-center gap-3.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${matched ? 'bg-[#FF7A59]' : 'bg-gray-200'}`}>
                        <Check size={14} className="text-white stroke-[3]" />
                      </div>
                      <span className={`text-[16px] ${matched ? 'text-gray-900' : 'text-gray-500 font-medium'}`}>{ing}</span>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Instructions */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col gap-5">
              <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Instructions</h3>
              <div className="flex flex-col gap-6">
                {recipe.instructions.map((inst, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#FF7A59] text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-[15px] text-gray-600 font-medium leading-relaxed pt-0.5">{inst}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start Cooking Button */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-6 pt-10 pb-10 bg-gradient-to-t from-[#f4f5f6] hover:from-[#f4f5f6] via-[#f4f5f6] to-transparent shrink-0 pointer-events-none">
        <button 
          onClick={onStartCooking}
          className="w-full py-4 rounded-[16px] bg-[#FF7A59] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#FF7A59]/20 hover:bg-[#fa6b48] transition-colors pointer-events-auto"
        >
          <Flame size={18} strokeWidth={2.5} />
          Mark as Recipe Used
        </button>
      </div>
    </div>
  );
}
