/**
 * UTM Tracking for Dayryz
 * Captures UTM parameters from URL and stores in sessionStorage
 * Used to tag Stripe customers with the ad that brought them
 */

export const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export type UTMData = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  captured_at?: string
}

export function captureUTM(): void {
  if (typeof window === 'undefined') return
  
  const params = new URLSearchParams(window.location.search)
  const utmData: UTMData = {}
  let hasUTM = false

  for (const param of UTM_PARAMS) {
    const value = params.get(param)
    if (value) {
      utmData[param] = value
      hasUTM = true
    }
  }

  if (hasUTM) {
    utmData.captured_at = new Date().toISOString()
    sessionStorage.setItem('dayryz_utm', JSON.stringify(utmData))
  }
}

export function getUTM(): UTMData | null {
  if (typeof window === 'undefined') return null
  const stored = sessionStorage.getItem('dayryz_utm')
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function getUTMForStripe(): Record<string, string> {
  const utm = getUTM()
  if (!utm) return {}
  
  // Format for Stripe metadata (prefix with utm_)
  const metadata: Record<string, string> = {}
  for (const [key, value] of Object.entries(utm)) {
    if (value && key !== 'captured_at') {
      metadata[key] = value
    }
  }
  if (utm.captured_at) {
    metadata['utm_captured_at'] = utm.captured_at
  }
  return metadata
}
