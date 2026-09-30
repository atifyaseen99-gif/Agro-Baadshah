import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/images/logo.jpg';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid username or password. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#062418] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-emerald-900/20">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-500/40 mx-auto bg-[#07130e] p-0.5">
            <img
              src={logoImg}
              alt="Agro Baadshah Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            {/* EXACT TITLE AS REQUIRED */}
            <h1 className="text-2xl font-bold font-serif text-stone-900">
              Admin Login
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Agro Baadshah Management System
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0e4d34] hover:bg-[#093926] text-white text-xs font-bold rounded-lg shadow-md transition-colors"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="pt-2 text-center">
          <a
            href="/"
            className="text-xs text-stone-500 hover:text-emerald-800 transition"
          >
            ← Back to Agro Baadshah Store
          </a>
        </div>
      </div>
    </div>
  );
};
