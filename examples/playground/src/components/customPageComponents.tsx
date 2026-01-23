import { type CustomizableRoutes, PageLayout } from '@openfort/react'

export const customPageComponents: { [key in CustomizableRoutes]?: React.ReactElement } = {
  connected: (
    <PageLayout header="Custom Connected" width={500}>
      This is a custom connected component
    </PageLayout>
  ),
}
