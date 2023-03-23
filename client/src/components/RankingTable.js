import {Table} from 'react-bootstrap';
import "../App.css";
function RiddleTable(props){
  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th className='col-md-4'>Name</th>
            <th className='col-md-1'>Rank</th>
            <th className='col-md-2'>Score</th>
          </tr>
        </thead>
        <tbody>
            {props.players.map((player,index)=>
               <PlayerRow
                  player={player}
                  key={player.id}
                  rank={index+1}
               />
            )}
        </tbody>
      </Table>
    </>
  )
}
function PlayerRow(props){
  return(
    <tr>
      <PlayerData player={props.player} rank={props.rank}/>
    </tr>
  )
}
function PlayerData(props){
  
  return(
    <>
      <td>{props.player.name}</td>
      {
          props.rank===1 ? <td className='pos1'>{props.rank}</td>
        : props.rank===2 ? <td className='pos2'>{props.rank}</td> 
        : props.rank===3 ? <td className='pos3'>{props.rank}</td>
        : <td>{props.rank}</td>
      }
        
      <td>{props.player.score}</td> 
    </>
  )
}

export default RiddleTable;