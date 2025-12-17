import { useEffect, useState } from 'react'
import { providersLogos } from '../../assets/logos'
import { useOpenfortCore } from '../../openfort/useOpenfort'
import { logger } from '../../utils/logger'
import Loader from '../Common/Loading'
import { routes } from '../Openfort/types'
import { useOpenfort } from '../Openfort/useOpenfort'
import { PageContent } from '../PageContent'

const states = {
  INIT: 'init',
  REDIRECT: 'redirect',
  CONNECTING: 'connecting',
  ERROR: 'error',
}

const ConnectWithOAuth: React.FC = () => {
  const { connector, setRoute, triggerResize } = useOpenfort()
  const { client, user } = useOpenfortCore()

  const [status, setStatus] = useState(states.INIT)
  const [description, setDescription] = useState<string | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      if (connector.type !== 'oauth') throw new Error('Invalid connector type')

      const url = new URL(window.location.href.replace('?access_token=', '&access_token=')) // handle both ? and & cases
      const hasProvider = !!url.searchParams.get('openfortAuthProviderUI')
      const provider = connector.id

      switch (status) {
        case states.INIT:
          if (hasProvider) setStatus(states.CONNECTING)
          else setTimeout(() => setStatus(states.REDIRECT), 150) // UX: wait a bit before redirecting
          break
        case states.CONNECTING: {
          const userId = url.searchParams.get('user_id')
          const token = url.searchParams.get('access_token')

          // Remove specified keys from the URL
          ;['openfortAuthProviderUI', 'access_token', 'user_id'].forEach((key) => {
            url.searchParams.delete(key)
          })
          window.history.replaceState({}, document.title, url.toString())

          if (!userId || !token) {
            logger.error(
              `Missing user id or access token: userId=${userId}, accessToken=${token ? `${token.substring(0, 10)}...` : token}`
            )
            return
          }

          client.auth.storeCredentials({
            token,
            userId,
          })

          setRoute(routes.LOADING)
          break
        }
        case states.REDIRECT: {
          if (hasProvider) return

          const cleanURL = window.location.origin + window.location.pathname

          const queryParams = Object.fromEntries(
            [...url.searchParams.entries()].filter(([key]) =>
              ['openfortAuthProviderUI', 'refresh_token', 'access_token', 'player_id'].includes(key)
            )
          )
          queryParams.openfortAuthProviderUI = provider

          try {
            if (user) {
              const authToken = await client.getAccessToken()
              if (!authToken) {
                logger.error('No auth token found')
                setRoute(routes.LOADING)
                return
              }
              const linkResponse = await client.auth.initLinkOAuth({
                provider,
                redirectTo: `${cleanURL}?${new URLSearchParams(queryParams).toString()}`,
              })
              logger.log(linkResponse)
              window.location.href = linkResponse
            } else {
              const r = await client.auth.initOAuth({
                provider,
                redirectTo: `${cleanURL}?${new URLSearchParams(queryParams).toString()}`,
              })
              logger.log(r)
              window.location.href = r
            }
          } catch (e) {
            logger.error('Error during OAuth initialization:', e)
            setStatus(states.ERROR)
            triggerResize()
            if (e instanceof Error) {
              if (e.message.includes('not enabled')) {
                setDescription(`The ${provider} provider is not enabled. Please contact support.`)
              } else {
                setDescription('There was an error during authentication. Please try again.')
              }
            }
          }
          break
        }
      }
    })()
  }, [status])

  return (
    <PageContent>
      <Loader
        header={`Connecting with ${connector.id}`}
        icon={providersLogos[connector.id]}
        isError={status === states.ERROR}
        description={description}
        onRetry={() => {
          setStatus(states.INIT)
          setDescription(undefined)
        }}
      />
    </PageContent>
  )
}

export default ConnectWithOAuth
