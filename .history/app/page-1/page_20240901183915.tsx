import dynamic from 'next/dynamic';

import AudioCall from '@/app/audiocall/page'
import CallButtons from '@/callbutton/CallButton'
import React from 'react'
const MyComponent = dynamic(() => import('../components/MyComponent'), {
  loading: () => <p>Loading...</p>,
});
export default function page() {
  return (
    <>
    <CallButtons/>
    </>
  )
}
