import React from 'react';

export const RoleSelector = ({ selectedRole, onSelectRole }) => {
  const roles = [
    { id: 'patient', icon: '👵', title: 'Patient', desc: 'Rural resident seeking clear prescription explanations & spoken voice guidance.' },
    { id: 'healthcare_worker', icon: '👩‍⚕️', title: 'ASHA Worker', desc: 'Frontline worker assisting community patients & tracking home medication follow-ups.' },
    { id: 'doctor', icon: '👨‍⚕️', title: 'Doctor', desc: 'Healthcare provider issuing digital prescriptions & managing treatment advice.' },
    { id: 'caregiver', icon: '👨‍👩‍👧', title: 'Caregiver', desc: 'Family member supporting patient medication adherence & dose alerts.' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {roles.map((r) => (
        <div
          key={r.id}
          onClick={() => onSelectRole(r.id)}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
            selectedRole === r.id
              ? 'bg-teal-50 border-teal-700 shadow-sm'
              : 'bg-stone-50 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-3xl mb-2">{r.icon}</div>
          <div className="font-extrabold text-stone-900 text-sm mb-1">{r.title}</div>
          <div className="text-xs text-stone-600 leading-relaxed">{r.desc}</div>
        </div>
      ))}
    </div>
  );
};

export default RoleSelector;
