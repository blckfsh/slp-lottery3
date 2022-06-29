import  React, { useContext } from 'react'
import { ContractContext } from '../../containers/config'

function DepositAddress() {

  const { id, depositAddress, setDepositAddress, privKey, setPrivKey, fetchDepositAddress, addDepositAddress, updateDepositAddress, deleteDepositAddress } = useContext(ContractContext)

  return(
    <div className="d-flex flex-row">
      <div className="d-flex flex-column">
        <div className="d-flex flex-row align-items-center justify-content-between me-5 mb-2 cx-w-50">
          <div className="flex-fill">Deposit Address: </div>
          <div className="flex-grow-1">
            <input type="text" name="deposit-address" className="cx-textbox form-control" value={depositAddress} onChange={(e) => setDepositAddress(e.target.value)} />
          </div>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between me-5 mt-2 cx-w-50">
          <div className="flex-fill">Private Key: </div>
          <div className="flex-grow-1">
            <input type="password" name="deposit-address" className="cx-textbox form-control" value={privKey} onChange={(e) => setPrivKey(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="d-flex flex-row">
        <div className="btn-group" role="group">
          <button type="button" className="btn btn-light" onClick={() => addDepositAddress(depositAddress, privKey)}>Add</button>
          <button type="button" className="btn btn-light" onClick={() => updateDepositAddress(id, depositAddress, privKey)}>Save</button>
          <button type="button" className="btn btn-light" onClick={() => deleteDepositAddress(id)}>Delete</button>
          <button type="button" className="btn btn-light" onClick={() => fetchDepositAddress()}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DepositAddress
