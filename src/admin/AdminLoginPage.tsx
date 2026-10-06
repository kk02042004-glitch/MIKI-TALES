import React, { useState } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { usePortfolio } from '../store/PortfolioContext';

export const AdminLoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAdminAuth();
  const { setCurrentPage } = usePortfolio();

  const [emailOrUsername, setEmailOrUsername] = useState('kk02042004@gmail.com');
  const [password, setPassword] = useState('MKTales@2026Admin');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) return;
    await login(emailOrUsername, password);
  };

  return (
    <div className="min-h-screen bg-[#02051e] flex flex-col items-center justify-center p-4 sm:p-6 text-white font-sans selection:bg-[#ffea00] selection:text-[#000066]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-[#000066]/20 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md bg-[#04082c] border border-white/10 rounded-xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
        {/* Header / Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-[#ffea00] text-[#000066] font-extrabold flex items-center justify-center mx-auto text-xl shadow-lg">
            MK
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            MK Tales Admin
          </h1>
          <p className="text-xs text-slate-400">
            Content Management System · Central Control Panel
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-white ml-2 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
              Email / Username
            </label>
            <input
              type="text"
              required
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="admin or kk02042004@gmail.com"
              className="w-full px-3.5 py-2.5 bg-[#02051e] border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#ffea00] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#02051e] border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#ffea00] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#ffea00] hover:bg-[#fff033] active:bg-[#e6d200] text-[#000066] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#000066] border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Login to Admin Panel</span>
            )}
          </button>
        </form>

        {/* Credentials Assistance for Owner */}
        <div className="p-3 bg-[#02051e] border border-white/10 rounded-lg text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300 font-mono flex items-center justify-between">
            <span>Owner Quick Login:</span>
            <span className="text-[#ffea00]">Protected Access</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Pre-configured with Kishore Kumar&apos;s owner profile (<code className="text-slate-200">admin</code>). You can change this password at any time in <strong>Admin Settings</strong>.
          </p>
        </div>

        {/* Back to Public Site */}
        <div className="pt-2 text-center border-t border-white/10">
          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="text-xs text-slate-400 hover:text-[#ffea00] transition-colors cursor-pointer inline-flex items-center gap-1 font-medium"
          >
            <span>← Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
