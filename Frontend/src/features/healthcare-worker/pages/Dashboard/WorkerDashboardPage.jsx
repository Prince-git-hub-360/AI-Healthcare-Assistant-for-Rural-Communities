import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import { PlusIcon, PhoneIcon } from '../../../../shared/icons/Icons';

export const WorkerDashboardPage = ({ setCurrentView }) => {
  const { user, showToast } = useAuth();
  const [fieldPatients, setFieldPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    village_or_town: '',
    district: '',
    preferred_language: 'hi',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const patientsData = await api.getHealthcareWorkerPatients();
      let list = Array.isArray(patientsData) ? patientsData : patientsData?.results || [];
      if (list.length === 0) {
        list = [
          { id: 1, first_name: 'Ramesh', last_name: 'Kumar', village_or_town: 'Mandya', preferred_language: 'kn', adherence_rate: '95%', phone_number: '+91 98765 00111' },
          { id: 2, first_name: 'Lakshmi', last_name: 'Amma', village_or_town: 'Mandya Sector 2', preferred_language: 'kn', adherence_rate: '91%', phone_number: '+91 98765 00222' },
          { id: 3, first_name: 'Gopal', last_name: 'Gowda', village_or_town: 'Hassan Rural', preferred_language: 'kn', adherence_rate: '82%', phone_number: '+91 98765 00333' },
        ];
      }
      setFieldPatients(list);
    } catch (err) {
      setFieldPatients([
        { id: 1, first_name: 'Ramesh', last_name: 'Kumar', village_or_town: 'Mandya', preferred_language: 'kn', adherence_rate: '95%', phone_number: '+91 98765 00111' },
        { id: 2, first_name: 'Lakshmi', last_name: 'Amma', village_or_town: 'Mandya Sector 2', preferred_language: 'kn', adherence_rate: '91%', phone_number: '+91 98765 00222' },
        { id: 3, first_name: 'Gopal', last_name: 'Gowda', village_or_town: 'Hassan Rural', preferred_language: 'kn', adherence_rate: '82%', phone_number: '+91 98765 00333' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    try {
      await api.registerFieldPatient(newPatient);
      if (showToast) showToast('Field patient registered successfully!', 'success');
      setShowAddPatientModal(false);
      loadData();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to register patient.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 text-stone-900 dark:text-slate-100 transition-colors">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-teal-900 via-teal-800 to-[#0f2d4a] text-white border border-teal-700/50 rounded-3xl p-6 md:p-8 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold bg-teal-600/60 border border-teal-400/40 text-teal-200 uppercase tracking-widest px-2.5 py-0.5 rounded-full">
              ASHA & PHC DOCTOR PORTAL
            </span>
            <span className="bg-amber-400 text-stone-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
              VILLAGE CATCHMENT AREA #4
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Community Healthcare Operations Hub
          </h1>
          <p className="text-xs text-teal-100/90 mt-1">
            Logged in: <strong className="text-white">{user?.first_name} {user?.last_name}</strong> • PHC Facility: <strong className="text-white">{user?.profile?.organization || 'Mandya Primary Health Center'}</strong>
          </p>
        </div>

        <button
          onClick={() => setShowAddPatientModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusIcon size={16} /> Register Village Household Patient
        </button>
      </div>

      {/* Triage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs transition-colors">
          <span className="text-[10px] font-extrabold text-stone-400 dark:text-slate-400 uppercase tracking-wider block mb-1">Catchment Population</span>
          <div className="text-3xl font-extrabold text-teal-800 dark:text-teal-300">{fieldPatients.length || 42}</div>
          <div className="text-xs font-semibold text-stone-600 dark:text-slate-300 mt-1">Registered Village Patients</div>
        </div>

        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-5 rounded-3xl shadow-xs transition-colors">
          <span className="text-[10px] font-extrabold text-red-700 dark:text-red-300 uppercase tracking-wider block mb-1">High-Risk Alerts</span>
          <div className="text-3xl font-extrabold text-red-600 dark:text-red-400">3</div>
          <div className="text-xs font-bold text-red-900 dark:text-red-200 mt-1">Require Home Visit Today 🏠</div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-5 rounded-3xl shadow-xs transition-colors">
          <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block mb-1">Pending Follow-ups</span>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">6</div>
          <div className="text-xs font-semibold text-amber-900 dark:text-amber-200 mt-1">Prescription Renewals Due</div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-5 rounded-3xl shadow-xs transition-colors">
          <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mb-1">2G IVR Adherence</span>
          <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">94.2%</div>
          <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 mt-1">Automated Call Success</div>
        </div>
      </div>

      {/* Patient Roster */}
      <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-stone-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Gram Panchayat Patient Roster & Triage
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400">Sorted by Risk Status • Filtered for ASHA Worker Catchment Area</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 dark:text-slate-300">Filter Village:</span>
            <select className="bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white text-xs rounded-xl px-3 py-1.5 outline-none font-semibold">
              <option value="all">All Villages (Gram Panchayat #4)</option>
              <option value="mandya">Mandya Village (24 Patients)</option>
              <option value="hassan">Hassan Rural (18 Patients)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 font-extrabold uppercase">
                <th className="pb-3 px-3">Patient Details</th>
                <th className="pb-3 px-3">Village / Zone</th>
                <th className="pb-3 px-3">Language</th>
                <th className="pb-3 px-3">Adherence Risk</th>
                <th className="pb-3 px-3">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
              <tr className="bg-red-50/50 dark:bg-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="font-extrabold text-stone-900 dark:text-white text-sm">Sunita Devi</div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400">+91 98765 43210 (2G Phone)</div>
                </td>
                <td className="py-3.5 px-3 font-semibold text-stone-700 dark:text-slate-300">Mandya Sector 2</td>
                <td className="py-3.5 px-3 font-bold uppercase text-teal-800 dark:text-teal-300">Hindi (hi)</td>
                <td className="py-3.5 px-3">
                  <span className="bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-red-300 dark:border-red-800">
                    🔴 45% Missed 2 Doses
                  </span>
                </td>
                <td className="py-3.5 px-3 space-x-2">
                  <button
                    onClick={() => setCurrentView('translate')}
                    className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] cursor-pointer"
                  >
                    📸 Scan Rx Note
                  </button>
                  <button
                    onClick={() => showToast?.('Door-to-Door ASHA Visit logged for Sunita Devi!', 'success')}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] cursor-pointer"
                  >
                    🏠 Log Home Visit
                  </button>
                </td>
              </tr>

              {fieldPatients.map((p, idx) => (
                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-stone-900 dark:text-white">{p.first_name} {p.last_name}</div>
                    <div className="text-[11px] text-stone-500 dark:text-slate-400">{p.phone_number || '+91 9876500111'}</div>
                  </td>
                  <td className="py-3.5 px-3 text-stone-600 dark:text-slate-300 font-medium">{p.village_or_town || 'Mandya'}</td>
                  <td className="py-3.5 px-3 text-stone-600 dark:text-slate-300 uppercase font-semibold">{p.preferred_language || 'kn'}</td>
                  <td className="py-3.5 px-3">
                    <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      🟢 95% High Adherence
                    </span>
                  </td>
                  <td className="py-3.5 px-3 space-x-2">
                    <button
                      onClick={() => setCurrentView('medical_vault')}
                      className="bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-300 font-bold px-3 py-1.5 rounded-xl border border-teal-200 dark:border-slate-700 text-[11px] cursor-pointer transition-colors"
                    >
                      Upload Rx
                    </button>
                    <button
                      onClick={() => showToast?.(`Sending 2G IVR Call Alert to ${p.first_name}...`, 'info')}
                      className="bg-slate-900 dark:bg-teal-900/60 hover:bg-slate-800 text-teal-300 font-bold px-3 py-1.5 rounded-xl text-[11px] cursor-pointer transition-colors"
                    >
                      📞 2G IVR Call
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full relative shadow-2xl transition-colors">
            <button
              onClick={() => setShowAddPatientModal(false)}
              className="absolute top-4 right-4 text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-extrabold text-stone-900 dark:text-white mb-4">Register Field Patient</h3>

            <form onSubmit={handleRegisterPatient} className="space-y-3">
              <input
                type="text"
                placeholder="First Name *"
                className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-teal-700"
                value={newPatient.first_name}
                onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Last Name *"
                className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-teal-700"
                value={newPatient.last_name}
                onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Mobile Phone Number *"
                className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-teal-700"
                value={newPatient.phone_number}
                onChange={(e) => setNewPatient({ ...newPatient, phone_number: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Village / Town *"
                className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-teal-700"
                value={newPatient.village_or_town}
                onChange={(e) => setNewPatient({ ...newPatient, village_or_town: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="District *"
                className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-teal-700"
                value={newPatient.district}
                onChange={(e) => setNewPatient({ ...newPatient, district: e.target.value })}
                required
              />

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer mt-2"
              >
                Register Field Patient →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboardPage;
