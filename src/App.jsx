import { Refrigerator, Book, ChefHat, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Inventory from './components/Inventory';
import ItemDetail from './components/ItemDetail';
import AddItemOverlay from './components/AddItemOverlay';
import AddRecipeOverlay from './components/AddRecipeOverlay';
import Recipes from './components/Recipes';
import { mockInventory, mockRecipes } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState(mockInventory.map(item => ({...item, originalQuantity: item.quantity})));
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [customRecipes, setCustomRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleAddRecipe = (recipe) => {
    setCustomRecipes(prev => [recipe, ...prev]);
    showToast('Recipe added! 📖');
  };

  const handleToggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleRemoveRecipe = (id) => {
    setCustomRecipes(prev => prev.filter(r => r.id !== id));
    setFavorites(prev => prev.filter(f => f !== id));
    showToast('Recipe removed! 🗑️');
  };

  const handleCookIngredients = (usedQuantities) => {
    setInventory(prev => prev.map(item => {
      const deductAmount = usedQuantities[item.id];
      if (deductAmount !== undefined && deductAmount > 0) {
        let remainingToDeduct = deductAmount;
        let newBadges = item.batches ? [...item.batches] : [{
          id: item.id + '_badge',
          dateAdded: item.dateAdded || new Date().toISOString(),
          quantity: item.quantity,
          originalQuantity: item.originalQuantity || item.quantity,
          expiryDays: item.expiryDays
        }];
        
        // Sort by expiry asc to deduct from oldest/expiring-first
        newBadges.sort((a, b) => a.expiryDays - b.expiryDays);
        
        const updatedBadges = newBadges.map(b => {
           if (remainingToDeduct <= 0) return b;
           if (b.quantity >= remainingToDeduct) {
              const updatedB = { ...b, quantity: b.quantity - remainingToDeduct };
              remainingToDeduct = 0;
              return updatedB;
           } else {
              remainingToDeduct -= b.quantity;
              return { ...b, quantity: 0 };
           }
        }).filter(b => b.quantity > 0);

        return { 
          ...item, 
          quantity: Math.max(0, item.quantity - deductAmount),
          batches: updatedBadges
        };
      }
      return item;
    }).filter(item => item.quantity > 0));
    showToast('Bon appétit! Ingredients used 🍽️');
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    setSelectedItem(prev => prev && prev.id === id ? { ...prev, quantity: newQuantity } : prev);
  };

  const handleUpdateItem = (updatedItem) => {
    setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setSelectedItem(updatedItem);
  };

  const handleRemoveItem = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    setSelectedItem(null);
    showToast('Item removed from fridge! 🗑️');
  };

  const handleClearAll = () => {
    setInventory([]);
    setSelectedItem(null);
    showToast('Inventory cleared! 🗑️');
  };

  const handleAddNewItem = (newItem) => {
    setInventory(prev => {
      const existingItemIndex = prev.findIndex(item => item.name.toLowerCase() === newItem.name.toLowerCase());
      if (existingItemIndex !== -1) {
        // Merge with existing item
        const updatedInventory = [...prev];
        const existingItem = updatedInventory[existingItemIndex];
        
        const oldBatches = existingItem.batches || [
          {
            id: existingItem.id + '_orig',
            dateAdded: existingItem.dateAdded,
            quantity: existingItem.quantity,
            originalQuantity: existingItem.originalQuantity || existingItem.quantity,
            expiryDays: existingItem.expiryDays
          }
        ];
        
        const newBatch = {
          id: Math.random().toString(36).substring(7) + Date.now().toString(),
          dateAdded: new Date().toISOString(),
          quantity: newItem.quantity,
          originalQuantity: newItem.quantity,
          expiryDays: newItem.expiryDays
        };

        updatedInventory[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + newItem.quantity,
          originalQuantity: (existingItem.originalQuantity || existingItem.quantity) + newItem.quantity,
          expiryDays: Math.min(existingItem.expiryDays, newItem.expiryDays),
          batches: [...oldBatches, newBatch].sort((a, b) => a.expiryDays - b.expiryDays),
          notes: newItem.notes ? (existingItem.notes ? `${existingItem.notes} | ${newItem.notes}` : newItem.notes) : existingItem.notes
        };
        showToast(`Added ${newItem.quantity}g badge to ${existingItem.name}! ✅`);
        return updatedInventory;
      } else {
        // Add new item
        const addedDate = new Date().toISOString();
        const itemId = Math.random().toString(36).substring(7) + Date.now().toString();
        const item = {
          ...newItem,
          id: itemId,
          dateAdded: addedDate,
          originalQuantity: newItem.quantity,
          batches: [{
            id: itemId + '_badge',
            dateAdded: addedDate,
            quantity: newItem.quantity,
            originalQuantity: newItem.quantity,
            expiryDays: newItem.expiryDays,
            note: newItem.notes
          }]
        };
        showToast(`Added ${item.name} to fridge! ✅`);
        return [...prev, item];
      }
    });
    setIsAddOverlayOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center text-gray-800 font-poppins">
      <div className="w-full max-w-[450px] bg-white h-screen flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Global Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-[80px] left-1/2 -translate-x-1/2 z-50 bg-white rounded-full shadow-lg px-5 py-3 flex items-center justify-center gap-2 border border-gray-100 whitespace-nowrap"
            >
               <Check size={16} className="text-[#FF7A59] stroke-[2.5]" />
               <span className="text-[14px] font-bold text-gray-800">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between bg-white z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center">
               <Refrigerator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight text-gray-900">MyFridge</h1>
          </div>
          {activeTab === 'inventory' ? (
            <div className="text-sm font-medium text-gray-500">
              {inventory.length} item{inventory.length !== 1 ? 's' : ''}
            </div>
          ) : (
            <div className="text-sm font-medium text-brand flex items-center gap-1.5">
              <ChefHat size={16} />
              <span>{mockRecipes.length + customRecipes.length} recipes</span>
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {selectedItem ? (
            <ItemDetail 
              item={selectedItem} 
              onBack={() => setSelectedItem(null)} 
              onUpdateQuantity={handleUpdateQuantity}
              onUpdateItem={handleUpdateItem}
              onRemove={handleRemoveItem}
              showToast={showToast}
            />
          ) : activeTab === 'inventory' ? (
            <Inventory 
              inventory={inventory} 
              onItemClick={setSelectedItem} 
              onAddClick={() => setIsAddOverlayOpen(true)}
              onClearAll={handleClearAll}
            />
          ) : (
            <Recipes 
              inventory={inventory} 
              customRecipes={customRecipes}
              favorites={favorites}
              onAddCustomRecipe={handleAddRecipe}
              onToggleFavorite={handleToggleFavorite}
              onCookIngredients={handleCookIngredients}
              onRemoveCustomRecipe={handleRemoveRecipe}
              onAddRecipeClick={() => setIsAddRecipeOpen(true)}
              showToast={showToast}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        {!selectedItem && (
          <nav className="bg-white border-t border-gray-100 flex px-2 py-1 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] z-20 shrink-0">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex flex-col items-center justify-center flex-1 py-3 gap-1.5 transition-colors ${
                activeTab === 'inventory' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Refrigerator className={`w-6 h-6 stroke-[1.5] ${activeTab === 'inventory' ? 'text-gray-900' : ''}`} />
              <span className="text-[11px] font-medium tracking-wide">Inventory</span>
            </button>
            
            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex flex-col items-center justify-center flex-1 py-3 gap-1.5 transition-colors ${
                activeTab === 'recipes' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Book className={`w-6 h-6 stroke-[1.5] ${activeTab === 'recipes' ? 'text-gray-900' : ''}`} />
              <span className="text-[11px] font-medium tracking-wide">Recipes</span>
            </button>
          </nav>
        )}

        <AnimatePresence>
          {isAddOverlayOpen && (
            <AddItemOverlay 
              onClose={() => setIsAddOverlayOpen(false)} 
              onAdd={handleAddNewItem} 
            />
          )}
          {isAddRecipeOpen && (
            <AddRecipeOverlay 
              onClose={() => setIsAddRecipeOpen(false)} 
              onAdd={handleAddRecipe} 
              inventory={inventory}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
