import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SeriesNameComboboxProps {
  value: string;
  onChange: (value: string) => void;
  existingSeriesNames: string[];
  placeholder?: string;
  disabled?: boolean;
}

export function SeriesNameCombobox({
  value,
  onChange,
  existingSeriesNames,
  placeholder = 'e.g., Figure Drawing',
  disabled = false,
}: SeriesNameComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync input value when external value changes (e.g. form reset)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) return existingSeriesNames;
    const lower = inputValue.toLowerCase();
    return existingSeriesNames.filter((name) =>
      name.toLowerCase().includes(lower)
    );
  }, [existingSeriesNames, inputValue]);

  const canCreateNew = inputValue.trim() && !existingSeriesNames.includes(inputValue.trim());

  const optionCount = filteredOptions.length + (canCreateNew ? 1 : 0);

  // Clamp highlighted index when options change
  useEffect(() => {
    setHighlightedIndex((i) => Math.min(i, Math.max(0, optionCount - 1)));
  }, [optionCount]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        onChange(inputValue.trim() || '');
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, inputValue, onChange]);

  const handleSelect = (selected: string) => {
    setInputValue(selected);
    onChange(selected);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((i) =>
          Math.min(i + 1, filteredOptions.length + (canCreateNew ? 1 : 0) - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (canCreateNew && highlightedIndex === filteredOptions.length) {
          handleSelect(inputValue.trim());
        } else if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setInputValue(value);
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (open && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputValue(v);
    onChange(v);
    setOpen(true);
    setHighlightedIndex(0);
  };

  const handleInputFocus = () => {
    setOpen(true);
    setHighlightedIndex(0);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-8"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded'
          )}
          aria-label="Toggle dropdown"
        >
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
          />
        </button>
      </div>

      {open && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-card py-1 text-card-foreground shadow-md"
          role="listbox"
        >
          {filteredOptions.length === 0 && !canCreateNew ? (
            <li
              className="px-3 py-2 text-sm text-muted-foreground"
              role="option"
            >
              No series found. Type to create a new one.
            </li>
          ) : (
            <>
              {filteredOptions.map((name, i) => (
                <li
                  key={name}
                  role="option"
                  aria-selected={highlightedIndex === i}
                  className={cn(
                    'cursor-pointer px-3 py-2 text-sm',
                    highlightedIndex === i && 'bg-primary/10 text-primary',
                    'hover:bg-primary/10'
                  )}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(name);
                  }}
                >
                  {name}
                </li>
              ))}
              {canCreateNew && (
                <li
                  role="option"
                  aria-selected={highlightedIndex === filteredOptions.length}
                  className={cn(
                    'cursor-pointer px-3 py-2 text-sm text-muted-foreground',
                    highlightedIndex === filteredOptions.length && 'bg-primary/10 text-primary',
                    'hover:bg-primary/10'
                  )}
                  onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(inputValue.trim());
                  }}
                >
                  Create &quot;{inputValue.trim()}&quot;
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
