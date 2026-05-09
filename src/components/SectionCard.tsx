import type { FC, ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

const SectionCard: FC<SectionCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-[2rem] bg-cream-surface shadow-card p-6 ${className}`}>
      {children}
    </div>
  );
};

export default SectionCard;