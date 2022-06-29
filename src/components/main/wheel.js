import React, { useContext } from 'react'
import { ContractContext } from '../../containers/main'

// Import Wheel
import { Wheel } from 'react-custom-roulette'

function WheelRoulette() {

  const { segment, mustSpin, stopPick, pool, receiver, isLoadingEntries } = useContext(ContractContext)
  // console.log(segment)

  return (
    <>
      <div className="cx-wheel mb-5">
        {
          isLoadingEntries === true ?
          <div className="cx-no-wheel d-flex justify-content-center align-items-center"><h2>Loading wheel...</h2></div> :
          segment.length > 0 ?
          <>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={pool}
              data={segment}
              backgroundColors={['#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#f1c40f']}
              textColors={['#ffffff']}
              fontSize={7}
              textDistance={55}
              onStopSpinning={() => {
                stopPick()
              }}
            />
          </> :
          <div className="cx-no-wheel d-flex justify-content-center align-items-center">
            <h2>No players found.</h2>
          </div>
        }

      </div>
      <div>
        <p className="cx-wheel-text text-center">Address: {receiver}</p>
      </div>
    </>
  )
}

export default WheelRoulette
