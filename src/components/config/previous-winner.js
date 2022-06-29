import  React, { useContext } from 'react'
import { ContractContext } from '../../containers/config'

function PreviousWinner() {

  const { previousWinner } = useContext(ContractContext)

  return(
    <div className="d-flex flex-row">
      <div className="d-flex flex-row align-items-center justify-content-between me-5 cx-w-50">
        <div className="flex-fill">Previous Winner: </div>
        <div className="flex-grow-1">
          <input type="text" name="previous-winner" className="cx-textbox dark form-control" value={previousWinner} readOnly={true} />
        </div>
      </div>
    </div>
  )
}

export default PreviousWinner
