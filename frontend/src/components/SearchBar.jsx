import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Phone, User, Loader2 } from 'lucide-react';
import { searchCustomer } from '../services/api';

const SearchBar = ({ onSelectCustomer, onOpenNewCustomerModal }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const res = await searchCustomer(query);
          setResults(res.data.data || []);
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-10">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-amber-400 transition" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search client by full name or phone number..."
            className="w-full pl-12 pr-12 py-3.5 bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-neutral-100 placeholder-neutral-500 transition text-sm"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 animate-spin" />
          )}
        </div>

        <button
          onClick={onOpenNewCustomerModal}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-semibold rounded-2xl shadow-lg shadow-amber-500/20 transition active:scale-98 text-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>New Client</span>
        </button>
      </div>

      {/* Auto-suggest dropdown */}
      {results.length > 0 && (
        <div className="absolute z-30 w-full mt-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl">
          <div className="px-4 py-2 text-[11px] font-semibold tracking-wider uppercase text-neutral-400 border-b border-neutral-800">
            Search Matches ({results.length})
          </div>
          {results.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                onSelectCustomer(c.id);
                setResults([]);
                setQuery('');
              }}
              className="flex justify-between items-center px-4 py-3 hover:bg-neutral-800/70 cursor-pointer border-b border-neutral-800/40 last:border-0 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-100 text-sm">{c.full_name}</h4>
                  <p className="text-xs text-neutral-400">{c.notes || 'No profile notes'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
                <Phone className="h-3.5 w-3.5 text-neutral-500" />
                {c.phone_number}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;