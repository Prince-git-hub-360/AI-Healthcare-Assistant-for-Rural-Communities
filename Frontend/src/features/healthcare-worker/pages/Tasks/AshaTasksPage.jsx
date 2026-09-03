import React, { useState } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { GovtHeaderBanner } from '../../../../components/layout/GovtHeaderBanner';
import { ASHAWorkerTaskQueue } from '../../components/ASHAWorkerTaskManager';
import { 
  CheckIcon, SpeakerIcon, ClockIcon, DocumentIcon, PhoneIcon,
  SparklesIcon, UserIcon, HeartIcon, ActivityIcon, ArrowRightIcon
} from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';

export const AshaTasksPage = ({ setCurrentView }) => {
  const { user, showToast } = useAuth();
  const [useAdvancedTaskManager, setUseAdvancedTaskManager] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // Doctor-Assigned Tasks
  const [assignedTasks, setAssignedTasks] = useState([
    {
      id: 'TASK-501',
      patientName: 'Gopal Gowda',
      age: 64,
      gender: 'Male',
      phone: '+91 98765 00444',
      village: 'Mandya Sector 3',
      sector: 'Sector 3 - Farmland Belt',
      distance: '1.2 km Away',
      doctor: 'Dr. Vikram Sharma, MBBS',
      phcName: 'Mandya PHC #2',
      taskType: 'Doctor Approved Rx Delivery',
      actionNeeded: 'Deliver Jan Aushadhi Amlodipine 5mg & play bedtime dosage audio instructions.',
      audioTextKn: 'ಗೋಪಾಲ್ ಅವರೇ, ಡಾ. ವಿಕ್ರಮ್ ಅವರು ನಿಮ್ಮ ರಕ್ತದೊತ್ತಡ ಮಾತ್ರೆ ಅನುಮೋದಿಸಿದ್ದಾರೆ. ಪ್ರತಿದಿನ ರಾತ್ರಿ ಮಲಗುವ ಮುನ್ನ 1 ಮಾತ್ರೆ ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ.',
      priority: 'high',
      status: 'pending',
      prescribedMeds: ['Amlodipine 5mg (Jan Aushadhi)', 'Metformin 500mg'],
    },
    {
      id: 'TASK-502',
      patientName: 'Sunita Bai',
      age: 27,
      gender: 'Female',
      phone: '+91 98765 00333',
      village: 'Mandya Sector 1',
      sector: 'Sector 1 - North Colony',
      distance: '0.8 km Away',
      doctor: 'Dr. Anita Desai, MD (OB-GYN)',
      phcName: 'Mandya CHC Maternity Wing',
      taskType: '3rd Trimester ANC Checkup',
      actionNeeded: 'Verify daily intake of Red Iron IFA tablet and Calcium 500mg. Check for ankle swelling.',
      audioTextKn: 'ಸುನೀತಾ ಅವರೇ, ಮಧ್ಯಾಹ್ನ ಊಟದ ನಂತರ 1 ಕೆಂಪು ಕಬ್ಬಿಣದ ಮಾತ್ರೆ ಮತ್ತು ಬೆಳಿಗ್ಗೆ 1 ಕ್ಯಾಲ್ಸಿಯಂ ಮಾತ್ರೆ ತಪ್ಪದೇ ಸೇವಿಸಿ.',
      priority: 'critical',
      status: 'pending',
      prescribedMeds: ['IFA Red Tablets (100mg Iron)', 'Calcium Carbonate 500mg'],
    },
    {
      id: 'TASK-503',
      patientName: 'Savithri Devi',
      age: 48,
      gender: 'Female',
      phone: '+91 98765 00222',
      village: 'Mandya Sector 2',
      sector: 'Sector 2 - Market Area',
      distance: '2.1 km Away',
      doctor: 'Dr. Vikram Sharma, MBBS',
      phcName: 'Mandya PHC #2',
      taskType: 'Stage-2 Hypertension Follow-up',
      actionNeeded: 'Record home blood pressure reading after dizzy spell and verify low-salt diet.',
      audioTextKn: 'ಲಕ್ಷ್ಮೀ ಅಮ್ಮಾ, ತಲೆಸುತ್ತು ಕಡಿಮೆಯಾಗುವವರೆಗೆ ಉಪ್ಪು ಕಡಿಮೆ ಮಾಡಿ. ಬೆಳಿಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಮಾತ್ರೆಯನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.',
      priority: 'critical',
      status: 'pending',
      prescribedMeds: ['Telmisartan 40mg', 'Amlodipine 5mg'],
    }
  ]);

  const playTaskAudio = async (taskId, audioText) => {
    setPlayingAudioId(taskId);
    await speakNativeAudio(audioText, 'kn');
    setPlayingAudioId(null);
  };

  const handleCompleteTask = (taskId, patientName) => {
    setAssignedTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
    if (showToast) showToast(`✅ Home visit for ${patientName} marked completed!`, 'success');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* DOCTOR SUPERVISION ENDORSEMENT BANNER */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">👨‍⚕️ ➔ 👩‍⚕️</span>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                PHC Doctor Task Queue &amp; Doorstep Deliveries
              </h2>
              <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                {assignedTasks.filter(t => t.status === 'pending').length} Actions Due
              </span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
              Prescriptions digitally approved by <strong>Dr. Vikram Sharma (Mandya PHC #2)</strong> requiring doorstep verification &amp; audio counseling
            </p>
          </div>

          <button
            type="button"
            onClick={() => setUseAdvancedTaskManager(!useAdvancedTaskManager)}
            className="text-xs font-bold text-[#0B3B74] dark:text-sky-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
          >
            {useAdvancedTaskManager ? '🗂️ Grid View' : '⚡ Advanced Interactive Queue'}
          </button>
        </div>

        {/* TASK QUEUE CONTAINER */}
        {useAdvancedTaskManager ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
            <ASHAWorkerTaskQueue
              tasks={assignedTasks}
              onTaskUpdate={(updatedTask) => {
                setAssignedTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
              }}
              showToast={showToast}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedTasks.map((task) => (
              <div 
                key={task.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <span>✓ Doctor Verified</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      📍 {task.distance}
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {task.patientName} ({task.age}y • {task.gender})
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      📱 {task.phone} • {task.village}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {task.actionNeeded}
                  </p>

                  {task.prescribedMeds && (
                    <div className="text-[11px] font-bold text-[#0B3B74] dark:text-sky-400">
                      💊 {task.prescribedMeds.join(', ')}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {task.audioTextKn && (
                    <button
                      type="button"
                      onClick={() => playTaskAudio(task.id, task.audioTextKn)}
                      className="w-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-[#0B3B74] dark:text-sky-300 border border-blue-200 dark:border-blue-800 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <SpeakerIcon size={14} />
                      <span>{playingAudioId === task.id ? '🔊 Playing Regional Voice...' : '🔊 Play Kannada Audio for Patient'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCompleteTask(task.id, task.patientName)}
                    className={`w-full py-2.5 rounded-xl text-xs font-black transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      task.status === 'completed'
                        ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                    disabled={task.status === 'completed'}
                  >
                    <CheckIcon size={14} color="#fff" />
                    <span>{task.status === 'completed' ? '✓ Home Visit Completed' : 'Mark Home Visit Done'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

    </div>
  );
};

export default AshaTasksPage;
