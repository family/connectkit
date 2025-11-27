import type React from 'react'
import { useEffect, useState } from 'react'
import { KeyIcon } from '../../../assets/icons'
import { useWallets } from '../../../hooks/openfort/useWallets'
import Button from '../../Common/Button'
import { CopyText } from '../../Common/CopyToClipboard/CopyText'
import { ModalBody, ModalContent, ModalHeading } from '../../Common/Modal/styles'
import { FloatingGraphic } from '../../FloatingGraphic'
import { PageContent } from '../../PageContent'

// TODO: Localize

const ExportKey: React.FC = () => {
  const { exportPrivateKey } = useWallets()

  const [exportedKey, setExportedKey] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [showExportedKey, setShowExportedKey] = useState(false)

  useEffect(() => {
    const asyncExportKey = async () => {
      try {
        const key = await exportPrivateKey()
        setExportedKey(key)
      } catch {
        setExportError('You cannot export the private key for this wallet.')
        setExportedKey(null)
      }
    }
    asyncExportKey()
  }, [])

  return (
    <PageContent>
      <ModalHeading>Export private key</ModalHeading>
      <FloatingGraphic
        height="110px"
        logoCenter={{
          logo: <KeyIcon />,
        }}
        logoTopLeft={{
          logo: <KeyIcon />,
        }}
        logoBottomRight={{
          logo: <KeyIcon />,
        }}
        logoTopRight={{
          logo: <KeyIcon />,
        }}
        logoBottomLeft={{
          logo: <KeyIcon />,
        }}
      />
      <ModalContent>
        <ModalBody>
          <p style={{ marginBottom: 6 }}>
            With your private key, you can access your account outside this application.
          </p>
          <p>Keep it safe and never share it with anyone you don't trust.</p>
        </ModalBody>
        {!showExportedKey ? (
          <Button onClick={() => setShowExportedKey(true)} style={{ marginTop: 12 }}>
            Export key
          </Button>
        ) : exportError ? (
          <ModalBody style={{ marginTop: 12 }} $error>
            {exportError}
          </ModalBody>
        ) : exportedKey ? (
          <div style={{ marginTop: 12 }}>
            <CopyText value={exportedKey}>
              {exportedKey.slice(0, 10)}...{exportedKey.slice(-10)}
            </CopyText>
          </div>
        ) : (
          <>Loading...</>
        )}
      </ModalContent>
    </PageContent>
  )
}

export default ExportKey
