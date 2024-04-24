import './App.css';
import Main from './Main';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Error from './Error';
import SignIn from './SignIn';
import Announcements from './Announcements';
import Announce from './Announce';
import Settings from './Settings';
import Profile from './Profile';
import Announcement from './Announcement';
import Verify from './Verify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/SignIn" element={<SignIn />}></Route>
        <Route path="/Announce" element={<Announce />}></Route>
        <Route path="/Announcements" element={<Announcements />}></Route>
        <Route path="/Settings" element={<Settings />}></Route>
        <Route path="/Profile" element={<Profile />}></Route>
        <Route path="/Announcement" element={<Announcement />}></Route>
        <Route path="/Verify" element={<Verify />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
