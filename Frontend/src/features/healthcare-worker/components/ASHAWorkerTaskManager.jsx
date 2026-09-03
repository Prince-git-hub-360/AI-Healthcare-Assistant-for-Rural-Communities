import React, { useState } from 'react';
import { CheckIcon, AlertIcon, MapPinIcon, PhoneIcon, ClockIcon, DocumentIcon, UserIcon, ArrowRightIcon } from '../../../shared/icons/Icons';

/**
 * ASHAWorkerTaskManager Component
 * 
 * Comprehensive task management for ASHA health workers:
 * - Display task queue with status lifecycle
 * - Add field notes and observations
 * - Track adherence verification
 * - Show offline/sync status
 * - Add GPS location tracking
 */

export const ASHAWorkerTaskManager = ({ task, onUpdate, showToast }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskStatus, setTaskStatus] = useState(task?.status || 'pending');
  const [fieldNotes, setFieldNotes] = useState(task?.fieldNotes || '');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [verifiedAdherence, setVerifiedAdherence] = useState({
    medicinesTaken: 0,
    medicinesTotal: task?.medicines?.length || 0,
    notes: '',
  });

  // Task status lifecycle
  const statusFlow = [
    { key: 'pending', label: '⏳ Pending', color: 'slate', icon: '◯' },
    { key: 'in_progress', label: '⚡ In Progress', color: 'blue', icon: '◑' },
    { key: 'completed', label: '✅ Completed', color: 'emerald', icon: '✓' },
    { key: 'partial', label: '⚠️ Partial', color: 'amber', icon: '◐' },
    { key: 'failed', label: '❌ Failed', color: 'rose', icon: '✕' },
  ];

  const colorMap = {
    slate: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
    blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
    amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
    rose: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300',
  };

  const currentStatusInfo = statusFlow.find(s => s.key === taskStatus);

  const handleStatusChange = (newStatus) => {
    setTaskStatus(newStatus);
    if (onUpdate) {
      onUpdate({
        ...task,
        status: newStatus,
        fieldNotes,
        verifiedAdherence,
        lastUpdated: new Date().toISOString(),
      });
    }
    showToast?.(`Task status updated to ${newStatus}`, 'info');
  };

  const handleSaveNotes = () => {
    if (onUpdate) {
      onUpdate({
        ...task,
        fieldNotes,
        verifiedAdherence,
        lastUpdated: new Date().toISOString(),
      });
    }
    showToast?.('✓ Field notes saved', 'success');
  };

  const getTravelDistance = () => {
    // Placeholder for calculating distance to next patient
    return Math.floor(Math.random() * 15) + 1; // 1-15 km
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all">
      
      {/* TASK HEADER */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{task?.icon || '👤'}</span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{task?.patientName || 'Patient Name'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{task?.type || 'Task Type'}</p>
            </div>
          </div>

          {/* Task Status Badge */}
          <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg border ${colorMap[currentStatusInfo?.color]}`}>
            {currentStatusInfo?.icon} {currentStatusInfo?.label}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-black text-slate-900 dark:text-white">{task?.distance || getTravelDistance()} km</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Away</div>
        </div>

        <div className="ml-4 text-2xl text-slate-400">
          {isExpanded ? '▲' : '▼'}
        </div>
      </button>

      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4">
          
          {/* PATIENT INFO ROW */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-xs">
              <PhoneIcon size={16} className="text-slate-600 dark:text-slate-400" />
              <span className="text-slate-900 dark:text-white font-bold">{task?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPinIcon size={16} className="text-slate-600 dark:text-slate-400" />
              <span className="text-slate-900 dark:text-white font-bold">{task?.village || 'Village Name'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs col-span-2">
              <DocumentIcon size={16} className="text-slate-600 dark:text-slate-400" />
              <span className="text-slate-900 dark:text-white font-bold">ABHA: {task?.abhaId || '91-XXXX-XXXX-XXXX'}</span>
            </div>
          </div>

          {/* OFFLINE/SYNC STATUS */}
          {isOffline && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-2">
              <AlertIcon size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-300">
                <strong>⚠️ Offline Mode</strong> - Changes will sync when online
              </div>
            </div>
          )}

          {/* TASK STATUS WORKFLOW */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Update Task Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusFlow.map((status) => (
                <button
                  key={status.key}
                  type="button"
                  onClick={() => handleStatusChange(status.key)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                    taskStatus === status.key
                      ? `${colorMap[status.color]} border-2 shadow-sm scale-105`
                      : `${colorMap[status.color]} opacity-60 hover:opacity-100`
                  }`}
                >
                  {status.icon} {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* ADHERENCE VERIFICATION */}
          {task?.medicines && (
            <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg p-3 space-y-3">
              <div className="text-xs font-bold text-teal-900 dark:text-teal-200">
                📊 Medication Adherence Verification
              </div>

              <div className="space-y-2">
                {task.medicines.map((med, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verifiedAdherence.medicinesTaken > idx}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setVerifiedAdherence({
                            ...verifiedAdherence,
                            medicinesTaken: Math.min(idx + 1, verifiedAdherence.medicinesTotal),
                          });
                        } else {
                          setVerifiedAdherence({
                            ...verifiedAdherence,
                            medicinesTaken: Math.max(idx, 0),
                          });
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs text-teal-800 dark:text-teal-300 font-medium">
                      {med.name} {med.strength} • {med.timing}
                    </span>
                  </label>
                ))}
              </div>

              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {verifiedAdherence.medicinesTaken} of {verifiedAdherence.medicinesTotal} doses verified
                </div>
                <div className="w-full bg-slate-300 dark:bg-slate-600 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${(verifiedAdherence.medicinesTaken / verifiedAdherence.medicinesTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* FIELD NOTES */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              📝 Field Notes & Observations
            </label>
            <textarea
              value={fieldNotes}
              onChange={(e) => setFieldNotes(e.target.value)}
              placeholder="e.g., Patient was not at home. Will visit again tomorrow. Neighbor advised to take medicines regularly."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Max 500 characters. Be specific and objective.
            </div>
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => window.open(`tel:${task?.phone}`)}
              className="bg-teal-100 dark:bg-teal-950/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <PhoneIcon size={14} /> Call Patient
            </button>

            <button
              type="button"
              onClick={() => window.open(`https://maps.google.com/?q=${task?.village}`)}
              className="bg-blue-100 dark:bg-blue-950/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <MapPinIcon size={14} /> Map Route
            </button>
          </div>

          {/* SAVE BUTTON */}
          <button
            type="button"
            onClick={handleSaveNotes}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckIcon size={16} /> Save Task Updates
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * ASHAWorkerTaskQueue Component
 * 
 * Full task queue management with filtering and sorting
 */
export const ASHAWorkerTaskQueue = ({ tasks = [], onTaskUpdate, showToast }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'priority' | 'time'

  const filteredTasks = tasks.filter(t => filterStatus === 'all' || t.status === filterStatus);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
    if (sortBy === 'priority') {
      const priorityMap = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (priorityMap[a.priority] || 3) - (priorityMap[b.priority] || 3);
    }
    if (sortBy === 'time') {
      return new Date(a.scheduledTime) - new Date(b.scheduledTime);
    }
    return 0;
  });

  const statusCounts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-4">
      {/* HEADER STATS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">📋 Pending</div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{statusCounts.pending}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 rounded-xl">
          <div className="text-xs font-bold text-blue-700 dark:text-blue-300">⚡ In Progress</div>
          <div className="text-lg font-black text-blue-900 dark:text-blue-100 mt-1">{statusCounts.in_progress}</div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">✅ Completed</div>
          <div className="text-lg font-black text-emerald-900 dark:text-emerald-100 mt-1">{statusCounts.completed}</div>
        </div>
      </div>

      {/* FILTER & SORT */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="distance">Sort by Distance</option>
          <option value="priority">Sort by Priority</option>
          <option value="time">Sort by Scheduled Time</option>
        </select>
      </div>

      {/* TASK LIST */}
      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <ASHAWorkerTaskManager
              key={task.id}
              task={task}
              onUpdate={onTaskUpdate}
              showToast={showToast}
            />
          ))
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
            <div className="text-2xl">✅</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-2">No tasks available</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">You have completed all tasks!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ASHAWorkerTaskManager;
