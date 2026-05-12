import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail } from 'lucide-react';
import axios from 'axios';
import { Button, Input } from '../components/ui';
import { API_URL, spring } from '../lib/constants';

export function LoginView({ onSuccess, onGoSignup }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!identifier || !password) {
      setError('Please enter both username/email and password');
      setLoading(false);
      return;
    }
    
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { identifier, password });
      onSuccess(data);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Login failed. Please check your credentials.';
      setError(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Ambient background glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/[0.07] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="glass-card p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 }}
            >
              <h1 className="text-display text-gradient mb-2">Welcome back</h1>
              <p className="text-sm text-slate-500">Sign in to your LostFound account</p>
            </motion.div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3 rounded-xl bg-danger-muted border border-red-500/20 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Identifier"
              icon={User}
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
            <Input
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500">
            New here?{' '}
            <button
              onClick={onGoSignup}
              className="text-primary font-semibold hover:text-primary-hover transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function SignupView({ onSuccess, onGoLogin }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    if (!form.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      await axios.post(`${API_URL}/auth/signup`, form);
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Registration failed. Please try again.';
      setError(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="glass-card p-8 sm:p-10">
          <div className="text-center mb-10">
            <h1 className="text-display text-gradient mb-2">Join LostFound</h1>
            <p className="text-sm text-slate-500">Help reunite items with their owners</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-3 rounded-xl bg-danger-muted border border-red-500/20 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Username" icon={User} placeholder="Choose a username" value={form.username} onChange={update('username')} required autoFocus />
            <Input label="Email" icon={Mail} type="email" placeholder="name@example.com" value={form.email} onChange={update('email')} required />
            <Input label="Password" icon={Lock} type="password" placeholder="Create a strong password" value={form.password} onChange={update('password')} required />
            <Button type="submit" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500">
            Already a member?{' '}
            <button onClick={onGoLogin} className="text-primary font-semibold hover:text-primary-hover transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
