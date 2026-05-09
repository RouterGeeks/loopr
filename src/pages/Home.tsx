import { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';

const Home: FC = () => {
  return (
    <PageContainer>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90 mb-3">Loopr</p>
        <h1 className="text-4xl font-bold text-charcoal leading-tight mb-3">Home</h1>
        <p className="max-w-xl text-charcoal text-opacity-70 text-base leading-7">A calm, mobile-first home where your open loops are softly presented and ready to be captured.</p>
      </div>
      <SectionCard className="space-y-4">
        <div className="rounded-3xl bg-white/80 p-5 shadow-soft border border-lavender-light/40">
          <p className="text-lg font-semibold text-charcoal">Your space to pause and reflect</p>
          <p className="text-charcoal text-opacity-75 leading-relaxed">Loopr helps you collect thoughts in a warm, focused space — no clutter, no features you don't need yet.</p>
        </div>
      </SectionCard>
    </PageContainer>
  );
};

export default Home;