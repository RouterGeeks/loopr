import type { FC, ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-40 sm:px-6 lg:px-8 lg:py-10 lg:pb-44">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;