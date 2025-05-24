'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { weatherService } from '@/services/weatherService';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  displayName: string;
  lat: number;
  lon: number;
}

export default function SearchBar({ onSearch, isLoading = false, value = '', onChange }: SearchBarProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<CitySearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isExternalUpdate, setIsExternalUpdate] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasUserTyped, setHasUserTyped] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update internal state when external value changes
  useEffect(() => {
    if (value !== query) {
      setIsExternalUpdate(true);
      setQuery(value);
      setShowSuggestions(false); // Don't show suggestions when value is set externally
      setHasUserTyped(false); // Reset user typing flag
    }
  }, [value, query]);

  // Handle debounced search for suggestions
  useEffect(() => {
    const searchCities = async () => {
      // Only show suggestions if user is typing AND focused AND has actually typed something
      if (debouncedQuery.length >= 2 && !isExternalUpdate && isFocused && hasUserTyped) {
        setIsSearching(true);
        try {
          const results = await weatherService.searchCities(debouncedQuery, 8);
          
          // Remove duplicates and format results
          const seenCities = new Set<string>();
          const uniqueResults: CitySearchResult[] = [];
          
          for (const city of results) {
            const uniqueKey = `${city.name.toLowerCase()}-${city.country}${city.state ? `-${city.state}` : ''}`;
            if (!seenCities.has(uniqueKey)) {
              seenCities.add(uniqueKey);
              uniqueResults.push({
                name: city.name,
                country: city.country,
                state: city.state,
                lat: city.lat,
                lon: city.lon,
                displayName: `${city.name}, ${city.state ? `${city.state}, ` : ''}${city.country}`
              });
            }
          }
          
          setSuggestions(uniqueResults);
          setShowSuggestions(true); // Always show dropdown when user is typing, even if no results
        } catch (error) {
          console.error('Error searching cities:', error);
          setSuggestions([]);
          setShowSuggestions(true); // Show dropdown with error state
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
      }
      setSelectedIndex(-1);
      
      // Reset external update flag after processing
      if (isExternalUpdate) {
        setIsExternalUpdate(false);
      }
    };

    searchCities();
  }, [debouncedQuery, isExternalUpdate, isFocused, hasUserTyped]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setIsExternalUpdate(false); // User is typing
    setHasUserTyped(true); // Mark that user has typed
    setQuery(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleMagnifyClick = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (city: CitySearchResult) => {
    setQuery(city.name);
    onChange?.(city.name);
    onSearch(city.name);
    setShowSuggestions(false);
    setIsFocused(false);
    setHasUserTyped(false);
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
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clearInput = () => {
    setQuery('');
    onChange?.('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsExternalUpdate(false);
    setHasUserTyped(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Don't show suggestions on focus unless user has typed something
  };

  const handleBlur = () => {
    // Delay to allow click on suggestions
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
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
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search any city worldwide..."
            className="w-full px-4 py-3 pl-12 pr-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
            disabled={isLoading}
            autoComplete="off"
            role="searchbox"
            aria-label="Search for cities worldwide"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-describedby="search-instructions"
          />
          <div id="search-instructions" className="sr-only">
            Type at least 2 characters to see city suggestions. Use arrow keys to navigate suggestions and Enter to select.
          </div>
          <button
            type="button"
            onClick={handleMagnifyClick}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 hover:text-white/80 transition-colors cursor-pointer"
            aria-label="Search for city"
            disabled={!query.trim()}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
          
          {query && !isLoading && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 hover:text-white/80 transition-colors"
              aria-label="Clear search input"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          
          {(isLoading || isSearching) && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2" aria-label="Loading search results">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && isFocused && hasUserTyped && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl border border-white/20 backdrop-blur-md z-50 max-h-60 overflow-y-auto"
          role="listbox"
          aria-label="City suggestions"
        >
          {isSearching ? (
            <div className="px-4 py-3 text-center text-white/60">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-sm">Searching cities...</span>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((city, index) => (
              <button
                key={`${city.name}-${city.country}-${city.state || 'no-state'}-${city.lat}-${city.lon}`}
                onClick={() => handleSuggestionClick(city)}
                className={`w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                  index === selectedIndex ? 'bg-white/10' : ''
                }`}
                role="option"
                aria-selected={index === selectedIndex}
                aria-label={`Select ${city.displayName}`}
              >
                <div className="flex items-center">
                  <MagnifyingGlassIcon className="w-4 h-4 text-white/40 mr-3" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{city.name}</span>
                    <span className="text-xs text-white/60">{city.country}{city.state && `, ${city.state}`}</span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-white/60">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-2xl">🌍</span>
                <span className="text-sm font-medium">No cities found</span>
                <span className="text-xs text-white/50">
                  Try searching for a different city or check your spelling
                </span>
                <div className="text-xs text-white/40 mt-2">
                  <span>Popular searches: </span>
                  <button 
                    onClick={() => handleSuggestionClick({ name: 'London', country: 'GB', displayName: 'London, GB', lat: 51.5074, lon: -0.1278 })}
                    className="text-white/60 hover:text-white underline"
                  >
                    London
                  </button>
                  {', '}
                  <button 
                    onClick={() => handleSuggestionClick({ name: 'New York', country: 'US', displayName: 'New York, US', lat: 40.7128, lon: -74.0060 })}
                    className="text-white/60 hover:text-white underline"
                  >
                    New York
                  </button>
                  {', '}
                  <button 
                    onClick={() => handleSuggestionClick({ name: 'Tokyo', country: 'JP', displayName: 'Tokyo, JP', lat: 35.6762, lon: 139.6503 })}
                    className="text-white/60 hover:text-white underline"
                  >
                    Tokyo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 