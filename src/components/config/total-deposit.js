import DatePicker from 'react-datepicker'
import  React, { useContext } from 'react'
import { ContractContext } from '../../containers/config'

import 'react-datepicker/dist/react-datepicker.css'

function TotalDeposit() {

  const { startDate, setStartDate, deposit, fetchTotalDeposit } = useContext(ContractContext)

  return(
    <div className="d-flex flex-row">
      <div className="d-flex flex-row align-items-center justify-content-between me-5 cx-w-50">
        <div className="flex-fill">Total Deposit: </div>
        <div className="flex-grow-1">
          <input type="text" name="total-deposit" className="cx-textbox form-control" value={deposit} readOnly={true} />
        </div>
      </div>
      <div className="d-flex flex-row align-items-center justify-content-between me-5">
        <DatePicker
          selected={startDate} onSelect={(date) => setStartDate(date)} onChange={(date) => fetchTotalDeposit(date)}
        />
      </div>
    </div>
  )
}

export default TotalDeposit
