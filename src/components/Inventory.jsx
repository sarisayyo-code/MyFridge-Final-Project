import { Clock, AlertTriangle, ArrowDownUp, Plus, X } from 'lucide-react';
import { useState } from 'react';

export default function Inventory({ inventory, onItemClick, onAddClick, onClearAll }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('expiry');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalItems = inventory.length;
  const expiringSoon = inventory.filter(i => i.expiryDays <= 2).length;
  const expired = inventory.filter(i => i.expiryDays <= 0).length;

  const filters = ['All', 'Dairy', 'Vegetables', 'Meat', 'Fruit', 'Others'];

  const getExpiryStyle = (days) => {
    if (days <= 2) return 'bg-red-50 text-red-500';
    if (days <= 5) return 'bg-orange-50 text-orange-500';
    return 'bg-green-50 text-green-500';
  };

  const getCardStyle = (days) => {
    if (days <= 2) return 'border-red-100 bg-red-50/10 shadow-sm';
    return 'border-gray-100 bg-white shadow-sm';
  };

  const filteredInventory = inventory.filter(item => {
    if (activeFilter === 'All') return true;
    return item.category === activeFilter;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (sortBy === 'expiry') return a.expiryDays - b.expiryDays;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'quantity') return b.quantity - a.quantity;
    if (sortBy === 'dateAddedDesc') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    if (sortBy === 'dateAddedAsc') return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    return 0;
  });

  return (
    <div className="flex flex-col pb-24">
      {/* Summary Cards */}
      <div className="bg-white px-6 py-4">
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05),0_4px_24px_-4px_rgba(0,0,0,0.05)] p-4 border border-gray-50">
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl font-bold text-gray-900">{totalItems}</span>
            <span className="text-xs text-gray-400 mt-1">Total Items</span>
          </div>
          <div className="w-[1px] h-10 bg-gray-100"></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl font-bold text-brand">{expiringSoon}</span>
            <span className="text-xs text-gray-400 mt-1">Expiring Soon</span>
          </div>
          <div className="w-[1px] h-10 bg-gray-100"></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl font-bold text-gray-400">{expired}</span>
            <span className="text-xs text-gray-400 mt-1">Expired</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-2 overflow-x-auto hide-scrollbar flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
              activeFilter === filter
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Sort Info */}
      <div className="px-6 py-3 flex items-center gap-1.5 text-gray-400 text-xs font-medium">
        <ArrowDownUp className="w-3.5 h-3.5" />
        <select 
          className="appearance-none bg-transparent outline-none cursor-pointer pr-4 hover:text-gray-600 transition-colors"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="expiry">Sort by: Expiry Date</option>
          <option value="name">Sort by: Name</option>
          <option value="quantity">Sort by: Quantity</option>
          <option value="dateAddedDesc">Sort by: Date Added (Newest)</option>
          <option value="dateAddedAsc">Sort by: Date Added (Oldest)</option>
        </select>
      </div>

      {/* Inventory List */}
      <div className="px-6 flex flex-col gap-3 relative">
        {sortedInventory.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            No items found for this category.
          </div>
        ) : (
          sortedInventory.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className={`flex items-center p-3 rounded-2xl cursor-pointer border hover:shadow-md transition-shadow ${getCardStyle(item.expiryDays)}`}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onContextMenu={(e) => e.preventDefault()} />
              </div>
              
              <div className="ml-4 flex-1 flex flex-col gap-0.5">
                <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                <div className="text-[13px] text-gray-400 font-medium">
                  {item.quantity} {item.unit} · {item.category}
                </div>
                <div className={`mt-1 self-start flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${getExpiryStyle(item.expiryDays)}`}>
                  <Clock className="w-3 h-3" />
                  {item.expiryDays <= 0 ? 'Expired' : `${item.expiryDays} day${item.expiryDays > 1 ? 's' : ''}`}
                </div>
              </div>

              {item.expiryDays <= 2 && (
                <div className="pr-2 shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500 stroke-[1.5]" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Clear All Button */}
        {sortedInventory.length > 0 && (
          <div className="mt-6 flex justify-center pb-8 z-10 relative">
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="text-gray-500 font-bold text-sm bg-gray-50 px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Clear All Inventory
            </button>
          </div>
        )}

        {/* FAB */}
        <button 
          onClick={onAddClick}
          className="fixed bottom-[88px] max-w-[450px] ml-auto mr-auto w-[calc(100%-48px)] left-0 right-0 flex justify-end pointer-events-none z-10 px-6"
        >
          <div className="w-[52px] h-[52px] bg-brand rounded-full shadow-lg flex items-center justify-center text-white pointer-events-auto shadow-brand/30 hover:bg-[#fa7756] transition-colors cursor-pointer">
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
        </button>
      </div>

      {/* Clear Confirmation Popup */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[320px] rounded-[24px] p-6 flex flex-col gap-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowClearConfirm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
              <X size={20} />
            </button>
            
            <div className="flex flex-col gap-2 pt-2">
              <h3 className="text-xl font-bold text-gray-900 pr-8">Clear all?</h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Are you sure you want to clear your entire inventory? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
              <button 
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="w-full py-3.5 rounded-xl bg-gray-800 text-white font-bold text-[15px] shadow-sm transition-all hover:bg-gray-900"
              >
                Yes, Clear All
              </button>
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-[15px] transition-all hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
