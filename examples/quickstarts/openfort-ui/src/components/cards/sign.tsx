import { useChainId, useSignMessage, useSignTypedData } from 'wagmi'
import { TruncateData } from '../ui/TruncateData'

function SignTypedData() {
  const { signTypedData, error, data } = useSignTypedData()
  const chainId = useChainId()

  return (
    <div>
      <h2 className="mb-3">Sign Typed Data Message</h2>

      <form
        onSubmit={async (event) => {
          event.preventDefault()
          signTypedData({
            domain: {
              name: 'Ether Mail',
              version: '1',
              chainId: chainId,
              verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
            },
            types: {
              Person: [
                { name: 'name', type: 'string' },
                { name: 'wallet', type: 'address' },
              ],
              Mail: [
                { name: 'from', type: 'Person' },
                { name: 'to', type: 'Person' },
                { name: 'contents', type: 'string' },
              ],
            },
            primaryType: 'Mail',
            message: {
              from: {
                name: 'Cow',
                wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
              },
              to: {
                name: 'Bob',
                wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              },
              contents: 'Hello, Bob!',
            },
          })
        }}
      >
        <button type="submit" className="btn">
          Sign Message
        </button>
      </form>
      <TruncateData data={data} />
      <TruncateData data={error?.message} className="text-red-500" />
    </div>
  )
}

function SignMessage() {
  const { data, signMessage, error } = useSignMessage()

  return (
    <div>
      <h2 className="mb-3">Sign Message</h2>
      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          console.log('Message to sign:', formData.get('message'))
          signMessage({ message: formData.get('message') as string })
        }}
      >
        <input name="message" placeholder="Message to sign" />
        <button type="submit" className="btn">
          Sign Message
        </button>
      </form>
      <TruncateData data={error?.message} className="text-red-500" />
      <TruncateData data={data} />
    </div>
  )
}

export const Sign = () => {
  return (
    <div className="flex flex-col w-full">
      <h1>Signatures</h1>
      <p className="mb-4 text-sm text-zinc-400">
        Sign messages and typed data with your connected wallet.
      </p>
      <div className="space-y-6">
        <SignMessage />
        <SignTypedData />
      </div>
    </div>
  )
}
