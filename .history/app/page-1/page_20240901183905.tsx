import dynamic from 'next/dynamic';

import AudioCall from '@/app/audiocall/page'
import CallButtons from '@/callbutton/CallButton'
import React from 'react'

export default function page() {
  return (
    <>
    <CallButtons/>
    </>
  )
}
