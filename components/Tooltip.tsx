import React from 'react';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  if (!text) return null;

  return (
    <div
      role="tooltip"
      className={`absolute ${positionClasses[position]} w-max whitespace-nowrap px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white dark:text-slate-100 text-xs font-semibold rounded-md shadow-lg
                 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none z-50`}
    >
      {text}
    </div>
  );
};

export default Tooltip;
