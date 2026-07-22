import React from 'react';

/**
 * Reusable glass surface for the immersive layout: backdrop blur, 1px inset border,
 * subtle inner highlight + accent-tinted drop shadow. See REDESIGN-PLAN.md §Direction.
 */
export const GlassPanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...rest
}) => (
  <div
    className={
      'relative rounded-2xl bg-white/[0.04] backdrop-blur-xl ring-1 ring-inset ring-white/10 ' +
      'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_24px_60px_-24px_rgba(226,117,51,0.28)] ' +
      className
    }
    {...rest}
  >
    {children}
  </div>
);

export default GlassPanel;
