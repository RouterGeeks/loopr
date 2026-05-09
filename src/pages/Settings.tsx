import { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';

const Settings: FC = () => {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">Settings</h1>
        <p className="text-charcoal text-opacity-60 text-sm font-medium tracking-wide">Customize your experience</p>
      </div>
      <SectionCard>
        <p className="text-charcoal leading-relaxed">Settings and preferences for your Loopr experience will be available here.</p>
      </SectionCard>
    </PageContainer>
  );
};

export default Settings;