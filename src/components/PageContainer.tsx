import type { FC, ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-paper-shell">
      <div className="mx-auto max-w-2xl px-3 pt-3 pb-40 sm:px-4 lg:px-6 lg:pb-44">
        <div className="rounded-lg bg-paper-light px-6 py-7 shadow-card sm:px-8 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;
