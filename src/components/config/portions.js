import  React, { useContext } from 'react'
import { ContractContext } from '../../containers/config'

function Portions() {

  const { portionId, prize, burn, guild, setPrize, setBurn, setGuild, updatePortions } = useContext(ContractContext)

  return(
    <div className="d-flex flex-row justify-content-between">
      <div className="flex-fill">Portions: </div>
      <div className="w-90 ms-2 d-flex flex-column">
        <div className="d-flex flex-row align-items-center">
          <input type="text" name="winner-percentage" className="cx-textbox form-control mt-3" value={prize} onChange={(e) => setPrize(e.target.value)} />
          <button className="btn btn-link" onClick={() => updatePortions(portionId, prize, burn, guild)}>Change</button>
        </div>
        <div className="d-flex flex-row align-items-center">
          <input type="text" name="burn-percentage" className="cx-textbox form-control mt-3" value={burn} onChange={(e) => setBurn(e.target.value)} />
          <button className="btn btn-link" onClick={() => updatePortions(portionId, prize, burn, guild)}>Change</button>
        </div>
        <div className="d-flex flex-row align-items-center">
          <input type="text" name="guild-percentage" className="cx-textbox form-control mt-3" value={guild} onChange={(e) => setGuild(e.target.value)} />
          <button className="btn btn-link" onClick={() => updatePortions(portionId, prize, burn, guild)}>Change</button>
        </div>
      </div>
    </div>
  )
}

export default Portions
