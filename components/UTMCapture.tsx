'use client'

import { useEffect } from 'react'
import { captureUTM } from '@/lib/utm'

/**
 * Drop this component in layout.tsx to capture UTM params on every page load
 */
export default function UTMCapture() {
  useEffect(() => {
    captureUTM()
  }, [])

  return null
}
