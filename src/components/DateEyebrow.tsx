import type { FC } from 'react';

const formatToday = (now: Date): string =>
  now
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase();

const DateEyebrow: FC = () => (
  <p className="font-mono text-[0.7rem] tracking-[0.15em] text-charcoal/65">
    {formatToday(new Date())}
  </p>
);

export default DateEyebrow;
