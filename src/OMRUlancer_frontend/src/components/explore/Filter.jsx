import React from 'react'

const Filter = ({setBounties,bounties}) => {
  function filter(){
    try{
      let method=document.getElementsByClassName('explore-currency-drop')[0].value
      let minVal=document.getElementsByClassName('e-min-bounty')[0].value
      let payMethod=method=='1'?'icp':method=='2'?'ckbtc':method=='3'?'cketh':''
      let arr=[]
      for(let i=0;i<bounties?.length;i++){
        console.log(Object.keys(bounties?.[i]?.currency)?.[0])
        if(
          (
            payMethod==Object.keys(bounties?.[i]?.currency)?.[0] ||
            payMethod==''
          )
          &&
          (
            minVal=='' ||
            Number(minVal*Math.pow(10,8))<=Number(bounties?.[i]?.reward)
          )
        ){
          arr.push(bounties[i])
        }
      }
      setBounties(arr)
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className='explore-filter-cont'>
        <input
            placeholder='Enter minimum bounty'
            type="number" 
            className="e-min-bounty" 
        />
        <strong>Select Currency : </strong>
        <select className="explore-currency-drop">
            <option value="0" className="e-currency-op">Any</option>
            <option value="1" className="e-currency-op">ICP</option>
            <option value="2" className="e-currency-op">ckBTC</option>
            <option value="3" className="e-currency-op">ckETH</option>
        </select>
        <button className="explore-filter-btn" onClick={filter}>Filter</button>
    </div>
  )
}

export default Filter