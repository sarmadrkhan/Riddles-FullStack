import React from 'react';
import {Table} from 'react-bootstrap';

function RiddleTable(props) {
  return (
    <Table>
      <tbody>
        {
          props.riddles.map((riddle)=>{
            <RiddleRow riddleData={riddle} key={riddle.id} id={riddle.id}  />
          })
        }
      </tbody>
    </Table>
  )
}

function RiddleRow(props) {
  return (
    <tr>
      <td>
        <p>this is a row</p>
      </td>
    </tr>
  )
}

export default RiddleTable;