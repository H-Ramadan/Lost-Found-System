import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Sparkles } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { Select, Textarea } from '../components/ui/Input';
import { CATEGORIES, spring } from '../lib/constants';

// Simple keyword-based prediction
const CATEGORY_KEYWORDS = {
  Mobiles: ['phone', 'iphone', 'samsung', 'mobile', 'smartphone', 'pixel', 'android', 'galaxy'],
  Wallets: ['wallet', 'purse', 'cardholder', 'cash', 'money'],
  Keys: ['key', 'keys', 'keychain', 'car key', 'fob'],
  Accessories: ['watch', 'ring', 'necklace', 'bracelet', 'earrings', 'glasses', 'sunglasses'],
  Bags: ['bag', 'backpack', 'tote', 'suitcase', 'luggage'],
  Makeup: ['makeup', 'lipstick', 'compact', 'perfume', 'cosmetics'],
  'Notebooks/Books': ['book', 'notebook', 'diary', 'journal', 'planner', 'binder'],
};

export default function FormView({ post, api, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [predictedCategory, setPredictedCategory] = useState(null);
  const [form, setForm] = useState({
    title: post?.title || '',
    category: post?.category || '',
    status: post?.status || 'lost',
    description: post?.description || '',
    phone_number: post?.phone || '',
  });

  // Predictive Category Logic
  useEffect(() => {
    if (!form.title) {
      setPredictedCategory(null);
      return;
    }
    const titleLower = form.title.toLowerCase();
    let foundCategory = null;
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(kw => titleLower.includes(kw))) {
        foundCategory = category;
        break;
      }
    }
    
    if (foundCategory && form.category !== foundCategory) {
      setPredictedCategory(foundCategory);
    } else {
      setPredictedCategory(null);
    }
  }, [form.title, form.category]);

  const applyPrediction = () => {
    if (predictedCategory) {
      setForm(prev => ({ ...prev, category: predictedCategory }));
      setPredictedCategory(null);
    }
  };

  const update = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    // Clear prediction if user manually changes category
    if (key === 'category') setPredictedCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);

    try {
      await api[post ? 'put' : 'post'](post ? `/posts/${post.id}` : '/posts/', fd);
      onSuccess();
    } catch {
      alert('Failed to save. Please try again.');
    }
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('image/')) setFile(dropped);
  };

  // Context Aware UI
  const isLost = form.status === 'lost';
  const accentColor = isLost ? 'text-red-400' : 'text-emerald-400';
  const accentBorder = isLost ? 'border-red-500/20' : 'border-emerald-500/20';
  const descPlaceholder = isLost 
    ? "Where did you last see it? Any unique identifiers?" 
    : "Where did you find this? (Keep some details hidden for verification)";

  return (
    <motion.div
      layoutId={post ? `post-${post.id}` : undefined}
      key="form"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={spring}
      className="max-w-xl mx-auto"
    >
      <div className={`glass-card p-6 sm:p-8 transition-colors duration-500 border-t-2 ${isLost ? 'border-t-red-500/50' : 'border-t-emerald-500/50'}`}>
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-heading text-gradient">
            {post ? 'Edit Report' : 'New Report'}
            </h1>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/[0.04] border ${accentBorder} ${accentColor} transition-colors duration-500`}>
                {isLost ? 'Reporting Lost Item' : 'Reporting Found Item'}
            </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="relative">
            <Input
              label="Item name"
              placeholder="e.g. Vintage Leather Wallet"
              value={form.title}
              onChange={update('title')}
              required
              autoFocus
            />
            {predictedCategory && (
               <motion.button
                 type="button"
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 onClick={applyPrediction}
                 className="absolute right-2 top-8 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/[0.1] hover:bg-primary/[0.2] border border-primary/20 rounded-md transition-colors"
               >
                 <Sparkles size={12} />
                 Suggest: {predictedCategory}
               </motion.button>
            )}
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={update('category')} required>
              <option value="" disabled>Select category</option>
              {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </Select>
            <Select label="Status" value={form.status} onChange={update('status')}>
              <option value="lost">I Lost This</option>
              <option value="found">I Found This</option>
            </Select>
          </div>

          {/* Description */}
          <Textarea
            label="Description"
            placeholder={descPlaceholder}
            rows={4}
            value={form.description}
            onChange={update('description')}
          />

          {/* Phone */}
          <Input
            label="Contact"
            placeholder="Phone number or Telegram"
            value={form.phone_number}
            onChange={update('phone_number')}
          />

          {/* Upload Zone */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              Photo
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`
                relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
                ${dragOver
                  ? 'border-primary bg-primary/[0.06] scale-[1.01]'
                  : 'border-white/[0.06] hover:border-white/[0.12] bg-bg/30 hover:bg-bg/50'}
              `}
            >
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Upload image"
              />
              <div className="flex flex-col items-center py-8 pointer-events-none">
                {file ? (
                  <>
                    <Camera size={28} className="text-primary mb-2" />
                    <p className="text-sm text-slate-300 font-medium">{file.name}</p>
                    <p className="text-xs text-slate-600 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="text-slate-600 mb-2" />
                    <p className="text-sm text-slate-500">Drop an image or click to browse</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={loading} className="flex-1">
              {post ? 'Update' : 'Publish'} Report
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
