import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Inbox, ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import PostCard from '../components/PostCard';
import { Button, Input, SkeletonGrid } from '../components/ui';
import { Select } from '../components/ui/Input';
import { CATEGORIES, spring } from '../lib/constants';
import { useDebounce } from '../hooks/useDebounce';

const MAX_RECENT_SEARCHES = 5;

export default function HomeView({ posts, loading, pagination, filters, setFilters, currentUser, onEdit, onDelete, onNavigate }) {
  const [localSearch, setLocalSearch] = useState(filters.q);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentSearches')) || [];
      setRecentSearches(stored);
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = useCallback((term) => {
    if (!term.trim()) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const debouncedSearch = useDebounce((val) => {
    setFilters(prev => ({ ...prev, q: val, page: 1 }));
    saveRecentSearch(val);
  }, 500);

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setLocalSearch(val);
    debouncedSearch(val);
  }, [debouncedSearch]);

  const applyRecentSearch = (term) => {
    setLocalSearch(term);
    setFilters(prev => ({ ...prev, q: term, page: 1 }));
    saveRecentSearch(term);
  };

  const categoryOptions = useMemo(() => CATEGORIES.map(c => (
    <option key={c.name} value={c.name}>{c.name}</option>
  )), []);

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={spring}
      className="space-y-8"
    >
      {/* ─── Filter Bar ─── */}
      <div className="glass-card p-4 sm:p-5 relative z-20">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input
              type="text"
              placeholder="Search items..."
              className="input-field pl-10"
              value={localSearch}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              aria-label="Search items"
              autoFocus
            />
            {/* Smart Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && recentSearches.length > 0 && !localSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 p-2 glass-card border border-border shadow-xl z-30"
                >
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 px-2 tracking-wider">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => applyRecentSearch(term)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/[0.04] hover:bg-primary/[0.15] text-slate-300 hover:text-primary-hover border border-border transition-colors cursor-pointer"
                      >
                        <Clock size={12} />
                        {term}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-3 flex-1 sm:flex-none">
            <Select
              value={filters.category}
              onChange={e => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
              className="sm:w-40"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categoryOptions}
            </Select>
            <Select
              value={filters.status}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="sm:w-32"
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </Select>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SkeletonGrid />
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={spring}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6 animate-float">
              <Inbox size={32} className="text-slate-700" />
            </div>
            <h2 className="text-heading text-gradient mb-2">No items found</h2>
            <p className="text-sm text-slate-500 max-w-xs mb-8">
              Try adjusting your search or filters, or be the first to report an item.
            </p>
            <Button onClick={() => onNavigate('add')}>
              <Plus size={16} /> Report an Item
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10"
          >
            {posts.map((post, i) => (
              <PostCard
                key={post.id}
                layoutId={`post-${post.id}`}
                post={post}
                index={i}
                currentUser={currentUser}
                onEdit={() => onEdit(post)}
                onDelete={() => onDelete(post.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Pagination ─── */}
      {!loading && pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-4 pt-4"
        >
          <Button
            variant="secondary" size="sm"
            disabled={!pagination.has_prev}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs font-medium text-slate-500 tabular-nums">
            {pagination.current} / {pagination.pages}
          </span>
          <Button
            variant="secondary" size="sm"
            disabled={!pagination.has_next}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

