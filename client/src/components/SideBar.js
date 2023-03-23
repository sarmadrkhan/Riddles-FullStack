import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

const SideBar = () => {
  const navigate = useNavigate()
  return (
    <ListGroup className="left-sidebar-list">
          
    <Link to="/">
      <ListGroupItem action onClick={()=>{
        navigate('/')
        }}>
        All Riddles
      </ListGroupItem>
    </Link>
    
    <Link to="/my">
      <ListGroupItem action onClick={()=>{
        navigate('/my')
      }}> 
        My Riddles
      </ListGroupItem>
    </Link>
    
    <Link to="/open">
      <ListGroupItem action onClick={()=>{
        navigate('/open')
      }}> 
        Open Riddles
      </ListGroupItem>
    </Link>
    
    <Link to="/closed">
      <ListGroupItem action onClick={()=>{
        navigate('/closed')
      }}> 
        Closed Riddles
      </ListGroupItem>
    </Link>

    <Link to="/ranking">
      <ListGroupItem action onClick={()=>{
        navigate('/ranking')
      }}>
        Rankings
      </ListGroupItem>
    </Link>
  </ListGroup>
  )
}

export default SideBar