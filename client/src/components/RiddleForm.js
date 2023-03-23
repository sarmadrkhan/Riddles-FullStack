import React, {useState} from 'react';
import { Form, Button, FormGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Riddle } from '../models/Riddle';

const RiddleForm = (props) => {
const [text, setText] = useState(props.riddle? props.riddle.text: ''); 
const [difficulty, setDifficulty] = useState(props.riddle? props.riddle.difficulty: 'easy'); 
const [maxDuration, setMaxDuration] = useState(props.riddle? props.riddle.maxDuration: 60); 
const [answer, setAnswer] = useState(props.riddle? props.riddle.answer: ''); 
const [hint1, setHint1] = useState(props.riddle? props.riddle.hint1: '?'); 
const [hint2, setHint2] = useState(props.riddle? props.riddle.hint2: '?'); 
const [isClosed] = useState(props.riddle? props.riddle.isClosed: false); 
const [author] = useState(props.riddle? props.riddle.author: props.user.id) 
const [replies] = useState(props.riddle? props.riddle.replies: [])
const navigate = useNavigate() //hook used to change page
  const handleSubmit = (event) => {
    event.preventDefault();

    const riddle = new Riddle({text, difficulty, maxDuration, answer, hint1, hint2, isClosed, author, replies})
   if(props.riddle === undefined)
      props.addRiddle(riddle);
    
    navigate('/')
  }

  return (
    <Form className="block-example border border-primary rounded mb-0 form-padding" onSubmit={handleSubmit}>
      <FormGroup className='mb-3'>
        <Form.Label>Text</Form.Label>
        <Form.Control type='text' required={true} value={text} onChange={e=>setText(e.target.value)}/>
      </FormGroup>
      
      <FormGroup className='mb-3'>
        <Form.Label>Difficulty</Form.Label>
        <Form.Select aria-label='Difficulty' onChange={e=>setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="average">Average</option>
          <option value="difficult">Difficult</option>
        </Form.Select>
      </FormGroup>
      
      <FormGroup className='mb-3'>
        <Form.Label>Max Duration (seconds)</Form.Label>
        <Form.Control type='number' required={true} value={maxDuration} min={30} max={600} onChange={e=>setMaxDuration(e.target.value)}/>
      </FormGroup>

      <FormGroup className='mb-3'>
        <Form.Label>Correct Answer</Form.Label>
        <Form.Control type='text' required={true} value={answer} onChange={e=>setAnswer(e.target.value)}/>
      </FormGroup>
      
      <FormGroup className='mb-3'>
        <Form.Label>Hint 1</Form.Label>
        <Form.Control type='text' required={true} value={hint1} onChange={e=>setHint1(e.target.value)}/>
      </FormGroup>

      <FormGroup className='mb-3'>
        <Form.Label>Hint 2</Form.Label>
        <Form.Control type='text' required={true} value={hint2} onChange={e=>setHint2(e.target.value)}/>
      </FormGroup>


      <Button className="mb-3" variant="primary" type="submit">Save</Button>
      &nbsp;
      <Link to={'/'}> 
        <Button className="mb-3" variant="danger" >Cancel</Button>
      </Link>
    </Form>
  )
}

export default RiddleForm;