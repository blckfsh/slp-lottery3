import  React, { useContext } from 'react'
import { ContractContext } from '../../containers/main'

function PayDetails() {

    const { receiver, qrImgUrl } = useContext(ContractContext)

  return (
    <div className="text-center">
      <h2>How To Join?</h2>
      <p>Send SampleToken (SLP) to this address: <strong>{receiver}</strong></p>
      <hr className="mt-4 mb-3" />
      <p>Or<br/>Send via QR code</p>
      <div>
        <a href={qrImgUrl}>
          <img src={qrImgUrl} alt="img" width="300" height="300" />
        </a>
      </div>

    </div>
  )
}

export default PayDetails
