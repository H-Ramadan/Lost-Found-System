import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone, Wallet, KeyRound, Watch, ShoppingBag,
  Sparkles, BookOpen, Package, Phone, User, Edit3, Trash2,
} from 'lucide-react';
import Card from './ui/Card';
import { API_URL, CATEGORIES, springGentle } from '../lib/constants';

const ICON_MAP = {
  smartphone: Smartphone, wallet: Wallet, 'key-round': KeyRound,
  watch: Watch, 'shopping-bag': ShoppingBag, sparkles: Sparkles,
  'book-open': BookOpen, package: Package,
};

function PostCard({ post, index, currentUser, onEdit, onDelete, layoutId }) {
  const cat = CATEGORIES.find(c => c.name === post.category) || { icon: 'package' };
  const CatIcon = ICON_MAP[cat.icon] || Package;
  const isOwner = currentUser?.username === post.reporter || currentUser?.is_admin;
  const imgSrc = post.image
    ? post.image.startsWith('http') ? post.image : `${API_URL}${post.image}`
    : null;

  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springGentle, delay: index * 0.04 }}
    >
      <Card glow className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span
            className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
              ${post.status === 'lost'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}
            `}
          >
            {post.status}
          </span>

          {isOwner && (
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-500 hover:text-white transition-colors"
                aria-label="Edit post"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg bg-red-500/[0.06] hover:bg-red-500/[0.12] text-red-400/60 hover:text-red-400 transition-colors"
                aria-label="Delete post"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Title & Category */}
        <h3 className="text-base font-bold leading-snug mb-1.5 group-hover:text-primary-hover transition-colors duration-200">
          {post.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white/[0.03] w-fit px-2 py-0.5 rounded-md mb-3">
          <CatIcon size={11} /> {post.category}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1">
          {post.description || 'No description provided.'}
        </p>

        {/* Image */}
        {imgSrc && (
          <div className="mb-4 aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.04] bg-bg">
            <img
              src={imgSrc}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <Phone size={12} className="text-primary" /> {post.phone}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-600">
            <User size={10} /> {post.reporter} · {new Date(post.date).toLocaleDateString()}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default memo(PostCard);
