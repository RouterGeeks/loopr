import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';

const Revisit: FC = () => {
  return (
    <PageContainer>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90 mb-3">Loopr</p>
        <h1 className="text-4xl font-bold text-charcoal leading-tight mb-3">Revisit</h1>
        <p className="max-w-xl text-charcoal text-opacity-70 text-base leading-7">A quiet place to look back on loops that need a second look later.</p>
      </div>
      <SectionCard className="space-y-4">
        <div className="rounded-3xl bg-white/80 p-5 shadow-soft border border-lavender-light/40">
          <p className="text-lg font-semibold text-charcoal">Ready when you are</p>
          <p className="text-charcoal text-opacity-75 leading-relaxed">This view is designed to feel calm and gentle, so you can revisit your notes without pressure.</p>
        </div>
      </SectionCard>
    </PageContainer>
  );
};

export default Revisit;