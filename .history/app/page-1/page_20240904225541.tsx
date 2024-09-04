import dynamic from 'next/dynamic';
import React from 'react';

const CallButtons = dynamic(() => import('@/callbutton/CallButton'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const Page: React.FC = () => {
  return <CallButtons />;
};

export default Page;
