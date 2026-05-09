import { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';

const Revisit: FC = () => {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">Revisit</h1>
        <p className="text-charcoal text-opacity-60 text-sm font-medium tracking-wide">Review delayed loops</p>
      </div>
      <SectionCard>
        <p className="text-charcoal leading-relaxed">Your delayed loops will appear here when it's time to revisit them.</p>
      </SectionCard>
    </PageContainer>
  );
};

export default Revisit;