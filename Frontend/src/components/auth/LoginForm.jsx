import React, { useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { ROUTES, navigateTo, getRoleDefaultRoute } from '../../utils/routes';

export const LoginForm = ({ onNavigateRegister, onSuccess }) => {
  const { login, loading, showToast } = useAuth();
  const [selectedRole, setSelectedRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setAuthError(null);

    try {
      const userData = await login(username, password, selectedRole);
      const userRole = userData?.role || selectedRole;
      const targetRoute = getRoleDefaultRoute(userRole);
      if (onSuccess) {
        onSuccess(targetRoute);
      } else {
        navigateTo(targetRoute);
      }
    } catch (err) {
      const code = err.errorCode || 'GENERIC_ERROR';
      const message = err.message || 'Login failed. Please check your credentials.';
      setAuthError({ code, message });
    }
  };

  const handleUsernameChange = (val) => {
    setUsername(val);
    if (authError) setAuthError(null);
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (authError) setAuthError(null);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (authError) setAuthError(null);
  };

  const handleForgotPassword = () => {
    showToast(
      'To reset your password, please contact your local Healthcare Center or ASHA worker, or re-register your phone number.',
      'info'
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-[#161F30] p-6 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl font-sans transition-colors">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-1">Swasthya Sanchar AI</h2>
        <p className="text-xs font-semibold text-[#0F766E] dark:text-teal-300 uppercase tracking-wider mb-3">Welcome Back</p>
        <p className="text-xs text-stone-600 dark:text-slate-300">Access your rural healthcare communication portal</p>
      </div>

      {/* ROLE SELECTOR TABS */}
      <div className="grid grid-cols-3 gap-2 bg-stone-100 dark:bg-slate-900 p-1.5 rounded-2xl mb-6 border border-stone-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => handleRoleSelect('patient')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'patient'
              ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800'
          }`}
        >
          👵 Patient
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('healthcare_worker')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'healthcare_worker'
              ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800'
          }`}
        >
          👩‍⚕️ Doctor / ASHA
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('caregiver')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'caregiver'
              ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800'
          }`}
        >
          👨‍👩‍👧 Caregiver
        </button>
      </div>

      {/* USER NOT FOUND BANNER */}
      {authError?.code === 'USER_NOT_FOUND' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 p-4 rounded-2xl mb-5 text-xs font-sans text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <span className="text-lg">👤❓</span>
            <div className="flex-1">
              <p className="font-extrabold text-amber-950 dark:text-amber-100 text-sm mb-1">User Account Not Found</p>
              <p className="text-amber-800 dark:text-amber-300 mb-3 leading-relaxed">{authError.message}</p>
              <button
                type="button"
                onClick={onNavigateRegister || (() => navigateTo(ROUTES.AUTH.REGISTER))}
                className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                📝 Register Account Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERIC ERROR BANNER */}
      {authError?.code && authError.code !== 'USER_NOT_FOUND' && authError.code !== 'INVALID_PASSWORD' && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 p-3.5 rounded-2xl mb-5 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <span>⚠️</span>
          <span>{authError.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-800 dark:text-slate-200 mb-1.5">
            Username / Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full bg-white dark:bg-slate-800 border text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 text-sm rounded-xl px-4 py-3 outline-none transition-all shadow-xs ${
              authError?.code === 'USER_NOT_FOUND'
                ? 'border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                : 'border-stone-300 dark:border-slate-700 focus:border-[#0F766E] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F766E]/20'
            }`}
            placeholder={selectedRole === 'healthcare_worker' ? 'e.g. dr_anita_verma' : 'e.g. rural_patient_test'}
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-stone-800 dark:text-slate-200">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              {authError?.code === 'INVALID_PASSWORD' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-bold text-[#0F766E] dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            className={`w-full bg-white dark:bg-slate-800 border text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 text-sm rounded-xl px-4 py-3 outline-none transition-all shadow-xs ${
              authError?.code === 'INVALID_PASSWORD'
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-stone-300 dark:border-slate-700 focus:border-[#0F766E] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F766E]/20'
            }`}
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />
          {authError?.code === 'INVALID_PASSWORD' && (
            <div className="mt-2 flex items-center justify-between text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-800/50">
              <span className="flex items-center gap-1.5">
                🔒 <strong>Incorrect password.</strong> Please try again.
              </span>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-bold underline text-red-700 dark:text-red-300 hover:text-red-900 cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? 'Authenticating...' : 'Sign In →'}
        </button>
      </form>

      <div className="text-center mt-6 text-xs text-stone-600 dark:text-slate-400">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onNavigateRegister || (() => navigateTo(ROUTES.AUTH.REGISTER))}
          className="font-bold text-[#0F766E] dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 cursor-pointer underline"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

