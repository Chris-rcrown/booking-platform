// src/components/AirportAutocomplete.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDebounce } from '../hooks/useDebounce';

export interface Option { code: string; name: string }

interface Props {
  value: string;
  onInputChange: (v: string) => void;
  onSelect: (code: string, label: string) => void;
}
export function AirportAutocomplete({ value, onInputChange, onSelect }: Props) {
  const debounced = useDebounce(value, 400);
  const [options, setOptions] = useState<Option[]>([]);
  const cache = useRef<Record<string, Option[]>>({});

  useEffect(() => {
    const q = debounced.trim().toUpperCase();
    if (q.length < 2) return setOptions([]);

    if (cache.current[q]) {
      return setOptions(cache.current[q]);
    }

    axios
      .get('/api/airports', { params: { keyword: q } })
      .then(r => {
        const list = r.data.data as Option[];
        cache.current[q] = list;
        setOptions(list);
      })
      .catch(() => setOptions([]));
  }, [debounced]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onInputChange(e.target.value)}
        className="border p-2 rounded w-full"
        placeholder="Type airport or city…"
      />
      {options.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 max-h-60 overflow-auto">
          {options.map(opt => (
            <li
              key={opt.code}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                const label = `${opt.code} – ${opt.name}`;
                onSelect(opt.code, label);
                setOptions([]);
              }}
            >
              {opt.code} – {opt.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
