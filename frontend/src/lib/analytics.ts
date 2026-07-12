// Analytics wrapper — PostHog
// Set VITE_POSTHOG_KEY in frontend/.env to enable
import posthog from 'posthog-js'

const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined

if (key) {
  posthog.init(key, {
    api_host: 'https://app.posthog.com',
    capture_pageview: true,
    session_recording: { maskAllInputs: true },
  })
}

type Properties = Record<string, string | number | boolean | undefined>

export const analytics = {
  track: (event: string, props?: Properties) => {
    if (!key) return
    posthog.capture(event, props)
  },
  identify: (email: string, props?: Properties) => {
    if (!key) return
    posthog.identify(email, props)
  },
  page: () => {
    if (!key) return
    posthog.capture('$pageview')
  },
}
