import { Camera, X, Plus, Clock, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

export default function AddRecipeOverlay({ onClose, onAdd, inventory = [] }) {
  const [recipeName, setRecipeName] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [ingredients, setIngredients] = useState(['', '']);
  const [instructions, setInstructions] = useState(['', '']);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const isValid = recipeName.trim() !== '' && 
                  cookTime.trim() !== '' && 
                  ingredients.every(i => i.trim() !== '') &&
                  instructions.every(i => i.trim() !== '');

  const handleAddIngredient = () => setIngredients([...ingredients, '']);
  const handleRemoveIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => setInstructions([...instructions, '']);
  const handleRemoveInstruction = (index) => setInstructions(instructions.filter((_, i) => i !== index));
  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    if (onAdd) {
      onAdd({
        id: 'mr_' + Math.random().toString(36).substring(7),
        title: recipeName,
        time: cookTime,
        difficulty,
        ingredients: ingredients.filter(i => i.trim() !== ''),
        instructions: instructions.filter(i => i.trim() !== ''),
        imageUrl: previewUrl
      });
    }
    
    onClose();
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const inputClass = "w-full border border-gray-100 bg-white rounded-[14px] px-4 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-shadow";
  const labelClass = "text-[14px] font-bold text-gray-600 mb-2 block";

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40 max-w-[450px] mx-auto"
      />
      
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col h-[90vh] max-w-[450px] mx-auto"
      >
        {/* Header Area */}
        <div className="bg-[#FF7A59] rounded-t-[32px] pt-3 pb-5 px-6 relative flex flex-col items-center shrink-0 z-20 shadow-sm">
          <div className="w-12 h-1.5 bg-white/40 rounded-full mb-4" />
          <h2 className="text-white font-bold text-[19px] tracking-wide">New Recipe</h2>
          
          <button 
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 bg-white flex items-center justify-center w-8 h-8 rounded-full text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <X size={18} strokeWidth={2.5} className="ml-px mt-px" />
          </button>
        </div>

        {/* Form Area */}
        <div className="bg-[#FAFAFA] px-5 py-6 overflow-y-auto flex-1 pb-safe relative z-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-lg mx-auto">
            {/* Add Photo Box */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button 
              type="button" 
              onClick={handlePhotoClick}
              className="w-full h-32 rounded-[24px] border border-dashed border-gray-200 bg-white flex flex-col items-center justify-center gap-2 text-[#9CA3AF] hover:bg-gray-50 transition-colors overflow-hidden relative"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Camera size={28} className="text-[#9CA3AF]" strokeWidth={1.5} />
                  <span className="text-[15px] font-medium tracking-wide">Add Photo</span>
                </>
              )}
            </button>

            {/* Recipe Name and Cook Time */}
            <div className="flex gap-4">
              <div className="flex-[3]">
                <label className={labelClass}>Recipe Name*</label>
                <input 
                  type="text" 
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="e.g. Avocado Toast" 
                  className={inputClass}
                />
              </div>
              <div className="flex-[2]">
                <label className={labelClass}>Cook Time *</label>
                <div className="relative flex items-center">
                   <Clock className="w-4 h-4 text-gray-300 absolute left-3.5" />
                  <input 
                    type="text" 
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    placeholder="e.g. 20 min" 
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex gap-2">
               {['Easy', 'Medium', 'Hard'].map((diff) => (
                 <button
                   key={diff}
                   type="button"
                   onClick={() => setDifficulty(diff)}
                   className={`flex-1 py-3 rounded-full text-[14px] font-bold transition-colors ${
                     difficulty === diff
                       ? 'bg-[#FF7A59] text-white shadow-sm'
                       : 'bg-white border border-gray-100 text-[#9CA3AF] hover:border-gray-200'
                   }`}
                 >
                   {diff}
                 </button>
               ))}
            </div>

            {/* Ingredients */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-bold text-[#6B7280]">Ingredients *</label>
                <button type="button" onClick={handleAddIngredient} className="text-[#FF7A59] font-bold text-[13px] flex items-center gap-1">
                  <Plus size={14} strokeWidth={3} /> Add
                </button>
              </div>
              
              {/* Optional: Inventory Suggestions */}
              {inventory.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {inventory.map(item => (
                    <button 
                      key={item.id} 
                      type="button" 
                      onClick={() => {
                        const emptyIndex = ingredients.findIndex(i => i.trim() === '');
                        if (emptyIndex !== -1) {
                          handleIngredientChange(emptyIndex, item.name);
                        } else {
                          setIngredients([...ingredients, item.name]);
                        }
                      }}
                      className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[12px] font-medium text-gray-600 hover:border-[#FF7A59] hover:text-[#FF7A59] transition-colors"
                    >
                      + {item.name}
                    </button>
                  ))}
                </div>
              )}
              
              <AnimatePresence>
                {ingredients.map((ing, index) => (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key={`ingredient-${index}`} 
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 text-center text-[#FF7A59] font-bold text-[13px]">{index + 1}</div>
                    <input 
                      type="text"
                      value={ing}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      placeholder={`Ingredient ${index + 1}`}
                      className={inputClass}
                    />
                    <button type="button" onClick={() => handleRemoveIngredient(index)} className="w-6 h-6 rounded-full bg-[#FFF0EC] text-[#FF7A59] flex items-center justify-center shrink-0">
                      <X size={12} strokeWidth={3} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-bold text-[#6B7280]">Instructions *</label>
                <button type="button" onClick={handleAddInstruction} className="text-[#FF7A59] font-bold text-[13px] flex items-center gap-1">
                  <Plus size={14} strokeWidth={3} /> Add Step
                </button>
              </div>
              
              <AnimatePresence>
                {instructions.map((inst, index) => (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key={`instruction-${index}`} 
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FF7A59] text-white flex items-center justify-center font-bold text-[12px] shrink-0 mt-3">{index + 1}</div>
                    <textarea 
                      rows={2}
                      value={inst}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      placeholder={`Step ${index + 1}...`}
                      className={`${inputClass} resize-none`}
                    />
                    <button type="button" onClick={() => handleRemoveInstruction(index)} className="w-6 h-6 rounded-full bg-[#FFF0EC] text-[#FF7A59] flex items-center justify-center shrink-0 mt-3">
                      <X size={12} strokeWidth={3} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 mt-2 mb-6 rounded-2xl text-[16px] font-bold transition-all flex items-center justify-center gap-2 ${
                isValid 
                  ? 'bg-[#FF7A59] text-white cursor-pointer hover:bg-[#fa6b48] shadow-lg shadow-[#FF7A59]/20' 
                  : 'bg-[#FFD7CE] text-white cursor-not-allowed'
              }`}
            >
              <ChefHat size={18} strokeWidth={2.5} />
              Save Recipe
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
