import React, { useEffect, useState} from "react";
import {  BrowserRouter as Router, Routes, Route, NavLink, useParams } from "react-router-dom";
import { createStore } from "redux";
import { Provider, useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import Note from "./Note";
import Dday from "./Dday";
import Cal from "./Cal";
import Todo from "./Todo";
import Detail from "./Detail";
import Oxnotedetail from "./Oxnotedetail";
import Studynotedetail from "./Studynotedetail";
import NoMatch from "./NoMatch";
import { FaBook, FaRegFlag, FaCalendarAlt, FaRegEdit } from 'react-icons/fa';
import './Font.css';
import './Handemore.css';

function reducer(currentState, action) {
  if (currentState === undefined) {
    return {
      memberid: 'dpdms9621'
    };
  }
  const newState = { ...currentState };
/*   if (action.type === 'LOGOUT') {
    newState.memberid = 'none';
  } */
  return newState;
}

const store = createStore(reducer);
/* function Logoutbtn() {
  const dispatch = useDispatch();
  return (
    <div className="icon">
      {<input type="button" value="로그아웃" onClick={() => { dispatch({ type: 'LOGOUT' }); }}></input>}
    </div>
  );
} */

function Profile() {
  const memberid = useSelector((state) => state.memberid);
  return (
    <div className="profile">
      {memberid}님의 한데More
    </div>
  );
}

export default function Handemore() {
  console.log("handemore main 실행");

  return (
    <Provider store={store}>
      <div className="container">
        <div className="handemore">
          <div className="innerSpace"></div>
          <div className="content">
            <div className="contentBox">
              <div className="nav">
                <div className="navItem">   
                  <div className="icons">
                    <NavLink to="/note"><div className="icon">
                      <FaBook className="iconImage" />
                    </div></NavLink>
                    <NavLink to="/dday"><div className="icon">
                      <FaRegFlag className="iconImage" />
                    </div></NavLink>
                    <NavLink to="/calendar"><div className="icon">
                      <FaCalendarAlt className="iconImage" />
                    </div></NavLink>
                    <NavLink to="/todo"><div className="icon" >
                      <FaRegEdit className="iconImage" />
                    </div></NavLink>
                    {/* <Logoutbtn />/ */}
                  </div>
                </div>
                <div className="navItem" >
                  <Profile />
                </div>
              </div>
              <div className="whiteContent">
                <Routes>
                  {/* <Route path="/" element={<Note />} /> */}
                  <Route path="/note" element={<Note/>} />
                  <Route path="/dday" element={<Dday />} />
                  <Route path="/calendar" element={<Cal />} />
                  <Route path="/todo" element={<Todo />} />
                  <Route exact path="/detail/:notenum/:notetitle"  element={<Detail />} />
                  <Route exact path="/oxdetail/:oxnum"  element={<Oxnotedetail />} />
                  <Route exact path="/studydetail/:studynum"  element={<Studynotedetail />} />
                  <Route path="*" element={<NoMatch />} />
                </Routes>
              </div>
            </div>
          </div>
          <div className="innerSpace" style={{ width: '100%', height: '50px' }}></div>
        </div>
      </div>
    </Provider>
  );
}

