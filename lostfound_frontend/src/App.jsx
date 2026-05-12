import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import FormView from './views/FormView';
import { LoginView, SignupView } from './views/AuthViews';
import { createApi } from './lib/constants';

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ page: 1, q: '', status: '', category: '' });
  const [editPost, setEditPost] = useState(null);

  const api = useMemo(() => createApi(token), [token]);

  // ─── Fetch Posts ───
  const fetchPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await api.get('/posts/', { params: filters });
      setPosts(data.posts || []);
      setPagination({
        pages: data.pages,
        current: data.current_page,
        has_next: data.has_next,
        has_prev: data.has_prev,
      });
    } catch (err) {
      console.error('Fetch failed:', err);
      setPosts([]);
    }
    setLoading(false);
  }, [api, token, filters]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ─── Auth Handlers ───
  const handleLoginSuccess = useCallback((data) => {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
    setView('home');
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setPosts([]);
    setView('home');
  }, []);

  // ─── Navigation ───
  const navigate = useCallback((v) => {
    setView(v);
    if (v === 'home') setEditPost(null);
  }, []);

  // ─── Post Actions ───
  const handleEdit = useCallback((post) => {
    setEditPost(post);
    setView('add');
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!confirm('Delete this item permanently?')) return;
    // Optimistic removal
    setPosts(prev => prev.filter(p => p.id !== id));
    try {
      await api.delete(`/posts/${id}`);
    } catch {
      fetchPosts(); // Revert on failure
    }
  }, [api, fetchPosts]);

  const handleFormSuccess = useCallback(() => {
    setView('home');
    setEditPost(null);
    fetchPosts();
  }, [fetchPosts]);

  // ─── Render Gates ───
  if (!token && view !== 'signup') {
    return <LoginView onSuccess={handleLoginSuccess} onGoSignup={() => setView('signup')} />;
  }
  if (view === 'signup') {
    return <SignupView onSuccess={() => setView('login')} onGoLogin={() => setView('login')} />;
  }

  return (
    <div className="min-h-screen relative">
      <Navbar user={user} onNavigate={navigate} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <HomeView
              key="home"
              posts={posts}
              loading={loading}
              pagination={pagination}
              filters={filters}
              setFilters={setFilters}
              currentUser={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNavigate={navigate}
            />
          )}
          {view === 'add' && (
            <FormView
              key="form"
              post={editPost}
              api={api}
              onSuccess={handleFormSuccess}
              onCancel={() => navigate('home')}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
