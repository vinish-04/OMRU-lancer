import React from 'react'

const Filter = () => {
  return (
    <div className='explore-filter-cont'>
        <input
            placeholder='Enter minimum bounty'
            type="number" 
            className="e-min-bounty" 
        />
        <strong>Select Currency : </strong>
        <select className="explore-currency-drop">
            <option value="1" className="e-currency-op">ICP</option>
            <option value="2" className="e-currency-op">ckBTC</option>
            <option value="3" className="e-currency-op">ckETH</option>
        </select>
        <button className="explore-filter-btn">Filter</button>
    </div>
  )
}

export default Filter