import {Clock , MapPin} from "lucide-react";
export default function RecentlySearched({ searches, onSearch, onClear }) {

  if (searches.length === 0) return null;
  
  return (
    <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Searches
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSearch(search)}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-full px-4 py-2 text-sm text-gray-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <MapPin className="w-3 h-3 text-blue-500" />
            <span>{search.name}</span>
            <span className="text-gray-400 text-xs">({search.country})</span>
          </button>
        ))}
      </div>
    </div>
  );
}