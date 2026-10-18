import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import FindThoughtLink from './FindThoughtLink';
import DashDotDotMark from './DashDotDotMark';

const AppHeader: FC = () => {
  const { pathname } = useLocation();
  return (
    <header className="relative mx-auto max-w-2xl px-6 pt-7 pb-4 sm:px-8 sm:pt-9">
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
      {pathname !== '/find' && <FindThoughtLink iconOnly className="absolute right-6 top-3.5 sm:right-8 sm:top-5.5" />}
    </header>
  );
};

export default AppHeader;
