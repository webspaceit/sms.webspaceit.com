import { useState, useRef, useEffect, useMemo, memo } from 'react';
import { Input } from '@/components/ui/input';

type Option = { value: string; label: string };

type SearchableSelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const SearchableSelect = memo(function SearchableSelect({ options, value, onChange, placeholder = 'Search...', disabled }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = useMemo(() => options.find((o) => o.value === value)?.label ?? '', [options, value]);

  const filtered = useMemo(() => options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())), [options, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setHighlighted(0);
      setSearch('');
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSearch(selectedLabel);
    }
  }, [value, open, selectedLabel]);

  const select = (val: string) => {
    onChange(val);
    setOpen(false);
    const label = options.find((o) => o.value === val)?.label ?? '';
    setSearch(label);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[highlighted]) {
      e.preventDefault();
      select(filtered[highlighted].value);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        ref={inputRef}
        value={open ? search : selectedLabel}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => { if (!disabled) setOpen(true); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={!open}
        className="cursor-pointer"
      />
      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover p-1 shadow-lg">
          {filtered.length === 0 ? (
            <p className="py-2 text-center text-sm text-muted-foreground">No results found.</p>
          ) : (
            filtered.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); select(option.value); }}
                onMouseEnter={() => setHighlighted(index)}
                className={`w-full rounded px-2 py-1.5 text-left text-sm ${
                  index === highlighted ? 'bg-accent text-accent-foreground' : ''
                } ${option.value === value ? 'font-medium' : ''}`}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
});

export default SearchableSelect;
