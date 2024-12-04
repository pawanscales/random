import React from 'react';
import { useRouter } from 'next/router';
import CallLayout from '@/call/CallLayout';
const CallPage = () => {
  const router = useRouter();
  const { id } = router.query; 
  return <CallLayout callName={id as string} />;
};

export default CallPage;
