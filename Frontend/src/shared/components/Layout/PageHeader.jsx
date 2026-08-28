import React from 'react';

export const PageHeader = ({ tag, title, description, actions }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
      <div className="space-y-1">
        {tag && (
          <span className="text-[10px] font-black tracking-widest uppercase text-teal-800 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-900/60 px-2.5 py-0.5 rounded-md inline-block">
            {tag}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
