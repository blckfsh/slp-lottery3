import  React, { useContext } from 'react'
import Modal from 'react-modal'
import { ContractContext } from '../../containers/main'

function PayQR() {

  const { qrImgUrl, closeQRModal, isModalQROpen } = useContext(ContractContext)
  const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 'none'
    },
  }

  return (
    <div className="cx-modal">
      <Modal
        isOpen={isModalQROpen}
        onRequestClose={closeQRModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Modal for winner"
      >
        <div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pay thru QR Code</h5>
              </div>
              <div className="modal-body">
                <a href={qrImgUrl} download>
                  <img src={qrImgUrl} alt="img" width="200" height="200" />
                </a>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => closeQRModal()}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PayQR
