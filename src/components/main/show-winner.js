import  React, { useContext } from 'react'
import Modal from 'react-modal'
import { ContractContext } from '../../containers/main'

function ShowWinner() {

  const { wallet_address, closeWinnerModal, isModalWinnerOpen, prizeTxHash } = useContext(ContractContext)
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
        isOpen={isModalWinnerOpen}
        onRequestClose={closeWinnerModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Modal for winner"
      >
        <div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Congratulations To Winner</h5>
              </div>
              <div className="modal-body">
                <p>Congratulations to our winner address</p>
                <p><strong>{wallet_address}</strong></p>
                <hr className="mt-2 mb-2" />
                <p>Your prize is being sent right now. It might take some time. You can follow it thru the transaction hash: { prizeTxHash ? <a href={`https://ropsten.etherscan.io/tx/${prizeTxHash}`}>{prizeTxHash}</a> : <strong>Generating the hash. Please wait...</strong> } </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => closeWinnerModal()}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ShowWinner
