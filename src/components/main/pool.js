import  React, { useContext } from 'react'
import { ContractContext } from '../../containers/main'

function Pool() {

  const { pool } = useContext(ContractContext)

  return (
    <div className="cx-pool">
      <p className="cx-pool-prize">{pool} SLP [fake]</p>
      <small className="cx-pool-text">jackpot prize</small>
    </div>
  )
}

export default Pool
