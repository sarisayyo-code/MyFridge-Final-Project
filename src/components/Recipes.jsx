import { Check, Heart, ChefHat, BookOpen, Plus, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { mockRecipes } from '../data';
import AddRecipeOverlay from './AddRecipeOverlay';
import RecipeDetail from './RecipeDetail';
import StartCookingOverlay from './StartCookingOverlay';
import { generateRecipesFromInventory } from '../services/geminiService';

export default function Recipes({ inventory, customRecipes, favorites, onAddCustomRecipe, onToggleFavorite, onCookIngredients, onRemoveCustomRecipe, onAddRecipeClick, showToast }) {
  const [activeFilter, setActiveFilter] = useState('Suggested');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isStartCookingOpen, setIsStartCookingOpen] = useState(false);
  const [aiRecipes, setAiRecipes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if an ingredient is in inventory
  const hasIngredient = (ingredient) => {
    return inventory.some(item => 
      item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
      ingredient.toLowerCase().includes(item.name.toLowerCase())
    );
  };

  const handleCook = (matchedIngredients) => {
    onCookIngredients(matchedIngredients);
    setIsStartCookingOpen(false);
    setSelectedRecipe(null);
  };

  const filters = [
    { id: 'Suggested', icon: ChefHat },
    { id: 'My Recipes', icon: BookOpen },
    { id: 'Favorites', icon: Heart }
  ];

  const getSuggestedRecipes = () => {
    let combined = [...aiRecipes, ...mockRecipes];
    
    // Sort by availability: percentage of ingredients owned descending, then absolute missing count ascending
    return combined.sort((a, b) => {
      const ownedA = a.ingredients.filter(ing => hasIngredient(ing)).length;
      const ownedB = b.ingredients.filter(ing => hasIngredient(ing)).length;
      const percentA = ownedA / a.ingredients.length;
      const percentB = ownedB / b.ingredients.length;
      
      if (percentB !== percentA) {
        return percentB - percentA;
      }
      
      const missingA = a.ingredients.length - ownedA;
      const missingB = b.ingredients.length - ownedB;
      return missingA - missingB;
    });
  };

  const renderRecipeCard = (recipe) => {
    const isFavorite = favorites.includes(recipe.id);
    
    // Sort ingredients: Matched (Salmon) followed by Missing (Grey)
    const sortedIngredients = [...recipe.ingredients].sort((a, b) => {
      const hasA = hasIngredient(a);
      const hasB = hasIngredient(b);
      if (hasA && !hasB) return -1;
      if (!hasA && hasB) return 1;
      return 0;
    });

    return (
      <div 
        key={recipe.id} 
        onClick={() => setSelectedRecipe(recipe)}
        className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col relative mb-6 cursor-pointer transform hover:scale-[1.02] transition-transform active:scale-[0.98]"
      >
        
        {/* Image Container */}
        {recipe.imageUrl ? (
          <div className="h-48 w-full relative">
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" onContextMenu={(e) => e.preventDefault()} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-3 left-4 text-white text-[13px] font-medium tracking-wide">
              {recipe.time} · {recipe.difficulty}
            </div>
          </div>
        ) : null}

        {/* Card Body */}
        <div className="p-4 flex flex-col gap-3 relative">
          <h3 className="text-lg font-bold text-gray-900 leading-tight pr-24">{recipe.title}</h3>
          
          {!recipe.imageUrl && (
            <div className="text-sm font-medium text-gray-500 mt-[-4px]">
              {recipe.time} · {recipe.difficulty}
            </div>
          )}
          
          {/* Ingredients - Prioritize Salmon (matched) then Grey (missing) */}
          <div className="flex flex-wrap gap-2">
            {sortedIngredients.map(ingredient => {
               const isMatched = hasIngredient(ingredient);
               return (
                 <div 
                   key={ingredient} 
                   className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium transition-colors ${
                     isMatched 
                       ? 'bg-[#FF7A59] text-white shadow-sm' 
                       : 'bg-gray-100 text-gray-400'
                   }`}
                 >
                   {isMatched && <Check size={13} className="stroke-[3]" />}
                   {ingredient}
                 </div>
               )
            })}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-50 flex justify-end">
          <button 
             onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
             className={`flex items-center gap-1.5 text-sm font-medium transition-colors border px-4 py-1.5 rounded-full ${
               isFavorite 
                 ? 'text-brand border-brand bg-[#FFF0EC]' 
                 : 'text-gray-400 border-gray-100 hover:text-gray-600 hover:bg-gray-50'
             }`}
          >
            <Heart size={15} className={isFavorite ? 'fill-current' : ''} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </button>
        </div>
      </div>
    );
  };

  const suggestedRecipes = getSuggestedRecipes();

  return (
    <div className="flex-1 flex flex-col pb-24 relative">
      
      {/* Top Filter Tabs */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex gap-2 shrink-0">
        <div className="flex bg-white border border-gray-100 rounded-full p-1 flex-1 shadow-sm">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#FF7A59] text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={14} className={isActive ? 'stroke-[2.5]' : ''} />
                {filter.id}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full">
        {activeFilter === 'Suggested' && (
          <>
            {/* Info Banner */}
            <div className="px-6 py-4 shrink-0">
              <div className="bg-[#FFF5F2] rounded-xl p-4 flex items-center gap-3">
                <ChefHat className="text-[#FF7A59] shrink-0" size={20} />
                <p className="text-[14px] text-gray-800 tracking-tight">
                  Based on <span className="font-bold">{inventory.length} fridge items</span>.
                </p>
              </div>
            </div>

            {/* Recipe List */}
            <div className="px-6 flex flex-col pb-6">
              {suggestedRecipes.length > 0 ? (
                suggestedRecipes.map(recipe => renderRecipeCard(recipe))
              ) : (
                <div className="text-center py-6 text-gray-500">No suggestions match your inventory closely.</div>
              )}
            </div>
          </>
        )}

        {activeFilter === 'My Recipes' && (
          <div className="flex-1 flex flex-col p-6 min-h-full">
            {customRecipes.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center -mt-16">
                <button 
                  onClick={onAddRecipeClick}
                  className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 transition-colors hover:bg-gray-100"
                >
                  <div className="text-[#FF7A59]">
                    <Plus size={28} strokeWidth={2.5} />
                  </div>
                </button>
                <h2 className="text-[17px] font-bold text-[#6B7280] mb-1">No personal recipes yet</h2>
                <p className="text-[13px] font-medium text-gray-400">Tap the + button to add your first recipe</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full flex flex-col">
                  {customRecipes.map(renderRecipeCard)}
                </div>
                <button 
                  onClick={onAddRecipeClick}
                  className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mt-2 mb-8 transition-colors hover:bg-gray-100 shadow-sm border border-gray-100"
                >
                  <Plus size={28} className="text-[#FF7A59]" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        )}

        {activeFilter === 'Favorites' && (
          <div className="flex-1 flex flex-col p-6 min-h-full">
            {favorites.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center -mt-16">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <Heart size={28} className="text-gray-300 stroke-[2]" />
                </div>
                <h2 className="text-[17px] font-bold text-[#6B7280] mb-1">No favorites saved yet</h2>
                <p className="text-[13px] font-medium text-gray-400">Tap the ♡ on any recipe to save it here</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {[...mockRecipes, ...customRecipes, ...aiRecipes]
                  .filter(r => favorites.includes(r.id))
                  .map(renderRecipeCard)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sliding Panes */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-[#F4F5F6] max-w-[450px] mx-auto h-full flex flex-col overflow-hidden"
          >
            <RecipeDetail 
              recipe={selectedRecipe}
              inventory={inventory}
              onBack={() => setSelectedRecipe(null)}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(selectedRecipe.id)}
              onStartCooking={() => setIsStartCookingOpen(true)}
              onRemove={onRemoveCustomRecipe}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStartCookingOpen && selectedRecipe && (
          <StartCookingOverlay 
            recipe={selectedRecipe}
            inventory={inventory}
            onClose={() => setIsStartCookingOpen(false)}
            onCook={handleCook}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
