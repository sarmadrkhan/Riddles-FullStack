import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './App.css';
import React, {useState, useEffect} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {DefaultLayout, LostLayout, LoadingLayout, MainLayout, AddLayout, LoginLayout, RankingLayout} from './components/Layouts'
import { Container } from "react-bootstrap";
import { Navigation } from './components/Navigation';
import API from './API';

function App() {
  return (
   <BrowserRouter>
      <Container fluid className="App">
        <Routes>
          <Route path="/*" element={<Main/>} />
        </Routes>
      </Container>
   </BrowserRouter>
  );
}

function Main(){
    // This state is used for displaying a LoadingLayout while we are waiting an answer from the server.
    const [loading, setLoading] = useState(true);
    // This state keeps track if the user is currently logged-in.
    const [loggedIn, setLoggedIn] = useState(false);
    // This state contains the user's info.
    const [user, setUser] = useState(null);
    // This state contains all the riddles that exist in the db
    const [riddles, setRiddles] = useState([]);
    // This state contains all the players/users that exist in the db
    const [players, setPlayers] = useState([]);

    const getRiddles = async() => {
      const riddles = await API.getRiddles();
      setRiddles(riddles);
    }  
    const closeRiddle = (riddle) => {
      setRiddles(oldRiddles => {
        return oldRiddles.map((rdl) => {
          if(rdl.riddleId === riddle.riddleId){
            return {...rdl, isClosed: 1, maxDuration: 0}
          }else{
            return rdl;
          }
      });
    })
      API.closeRiddle(riddle).then(()=> getRiddles());
    }
    const addReply = (reply) => {
      setRiddles(oldRiddles => {
        return oldRiddles.map((rdl) => {
          if(rdl.riddleId === reply.riddleId){
            return [...rdl.replies, {author: reply.author, reply: reply.reply}]
          }else{
            return rdl;
          }
      });
    })
      API.addReply(reply).then(()=> getRiddles());
    }

    const addRiddle = (riddle) => {
      setRiddles(oldRiddles => [...oldRiddles, riddle]);
      
      API.addRiddle(riddle).then(()=>getRiddles());
    }
    const getPlayers = async()=>{
      const players = await API.getPlayers();
      setPlayers(players)
    }
    const updateScore = (player)=> {
      let previousScore = players.filter(x=>x.id===player.id)[0].score
      setPlayers(oldPlayers => {
        return oldPlayers.map((oldPlyr)=>{
          if(oldPlyr.id===player.id){
            previousScore = oldPlyr.score
            const r =  {...oldPlyr, score: oldPlyr.score + player.score};
            return r;
          }else{
            return oldPlyr;
          }
        })
      })
      API.updateScore({...player,score:player.score+previousScore}).then(()=> getPlayers())
    }
    const rankSort=(arr)=>{
      return !!arr? arr.filter(x=> {return x.score}).sort((x, y) => x.score - y.score).reverse():[]
    }
    useEffect(() => {
      const init = async () => {
        try {
          setLoading(true);
  
          const user = await API.getUserInfo();  // here you have the user info, if already logged in
          setUser(user);
          setLoggedIn(true);
          setLoading(false);
          getRiddles();
          getPlayers();
        } catch (err) {
          setUser(null);
          setLoggedIn(false);
          setLoading(false);
        }
      };
      init();
    }, []);  // This useEffect is called only the first time the component is mounted.
    
    const handleLogin = async (credentials) => {
      try {
        const user = await API.logIn(credentials)
        setUser(user);
        setLoggedIn(true);
        getRiddles();
        getPlayers();
      } catch(err){
        throw err;
      }
    }
    const handleLogout = async () => {
      await API.logOut();
      setLoggedIn(false);
      setUser(null);
    }
    const handleGuestLogin = ()=>{
      try{
        const guest={
          id:0,
          name:'Guest',
        }
        setUser(guest)
        setLoggedIn(true)
        getRiddles()
      }catch(err){
        throw err
      }
    }

    return (
      <>
        <Navigation logout = {handleLogout} user={user} loggedIn = {loggedIn} />
        
        <Routes>
          <Route path="/" element={
            loading ? <LoadingLayout />
              : loggedIn ? <DefaultLayout/>
                : <Navigate to="/login" replace/>
          }>
            <Route index element={<MainLayout user={user} riddles={riddles} closeRiddle={closeRiddle} addReply={addReply} updateScore={updateScore}/>}/>
            <Route path="my" element={loggedIn?<MainLayout user={user} riddles={riddles.filter(x=>x.author===user.id)} closeRiddle={closeRiddle} addReply={addReply} updateScore={updateScore}/>:<Navigate to='/login' replace/>}/>
            <Route path="open" element={<MainLayout user={user} riddles={riddles.filter(x=>!x.isClosed)} closeRiddle={closeRiddle} addReply={addReply} updateScore={updateScore}/>}/>
            <Route path="closed" element={<MainLayout user={user} riddles={riddles.filter(x=>x.isClosed)} closeRiddle={closeRiddle} addReply={addReply} updateScore={updateScore}/>}/>
            <Route path="add" element={<AddLayout user={user} addRiddle={addRiddle} />} />
            <Route path="ranking" element={<RankingLayout players={rankSort(players)}/>} />
            <Route path="*" element={<LostLayout />} />
          </Route>
          <Route path="/login" element={!loggedIn ? <LoginLayout login={handleLogin} guestLogin={handleGuestLogin}/> : <Navigate replace to='/' />} />
        
        </Routes>
      </>
    )
}
export default App;
