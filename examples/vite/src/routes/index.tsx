import { Theme } from '@openfort/openfort-kit'
import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { Variable } from '../components/Variable/Variable'
import { useAppStore } from '../lib/useAppStore'

// import { ProjectParser } from 'typedoc-json-parser'
// import rawJson from "./../generated/types.json";


// const projectParser = new ProjectParser({
//   data: JSON.parse(JSON.stringify(rawJson.children)),
//   dependencies: {

//   }
// });


export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { providerOptions, setProviderOptions } = useAppStore()

  return (
    <Layout>
      {/* {projectParser} */}
      {/* <pre>
        {JSON.stringify(rawJson, null, 2)}
      </pre> */}

      <Variable
        name="providerOptions"
        values={providerOptions}
        defaultExpanded={10}

        variables={{
          mode: {
            type: 'select',
            typescriptType: "'auto' | 'dark' | 'light' | undefined",
            description: 'The theme mode of the OpenfortKit provider. By default, it will use the system preference.',
            options: ['undefined', 'auto', 'dark', 'light'],
            onEdit: (value) => {
              setProviderOptions({
                ...providerOptions,
                uiConfig:{
                  ...providerOptions.uiConfig,
                  mode: (value ?? 'auto') as 'auto' | 'dark' | 'light',
                }
              })
            }
          },
          customTheme: {
            description: `Custom theme for the OpenfortKit components. This field is optional. For example "customTheme: { '--ck-font-family': 'monospace' }"`,
          },
          theme: {
            type: 'select',
            options: ["auto", "web95", "retro", "soft", "midnight", "minimal", "rounded", "nouns"],
            description: 'The theme to use for the OpenfortKit components. This field is optional.',
            onEdit: (value) => {
              console.log('Setting theme to:', value)
              setProviderOptions({
                ...providerOptions,
                uiConfig: {
                  ...providerOptions.uiConfig,
                  theme: value as Theme,
                }
              })
            }
          },
          publishableKey: {
            description: 'The publishable key of your OpenfortKit account. This field is required.',
            onEdit: (value) => {
              setProviderOptions({
                ...providerOptions,
                publishableKey: value as string,
              })
            },
          },
          debugMode: {
            description: 'Enable or disable debug mode. When enabled, additional debugging information will be logged to the console.',
            onEdit: (value) => {
              setProviderOptions({
                ...providerOptions,
                debugMode: value as boolean,
              })
            },
            type: "boolean",
          },
          uiConfig: {
            description: 'The configuration for the OpenfortKit UI components. This field is optional.',
          },
          walletConfig: {
            description: 'The configuration for the OpenfortKit wallet components. If not set, users will need to connect their web3 wallets.',
          },
        }}
      />
    </Layout>
  )
}