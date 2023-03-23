import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './Auth';

const Navigation = (props) => {

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <Navbar bg="dark" expand="sm" variant="dark" fixed="top" className="navbar-padding">
      <Link to="/" className='app-title-link'>
        <Navbar.Brand>
        <i className="bi bi-joystick"/>
        <span className='app-title-text'>Riddle Frenzy!!!</span> 
        </Navbar.Brand>
      </Link>
      <Nav className="ml-md-auto">
        <Navbar.Text className="mx-2">
          {props.user && props.user.name && `Welcome, ${props.user.name}!`}
        </Navbar.Text>
        &nbsp;
        <Form className="mx-2 logout-btn">
          {props.loggedIn ? <LogoutButton logout={props.logout} /> : <></>}
        </Form>
      </Nav>
    </Navbar>
  );
}

export { Navigation }; 