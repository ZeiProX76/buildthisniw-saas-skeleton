import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/layouts/docs/page'
import { source } from '@/lib/source'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  const MDXContent = page.data.body

  return (
    <DocsPage
      toc={page.data.toc}
      breadcrumb={{ enabled: true }}
      footer={{ enabled: true }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) return {}

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
