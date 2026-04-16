'use client'

import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * SettingsErrorBoundary — wraps each tab's Suspense boundary.
 * Catches render errors and shows an inline recovery UI.
 */
export default class SettingsErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {this.state.error?.message || this.props.title}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
