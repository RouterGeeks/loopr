import { FC, ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

const SectionCard: FC<SectionCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-cream-light rounded-2xl shadow-card p-6 border border-lavender-light border-opacity-30 ${className}`}>
      {children}
    </div>
  );
};

export default SectionCard;