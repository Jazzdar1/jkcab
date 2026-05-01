import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAdminWithEmail } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { refreshAdminStatus } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInAdminWithEmail(email, password);
      await refreshAdminStatus();
      navigate('/admin');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border p-6 space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-xl px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl px-3 py-2"
          required
        />

        {error ? <p className="text-red-500 text-sm">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-xl py-2 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in as Admin'}
        </button>
      </form>
    </div>
  );
}
