import { Row, Col, Spinner} from "react-bootstrap";
import { LoginForm } from './Auth';
import  RiddleTable  from './RiddleTable'
import RankingTable from './RankingTable'
import RiddleForm from "./RiddleForm";
import "../App.css"
import API from "../API";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
function LostLayout() {
  return (
    <span className='lost-page'>
      <h1 className='lost-text'>Woops! You seem a bit lost...</h1>
    </span>
  )
}
function DefaultLayout(props){
   return (
    <Row className="vh-100">
      <Col md={2} bg="light" className="below-nav" id="left-sidebar">
        <SideBar/>
      </Col>
      <Col md={10} className="below-nav">
        <Outlet/>
      </Col>
    </Row>
  )
}
function LoadingLayout(props) {
  return (
    <Row className="vh-100">
      <Col md={2} bg="light" className="below-nav" id="left-sidebar">
      </Col>
      <Col md={10} className="below-nav">
        <Spinner animation="border"/>
        <br/>
        <h3>Riddle Bank Loading ...</h3>
      </Col>
    </Row>
  )
}

function MainLayout(props){
  return (
    <RiddleTable user={props.user} riddles={props.riddles}  closeRiddle={props.closeRiddle} addReply={props.addReply} updateScore={props.updateScore}/>        
  )
}
function RankingLayout(props){
  return (
    <RankingTable players={props.players}/>        
  )
}
function AddLayout(props){
  return (
    <RiddleForm user={props.user} addRiddle={props.addRiddle}/>
  )
}

function LoginLayout(props) {
  return (
    <Row className="vh-100">
      <Col md={12} className="below-nav login-form">
        <LoginForm login={props.login} guestLogin={props.guestLogin}/>
      </Col>
    </Row>
  );
}

export {MainLayout,RankingLayout, AddLayout, LoginLayout, LostLayout, LoadingLayout, DefaultLayout}