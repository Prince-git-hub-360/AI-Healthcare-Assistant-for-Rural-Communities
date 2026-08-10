import React, { useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { ROUTES, navigateTo, getRoleDefaultRoute } from '../../utils/routes';

export const LoginForm = ({ onNavigateRegister, onSuccess }) => {
  const { login, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    try {
      const userData = await login(username, password, selectedRole);
      const userRole = userData?.role || selectedRole;
      const targetRoute = getRoleDefaultRoute(userRole);
      if (onSuccess) {
        onSuccess(targetRoute);
      } else {
        navigateTo(targetRoute);
      }
    } catch {
      // Toast notification handles errors
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-3xl border border-stone-200 shadow-xl font-sans">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-1">Swasthya Sanchar AI</h2>
        <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-3">Welcome Back</p>
        <p className="text-xs text-stone-600">Access your rural healthcare communication portal</p>
      </div>

      {/* ROLE SELECTOR TABS */}
      <div className="grid grid-cols-3 gap-2 bg-stone-100 p-1.5 rounded-2xl mb-6 border border-stone-200">
        <button
          type="button"
          onClick={() => setSelectedRole('patient')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'patient'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          👵 Patient
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('healthcare_worker')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'healthcare_worker'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          👩‍⚕️ Doctor / ASHA
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('caregiver')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedRole === 'caregiver'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          👨‍👩‍👧 Caregiver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Username / Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full bg-white border border-stone-300 text-stone-900 text-sm rounded-xl px-4 py-3 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 outline-none transition-all shadow-xs"
            placeholder={selectedRole === 'healthcare_worker' ? 'e.g. dr_anita_verma' : 'e.g. rural_patient_test'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-stone-800">
              Password <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full bg-white border border-stone-300 text-stone-900 text-sm rounded-xl px-4 py-3 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 outline-none transition-all shadow-xs"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#EA580C] hover:bg-[#cc4f0b] text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? 'Authenticating...' : 'Sign In →'}
        </button>
      </form>

      <div className="text-center mt-6 text-xs text-stone-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onNavigateRegister || (() => navigateTo(ROUTES.AUTH.REGISTER))}
          className="font-bold text-teal-700 hover:text-teal-800 cursor-pointer underline"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
