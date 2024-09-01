import dynamic from 'next/dynamic';


import React from 'react'st MyComponent = dynamic(() => import('@/callbutton/CallButton'), {oading: () => <p>Loading...</p>,
export default function page() {
  return (
    <>
    <CallButtons/>
    </>
  )
}
