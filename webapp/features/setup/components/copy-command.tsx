'use client'

import { useState, useCallback } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CopyCommand({
  code,
  language = 'bash',
}: {
  code: string
  language?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="group relative rounded-lg border bg-muted/30 overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="absolute right-2 top-2 size-7 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        {copied ? (
          <Check className="size-3.5 text-success" />
        ) : (
          <Copy className="size-3.5 text-muted-foreground" />
        )}
      </Button>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-foreground/80">
        <code data-language={language}>{code}</code>
      </pre>
    </div>
  )
}
