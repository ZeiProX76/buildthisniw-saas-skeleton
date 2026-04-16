import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { source } from '@/lib/source'
import type { ReactNode } from 'react'

export default function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{
        title: 'Docs',
        url: '/docs',
      }}
      sidebar={{
        defaultOpenLevel: 2,
      }}
    >
      <style>{`
        [data-fumadocs-sidebar] [role="separator"] {
          font-weight: 700;
          color: hsl(var(--foreground));
        }
        [data-fumadocs-sidebar] a {
          color: hsl(var(--foreground));
        }
        [data-fumadocs-sidebar] .flex.flex-col {
          gap: 1px;
        }
      `}</style>
      {children}
    </DocsLayout>
  )
}
