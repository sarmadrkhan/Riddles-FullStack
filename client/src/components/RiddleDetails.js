import React from 'react'

const RiddleDetails = (props) => {
  const riddleData = !!props.details.replies? props.details.replies:[]
  const winner = riddleData.find(x=>x.reply===props.details.answer)
  return (
    <div>
      {props.details.isClosed===1 && <p>{`Correct Answer: ${props.details.answer}`}</p>}
      {props.details.isClosed===1 && <p>{`Winner: ${!!winner?winner.author:'none'}`}</p>}
    </div>
  )
  
}

export default RiddleDetails;