import {Table, Button, Form, FormGroup} from 'react-bootstrap';
import "../App.css";
import {Link} from "react-router-dom"
import { useEffect, useState } from 'react';
import RiddleDetails from './RiddleDetails';
function RiddleTable(props){
  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th className='col-md-4'>Riddle</th>
            <th className='col-md-1'>Difficulty</th>
            {props.user.id!==0 && <th className='col-md-1'>Time Left</th>}
            <th className='col-md-1'>Status:<br/>Open/Close</th>
            {props.user.id!==0 && <th className='col-md-2'>Action</th>}
            {props.user.id!==0 && <th className='col-md-1'>Replies</th>}
            {props.user.id!==0 && <th className='col-md-2'>Details</th>}
          </tr>
        </thead>
        <tbody>
            {props.riddles.map(rdl=>
               <RiddleRow
                  user={props.user}
                  closeRiddle={props.closeRiddle}
                  addReply={props.addReply}
                  updateScore={props.updateScore}
                  riddle={rdl}
                  key={rdl.riddleId}
               />
            )}
        </tbody>
      </Table>
      
      <Link to="/add">
        <Button onClick={()=>{}} className="add-riddle-btn">
          +
        </Button>        
      </Link>
    </>
  )
}
function RiddleRow(props){
  return(
    <tr key={props.riddle.riddleId} >
      <RiddleData key={props.riddle.riddleId} user={props.user} riddle={props.riddle} closeRiddle={props.closeRiddle} addReply={props.addReply} updateScore={props.updateScore}/>
    </tr>
  )
}
function RiddleData(props){
  const riddleRepliesLength=!!props.riddle.replies?props.riddle.replies.length:0
  const riddleReplies = !!props.riddle.replies?props.riddle.replies:[]
  const [showHint1, setShowHint1] = useState(false)
  const [showHint2, setShowHint2] = useState(false)
  const [reply,SetReply]=useState('');
  const [showForm, setShowForm]=useState(false);
  const [timer, setTimer] = useState(props.riddle.maxDuration)
  const [isRiddleClosed, setIsRiddleClosed] = useState(false)
  useEffect(()=>{
    if (riddleRepliesLength>0){//start timer as soon as replies are present
      if(timer>0 ){
        setTimeout(()=>{
          setTimer(timer-1)
        },1000)
        // if(timer<=(props.riddle.maxDuration)/2){
        //   setShowHint1(true)
        // }
        // if(timer<=(props.riddle.maxDuration)/4){
        //   setShowHint2(true)
        // }
      }else{
        if(!props.riddle.isClosed)   
        props.closeRiddle(props.riddle)
      }
    }
  },[riddleRepliesLength, isRiddleClosed, timer])
  
  useEffect(()=>{
    if (!riddleReplies.find(r => r.author === props.user.id)){
      setShowForm(true); 
    }
    if(riddleReplies.some(r => r.reply == props.riddle.answer)){
      setShowForm(false);
      setIsRiddleClosed(true)
      setTimer(0)
      props.closeRiddle(props.riddle)
    }
  },[riddleRepliesLength,timer])

  // useEffect(()=>{
  //   if(timer<=props.riddle.maxDuration/2){
  //     setShowHint1(true)
  //   }
  //   if(timer<props.riddle.maxDuration/4){
  //     setShowHint2(true)
  //   }
  // },[timer])

  const handleSubmit = (event)=>{
    event.preventDefault();
    props.addReply({
      riddleId:props.riddle.riddleId,
      author:props.user.id,
      reply:reply
    })
    if(reply===props.riddle.answer){
      props.updateScore({
        id: props.user.id,
        score: props.riddle.difficulty==="easy" ? 1
              :props.riddle.difficulty==="average"? 2
              :props.riddle.difficulty==="difficult"? 3
              :0
      })
    }
  }

  return(
    <>
      <td>
        <p>{props.riddle.text}</p>
        {showHint1&& <p> {props.riddle.hitn1} </p>}   
        {showHint2&& <p> {props.riddle.hitn1} </p>}   
      </td>
      <td>{props.riddle.difficulty}</td>
      {props.user.id!==0 &&
        <td>
        {riddleRepliesLength>0
          ? timer: '-'
        }
      </td>
      }
      { props.riddle.isClosed 
        ? <td className='rdl-closed'>Closed</td>
        : <td className='rdl-open'>Open</td>
      }
      {
        props.user.id!==0 &&
        <td className={!props.riddle.isClosed&&!showForm?'rdl-answered':''}>
          {
            !props.riddle.isClosed
            ? showForm 
            ? <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Form.Control type='text' value={reply} onChange={(e)=>{SetReply(e.target.value)}}></Form.Control>
                </FormGroup>
                <Button className='rep-submit-btn' type='submit'>Send</Button>
              </Form>
            : 'Answered Already'
            : '-'
          }
        </td>
      }
      { props.user.id!==0 &&
        <td>
        {props.user.id===props.riddle.author&& <ul>
          {riddleReplies.map((r,index)=>{return <li key={index}>{r.reply}</li>})}
          </ul>}
        </td>
      }
      { props.user.id!==0 &&<td><RiddleDetails user={props.user} details={props.riddle}/></td>}
    </>
  )
}

export default RiddleTable;