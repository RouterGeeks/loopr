import { FC, ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

const SectionCard: FC<SectionCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-[2rem] bg-cream-surface shadow-card p-6 border border-lavender-soft/40 ${className}`}>
      <div className="rounded-[1.75rem] bg-white/90 p-5 shadow-soft ring-1 ring-lavender-light/30">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;