import React from 'react';

export const SwasthyaLogo = ({ variant = 'full', className = '', height = 40, onClick, showTagline = false }) => {
  const isDark = variant === 'dark';
  const isMarkOnly = variant === 'mark' || variant === 'icon';

  // Use bright white emblem mark on dark backgrounds, color emblem mark on light backgrounds
  const emblemSrc = isDark ? '/assets/branding/swasthya-sanchar-mark-white.png' : '/assets/branding/swasthya-sanchar-mark.png';

  if (isMarkOnly) {
    return (
      <div className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>
        <img
          src={emblemSrc}
          alt="Swasthya Sanchar AI"
          style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }}
          className="transition-transform duration-200 hover:scale-105"
        />
      </div>
    );
  }

  // Calculate proportional font size based on height to ensure whole logo fits without clipping
  const textSizeClass = height >= 48 ? 'text-lg sm:text-xl' : height >= 38 ? 'text-base sm:text-lg' : 'text-sm sm:text-base';
  const taglineSizeClass = height >= 48 ? 'text-[11px]' : 'text-[9px]';
  const iconHeight = height;

  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* High-res transparent emblem mark */}
      <img
        src={emblemSrc}
        alt="Swasthya Sanchar AI Logo"
        style={{ height: `${iconHeight}px`, width: 'auto', objectFit: 'contain' }}
        className="shrink-0 transition-transform duration-200"
      />

      {/* Brand Typography Lockup */}
      <div className="flex flex-col justify-center leading-none min-w-0">
        <div className={`font-heading font-extrabold ${textSizeClass} tracking-tight flex items-center gap-1.5 shrink-0`}>
          <span className={isDark ? 'text-white font-black' : 'text-slate-900 dark:text-white'}>
            Swasthya
          </span>
          <span className={isDark ? 'text-teal-300 font-black' : 'text-teal-600 dark:text-teal-400'}>
            Sanchar
          </span>
          <span className={`text-[9px] font-black uppercase px-1 py-0.5 rounded-md shrink-0 whitespace-nowrap ${
            isDark
              ? 'bg-teal-400/20 text-teal-300 border border-teal-300/40'
              : 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-400/30'
          }`}>
            AI
          </span>
        </div>

        {showTagline && (
          <span className={`font-medium ${taglineSizeClass} ${isDark ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'} tracking-wide block mt-1`}>
            Healthcare that speaks your language
          </span>
        )}
      </div>
    </div>
  );
};

export default SwasthyaLogo;
