import { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';

const Home: FC = () => {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">Home</h1>
        <p className="text-charcoal text-opacity-60 text-sm font-medium tracking-wide">Capture your thoughts</p>
      </div>
      <SectionCard>
        <p className="text-charcoal leading-relaxed">Welcome to Loopr. This is where you'll capture your open loops and decide what to do with them.</p>
      </SectionCard>
    </PageContainer>
  );
};

export default Home;