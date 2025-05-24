'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { searchCities } from '@/data/cities';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBar({ onSearch, isLoading = false, value = '', onChange }: SearchBarProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update internal state when external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle debounced search for suggestions
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      const results = searchCities(debouncedQuery, 5);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (city: string) => {
    setQuery(city);
    onChange?.(city);
    onSearch(city);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const clearInput = () => {
    setQuery('');
    onChange?.('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Search City"
            className="w-full px-4 py-3 pl-12 pr-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
            disabled={isLoading}
            autoComplete="off"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          
          {query && !isLoading && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 hover:text-white/80 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl border border-white/20 backdrop-blur-md z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((city, index) => (
            <button
              key={city}
              onClick={() => handleSuggestionClick(city)}
              className={`w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                index === selectedIndex ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-center">
                <MagnifyingGlassIcon className="w-4 h-4 text-white/40 mr-3" />
                <span className="text-sm">{city}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 