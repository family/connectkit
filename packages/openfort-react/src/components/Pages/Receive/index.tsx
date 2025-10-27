import { useAccount } from 'wagmi'
import CopyToClipboard from '../../Common/CopyToClipboard'
import CustomQRCode from '../../Common/CustomQRCode'
import { ModalBody, ModalH1, PageContent } from '../../Common/Modal/styles'
import { AddressField, AddressRow, AddressSection, Label, NetworkInfo, QRWrapper } from './styles'

const Receive = () => {
  const { address, chain } = useAccount()

  const qrValue = address ? `ethereum:${address}` : ''

  const networkLabel = chain?.name
    ? `${chain.name}${chain?.id ? ` · Chain ID ${chain.id}` : ''}`
    : chain?.id
      ? `Chain ID ${chain.id}`
      : null

  return (
    <PageContent>
      <ModalH1>Receive funds</ModalH1>
      <ModalBody style={{ marginTop: 8 }}>Scan the QR code or copy your wallet details.</ModalBody>

      <QRWrapper>
        <CustomQRCode value={qrValue} />
      </QRWrapper>

      <AddressSection>
        <Label>Your wallet address</Label>
        <AddressRow>
          <AddressField>{address ?? '--'}</AddressField>
          <CopyToClipboard variant="button" string={address ?? ''}>
            Copy
          </CopyToClipboard>
        </AddressRow>
      </AddressSection>

      {networkLabel && <NetworkInfo>Network: {networkLabel}</NetworkInfo>}
    </PageContent>
  )
}

export default Receive
