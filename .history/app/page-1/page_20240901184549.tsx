import dynamic from 'next/dynamic';


import React from 'react'
import CallButtons from '@/callbutton/CallButton';
const CallButtons = dynamic(() => import('@/callbutton/CallButton'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Optional: Disable server-side rendering
});
export default function page() {
  return (
    <>
    <CallButtons/>
    </>
  )
}
