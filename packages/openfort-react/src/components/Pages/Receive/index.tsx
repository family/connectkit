import { useAccount } from 'wagmi'
import Logos from '../../../assets/logos'
import { CopyIconButton } from '../../Common/CopyToClipboard'
import CustomQRCode from '../../Common/CustomQRCode'
import { ModalBody, ModalHeading } from '../../Common/Modal/styles'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'
import { AddressField, AddressRow, AddressSection, Label, NetworkInfo, QRWrapper } from './styles'

const Receive = () => {
  const { address, chain } = useAccount()

  const qrValue = address || ''

  const networkLabel = chain?.name
    ? `${chain.name}${chain?.id ? ` · Chain ID: ${chain.id}` : ''}`
    : chain?.id
      ? `Chain ID: ${chain.id}`
      : null

  const { uiConfig: options } = useOpenfort()
  const renderLogo = () => {
    if (options?.logo) {
      if (typeof options.logo === 'string') {
        return <img src={options.logo} alt="Logo" style={{ width: '100%' }} />
      }
      return options.logo
    }
    return <Logos.Openfort />
  }

  return (
    <PageContent>
      <ModalHeading>Receive funds</ModalHeading>
      <ModalBody>Scan the QR code or copy your wallet details.</ModalBody>

      {address && (
        <QRWrapper>
          <CustomQRCode value={qrValue} image={<div style={{ padding: 10 }}>{renderLogo()}</div>} />
        </QRWrapper>
      )}

      <AddressSection>
        <Label>Your wallet address</Label>
        <AddressRow>
          <AddressField>{address ?? '--'}</AddressField>
          <CopyIconButton value={address ?? ''} />
        </AddressRow>
      </AddressSection>

      {networkLabel && <NetworkInfo>Network: {networkLabel}</NetworkInfo>}
    </PageContent>
  )
}

export default Receive
