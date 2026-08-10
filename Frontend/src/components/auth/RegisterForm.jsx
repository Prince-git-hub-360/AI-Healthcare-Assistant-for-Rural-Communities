import React, { useState } from 'react';
import { useAuth, LANGUAGES } from '../../shared/context/AuthContext';
import { ROUTES, navigateTo, getRoleDefaultRoute } from '../../utils/routes';

export const RegisterForm = ({ onNavigateLogin, onSuccess }) => {
  const { register, loading, showToast } = useAuth();
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    role: 'patient',
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    gender: 'M',
    preferred_language: 'hi',
    date_of_birth: '',
    age: '',
    phone_number: '',
    village_or_town: '',
    district: '',
    state: '',
    pincode: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  const selectRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setStep(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'date_of_birth' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (!isNaN(age) && age >= 0) {
          updated.age = age.toString();
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registeredUser = await register(formData);
      const userRole = registeredUser?.role || formData.role;
      const targetRoute = getRoleDefaultRoute(userRole);
      if (onSuccess) {
        onSuccess(targetRoute);
      } else {
        navigateTo(targetRoute);
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-3xl border border-stone-200 shadow-xl font-sans">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-1">
          Join Swasthya Sanchar AI
        </h2>
        <p className="text-xs text-stone-600">
          How will you use Swasthya Sanchar? Select your role to begin.
        </p>
      </div>

      {/* STEP 0: ROLE SELECTION CARDS */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => selectRole('patient')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                formData.role === 'patient'
                  ? 'bg-teal-50 border-teal-700 shadow-sm'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="text-3xl mb-2">👵</div>
              <div className="font-extrabold text-stone-900 text-sm mb-1">1. Patient</div>
              <div className="text-xs text-stone-600 leading-relaxed">
                Rural resident seeking clear prescription explanations & spoken voice guidance.
              </div>
            </div>

            <div
              onClick={() => selectRole('healthcare_worker')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                formData.role === 'healthcare_worker'
                  ? 'bg-teal-50 border-teal-700 shadow-sm'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="text-3xl mb-2">👩‍⚕️</div>
              <div className="font-extrabold text-stone-900 text-sm mb-1">2. ASHA Worker</div>
              <div className="text-xs text-stone-600 leading-relaxed">
                Frontline worker assisting community patients & tracking home medication follow-ups.
              </div>
            </div>

            <div
              onClick={() => selectRole('doctor')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                formData.role === 'doctor'
                  ? 'bg-teal-50 border-teal-700 shadow-sm'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="text-3xl mb-2">👨‍⚕️</div>
              <div className="font-extrabold text-stone-900 text-sm mb-1">3. Doctor</div>
              <div className="text-xs text-stone-600 leading-relaxed">
                Healthcare provider issuing digital prescriptions & managing treatment advice.
              </div>
            </div>

            <div
              onClick={() => selectRole('caregiver')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                formData.role === 'caregiver'
                  ? 'bg-teal-50 border-teal-700 shadow-sm'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="text-3xl mb-2">👨‍👩‍👧</div>
              <div className="font-extrabold text-stone-900 text-sm mb-1">4. Caregiver</div>
              <div className="text-xs text-stone-600 leading-relaxed">
                Family member supporting patient medication adherence & dose alerts.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full bg-[#EA580C] hover:bg-[#cc4f0b] text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer mt-2"
          >
            Continue as {formData.role === 'healthcare_worker' ? 'ASHA Worker' : formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} →
          </button>
        </div>
      )}

      {/* STEPS 1-3: FORM WIZARD */}
      {step > 0 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex border-b border-stone-200 pb-2 mb-4 justify-between text-xs font-bold text-stone-500">
            <span className={step === 1 ? 'text-teal-700 font-extrabold' : ''}>1. Credentials</span>
            <span className={step === 2 ? 'text-teal-700 font-extrabold' : ''}>2. Demographics</span>
            <span className={step === 3 ? 'text-teal-700 font-extrabold' : ''}>3. Location</span>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Username / Mobile *</label>
                <input
                  type="text"
                  name="username"
                  className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                  placeholder="e.g. ramesh_kumar or 9876543210"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                  placeholder="Strong password (min 8 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="button"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer mt-2"
                onClick={() => setStep(2)}
              >
                Next Step: Demographics →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Gender *</label>
                  <select
                    name="gender"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700 cursor-pointer"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="M">Male (पुरुष)</option>
                    <option value="F">Female (महिला)</option>
                    <option value="O">Other (अन्य)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Preferred Language *</label>
                  <select
                    name="preferred_language"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700 cursor-pointer"
                    value={formData.preferred_language}
                    onChange={handleChange}
                    required
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name} ({l.native})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Approx Age *</label>
                  <input
                    type="number"
                    name="age"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                    placeholder="e.g. 45"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Next Step: Location →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Phone Number *</label>
                <input
                  type="text"
                  name="phone_number"
                  className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                  placeholder="+91 9876543210"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Village / Town *</label>
                  <input
                    type="text"
                    name="village_or_town"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                    placeholder="e.g. Mandya"
                    value={formData.village_or_town}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">District *</label>
                  <input
                    type="text"
                    name="district"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                    placeholder="e.g. Mandya District"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                    placeholder="Karnataka"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                    placeholder="571401"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-[#EA580C] hover:bg-[#cc4f0b] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Complete Registration →'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      <div className="text-center mt-6 text-xs text-stone-600">
        Already registered?{' '}
        <button
          type="button"
          onClick={onNavigateLogin || (() => navigateTo(ROUTES.AUTH.LOGIN))}
          className="font-bold text-teal-700 hover:text-teal-800 cursor-pointer underline"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
