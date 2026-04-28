import { Camera, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function AddItemOverlay({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Recommend best before date based on category
  useEffect(() => {
    if (category) {
      const today = new Date();
      let daysToAdd = 0;
      switch (category) {
        case 'Vegetables': daysToAdd = 7; break;
        case 'Fruit': daysToAdd = 5; break;
        case 'Meat': daysToAdd = 3; break;
        case 'Dairy': daysToAdd = 7; break;
        default: daysToAdd = 14; 
      }
      const expDate = new Date(today);
      expDate.setDate(expDate.getDate() + daysToAdd);
      const year = expDate.getFullYear();
      const month = String(expDate.getMonth() + 1).padStart(2, '0');
      const day = String(expDate.getDate()).padStart(2, '0');
      setExpiryDate(`${year}-${month}-${day}`);
    }
  }, [category]);

  const isValid = name.trim() !== '' && category !== '' && quantity !== '' && expiryDate !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    // Calculate expiry days from selected date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expiryDate);
    // Adjust for timezone differences when just using date strings
    expDate.setMinutes(expDate.getMinutes() + expDate.getTimezoneOffset());
    
    const diffTime = expDate.getTime() - today.getTime();
    const expiryDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const emojiMap = {
      'Dairy': '🥛',
      'Vegetables': '🥦',
      'Meat': '🥩',
      'Fruit': '🍎',
      'Others': '🥫',
    };
    const emoji = emojiMap[category] || '📦';
    const fallbackImageUrl = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text y="50%" x="50%" dominant-baseline="middle" text-anchor="middle" font-size="50">${emoji}</text></svg>`;

    onAdd({
      name,
      category,
      quantity: parseFloat(quantity) || 1,
      unit: unit || 'pcs',
      expiryDays,
      imageUrl: fallbackImageUrl,
    });
  };

  const inputClass = "w-full border border-gray-100 bg-white rounded-[14px] px-4 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-shadow";
  const labelClass = "block text-[13px] font-semibold text-gray-600 mb-1.5 ml-1 leading-none";

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 z-40"
      />
      
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col max-h-[90vh]"
      >
        {/* Header Area */}
        <div className="bg-brand rounded-t-[32px] pt-3 pb-5 px-6 relative flex flex-col items-center shrink-0">
          <div className="w-10 h-1 bg-white/40 rounded-full mb-4" />
          <h2 className="text-white font-bold text-lg">Add New Item</h2>
          
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 bg-white flex items-center justify-center w-8 h-8 rounded-full text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Form Area */}
        <div className="bg-[#fcfcfc] px-6 py-6 overflow-y-auto flex-1 rounded-t-3xl -mt-4 pb-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Add Photo Box */}
            <button type="button" className="w-full h-28 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center gap-2 text-gray-400 hover:bg-gray-50 transition-colors">
              <Camera size={28} className="text-gray-300" />
              <span className="text-sm font-medium">Add Photo</span>
            </button>

            {/* Name and Category (Side by Side in image?) Wait, image shows them side by side! */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClass}>Item Name*</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Whole milk" 
                  className={inputClass}
                />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Category*</label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    <option value="" disabled></option>
                    <option value="Dairy">Dairy</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Meat">Meat</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Others">Others</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-800">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Unit */}
            <div className="flex gap-4">
              <div className="flex-[3]">
                <label className={labelClass}>Quantity *</label>
                <input 
                  type="number" 
                  min="0"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex-[2]">
                <label className={labelClass}>Unit</label>
                <div className="relative">
                  <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    <option value="" disabled></option>
                    <option value="pcs">pcs</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="L">L</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-800">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <label className={labelClass}>Expiry Date *</label>
              <input 
                type="date" 
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>Notes (optional)</label>
              <textarea 
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any extra info..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 mt-2 rounded-[14px] text-[15px] font-bold transition-all shadow-sm ${
                isValid 
                  ? 'bg-brand text-white hover:bg-[#eb7456]' 
                  : 'bg-[#FFCDBF] text-white cursor-not-allowed'
              }`}
            >
              Add to inventory
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
