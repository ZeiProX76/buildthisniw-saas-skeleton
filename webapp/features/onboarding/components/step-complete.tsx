'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Completion screen shown after all onboarding steps
 * Shows a checkmark animation and auto-redirects after 1.5 seconds
 */
export function StepComplete() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/protected/home')
    }, 1500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated checkmark circle */}
      <div className="relative mb-8">
        <svg
          className="w-20 h-20 text-primary"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circle */}
          <circle
            cx="26"
            cy="26"
            r="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="animate-[draw-circle_0.6s_ease-in-out_forwards]"
            style={{
              strokeDasharray: 151,
              strokeDashoffset: 151,
              animation: 'draw-circle 0.6s ease-in-out forwards',
            }}
          />
          {/* Checkmark */}
          <path
            d="M16 27l7 7 13-13"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{
              strokeDasharray: 36,
              strokeDashoffset: 36,
              animation: 'draw-check 0.4s ease-in-out 0.4s forwards',
            }}
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-center mb-2">
        You&apos;re in!
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Loading your dashboard...
      </p>

      {/* CSS keyframes for the animation */}
      <style>{`
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}
