// pages/call/[id].tsx (or a page that uses the CallLayout component)
import React from 'react';
import { useRouter } from 'next/router';
import CallLayout from '@/call/CallLayout';
const CallPage = () => {
  const router = useRouter();
  const { id } = router.query; // Example of how you can access router params

  return <CallLayout callName={id as string} />;
};

export default CallPage;
