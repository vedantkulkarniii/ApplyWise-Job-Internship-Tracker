'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  selectedSort: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
}

export default function SortDropdown({
  options,
  selectedSort,
  sortOrder,
  onSortChange,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSortOrder = () => {
    onSortChange(selectedSort, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSortSelect = (value: string) => {
    onSortChange(value, sortOrder);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === selectedSort)?.label || 'Sort';

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-2">
      {/* Sort By Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
      >
        <ArrowUpDown className="h-4 w-4" />
        <span>{selectedLabel}</span>
      </button>

      {/* Sort Order Toggle */}
      <button
        onClick={toggleSortOrder}
        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      >
        {sortOrder === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 top-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Sort by</span>
          </div>
          <div className="p-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                  selectedSort === option.value
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
