import { useEffect } from 'react'
import Loader from '../../Common/Loading'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'

const Connected: React.FC = () => {
  const { setOpen } = useOpenfort()

  // hide on connect
  useEffect(() => {
    setTimeout(() => {
      setOpen(false)
    }, 1000)
  }, [])

  return (
    <PageContent>
      <Loader isLoading={false} isSuccess={true} header="Connected" />
    </PageContent>
  )
}

export default Connected
