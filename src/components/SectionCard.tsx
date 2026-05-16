import type { FC, ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

const SectionCard: FC<SectionCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-lg border border-rule bg-cream-surface shadow-soft p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionCard;