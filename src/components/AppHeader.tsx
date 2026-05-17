import type { FC } from 'react';

const AppHeader: FC = () => {
  return (
    <header className="mx-auto max-w-2xl px-6 pt-7 pb-4 sm:px-8 sm:pt-9">
      <p className="font-serif text-3xl italic leading-none tracking-tight text-charcoal sm:text-4xl">
        loopr
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
