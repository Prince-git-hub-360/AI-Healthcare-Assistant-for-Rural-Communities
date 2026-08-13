import React from 'react';
import { AlertIcon } from '../../../shared/icons/Icons';

export const DeletePrescriptionModal = ({ isOpen, onClose, onConfirm, prescriptionTitle, dayCount = 5, doseCount = 15 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 transition-colors">

        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0">
            <AlertIcon size={22} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 block">
              Delete Prescription
            </span>
            <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white leading-tight">
              Are you sure you want to delete this prescription?
            </h3>
          </div>
        </div>

        <div className="bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 rounded-2xl p-4 text-xs space-y-2 text-stone-700 dark:text-slate-300 font-medium">
          <div className="font-bold text-stone-900 dark:text-white pb-1 border-b border-stone-200 dark:border-slate-700">
            Prescription: "{prescriptionTitle || 'Uploaded Prescription'}"
          </div>
          <p>This action will permanently remove:</p>
          <ul className="space-y-1.5 pl-4 list-disc text-stone-600 dark:text-slate-300 font-semibold">
            <li>{dayCount} treatment calendar days</li>
            <li>Associated scheduled medication doses</li>
            <li>Medication alarm schedules & voice guidance</li>
            <li>Reminder history and adherence progress</li>
          </ul>
          <p className="text-rose-600 dark:text-rose-400 text-[11px] font-bold pt-1">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-slate-300 text-xs font-bold hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md"
          >
            Delete Prescription
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeletePrescriptionModal;
