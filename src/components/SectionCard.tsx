import { FC, ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

const SectionCard: FC<SectionCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-cream-light rounded-3xl shadow-card p-6 border border-lavender-light border-opacity-35 ${className}`}>
      {children}
    </div>
  );
};

export default SectionCard;