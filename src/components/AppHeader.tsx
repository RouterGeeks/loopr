import type { FC } from 'react';
import DashDotDotMark from './DashDotDotMark';

const AppHeader: FC = () => {
  return (
    <header className="mx-auto max-w-2xl px-6 pt-7 pb-4 sm:px-8 sm:pt-9">
      <DashDotDotMark className="mb-2 h-4 w-16 text-charcoal" />
      <p className="font-serif text-3xl italic leading-none tracking-tight text-charcoal sm:text-4xl">
        Dash Dot Dot
      </p>
      <p className="mt-2 text-sm text-charcoal/70">
        a quiet place for{' '}
        <span className="underline decoration-charcoal/60 underline-offset-4">
          your
        </span>{' '}
        thoughts.
      </p>
    </header>
  );
};

export default AppHeader;
