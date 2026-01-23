import { PageContent } from '../PageContent'

export type PageLayoutProps = {
  children?: React.ReactNode
  width?: number | string
  header?: string
}

export const PageLayout = ({ children, width, header }: PageLayoutProps) => {
  return (
    <PageContent width={width} header={header} onBack={null}>
      {children}
    </PageContent>
  )
}
