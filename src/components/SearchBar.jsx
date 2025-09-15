"use client";

import { useState, useEffect } from "react";

export default function SearchBar({ onSearch, suggestions, onSuggestionSelect, city, setCity }) {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (city.length >= 2) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setShowDropdown(false);
    }
  };

const handleSuggestionClick = (suggestion) => {
  setCity(suggestion.name);
  onSuggestionSelect(suggestion);   // send full object, not just name
  setShowDropdown(false);
};


  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-lg placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!city.trim()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <span>Search</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {showDropdown && suggestions?.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto z-10 border border-gray-200">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3 transition-all duration-150"
            >
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <span className="text-gray-800 font-medium block">{suggestion.name}</span>
                {suggestion.country && (
                  <span className="text-gray-500 text-sm">({suggestion.country})</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}