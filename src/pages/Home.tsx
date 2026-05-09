import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <div className="bg-white rounded-lg shadow-soft p-4">
        <p>Welcome to Loopr. Capture your open loops here.</p>
      </div>
    </div>
  );
};

export default Home;