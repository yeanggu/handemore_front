import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import {NavLink } from "react-router-dom";
import Calendar from 'react-calendar';
import moment from 'moment';
import { FaBook, FaRegEdit } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';
import './Cal.css'

export default function Cal() {
    
    //현재 날짜
    const [date, setDate] = useState(new Date());
    const [ddays, setDdays] = useState([]);
    const [oxnotes, setOxNotes] = useState([]);
    const [studynotes, setStudyNotes] = useState([]);
    const [todos, setTodos] = useState([]);
    const memberid = useSelector((state) => state.memberid);

    useEffect(() => {
        getAllList();

        console.log("getAllList()실행");
    }, [memberid]);

    const getAllList = () =>{
        getDdayList();
        getOXList();
        getStudyList();
        getTodoList();
    }

    //Dday 목록 조회
    const getDdayList = async () => {
        console.log("==== getDdayList()실행");
        await axios.get('/handemore/calendar/dday/' + memberid)
        .then(function (response) {
            setDdays(response.data);
        }).catch(function (error) {
            console.error(error)
        });
    }
    //oxnote 목록 조회
    const getOXList = async () => {
        console.log("==== getOXList()실행");
        await axios.get('/handemore/calendar/ox/' + memberid)
        .then(function (response) {
            setOxNotes(response.data);
        }).catch(function (error) {
            console.error(error)
        });
    }
    //studynote 목록 조회
    const getStudyList = async () => {
        console.log("==== getStudyList()실행");
        await axios.get('/handemore/calendar/study/' + memberid)
        .then(function (response) {
            setStudyNotes(response.data);
        }).catch(function (error) {
            console.error(error)
        });
    }
    //todo 목록 조회
    const getTodoList = async () => {
        console.log("==== getTodoList()실행");
        await axios.get('/handemore/calendar/todo/' + memberid)
        .then(function (response) {
            setTodos(response.data);
        }).catch(function (error) {
            console.error(error)
        });
    }

    return (
        <div className="Calcontainer">
        <div className="CalContent">
            <Calendar value={date}
                nextLabel='▶' next2Label='▶▶' prevLabel='◀' prev2Label='◀◀'
                minDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                maxDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                formatMonthYear={(locale, date) => moment(date).format("YYYY.MM")}
                formatShortWeekday={(locale, date) => moment(date).format("ddd")}
                formatDay={(locale, date) => moment(date).format("D")}
                showNeighboringMonth={false}
                tileClassName={({ date, view }) => {
                    if (ddays.find((one) => one.date === moment(date).format("YYYY-MM-DD"))) {                        
                        return 'calDdayFlag';     
                    }           
                }} 
                tileContent={({ date, view }) => {
                    let links = []; // 캘린더에 표시할 링크 배열
                    //todo 해당하는 날짜에 아이콘 표시
                    if (todos.find((one) => moment(one.regdate).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"))) {
                        links.push (
                            <NavLink to="/todo">
                                <div className="calIconTodo" >
                                    <FaRegEdit className="calIconImage" />
                                </div>
                            </NavLink>
                        );
                    }
                    const oxnote = oxnotes.find((one) => moment(one.regdate).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));
                    console.log(oxnote);
                    if(oxnote != null){
                       const path = '/detail/' + oxnote.notenum + '/' + oxnote.notetitle;                       
                       links.push (
                            <NavLink to={path}>
                                <div className="calIconOX" >
                                    <FaBook className="calIconImage" />
                                </div>
                            </NavLink>
                        );
                   } 
                   //studynote 해당하는 날짜에 아이콘 표시
                   const studynote = studynotes.find((one) => moment(one.regdate).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));
                   console.log(studynote);
                   if(studynote != null){
                       const path = '/detail/' + studynote.notenum + '/' + studynote.notetitle;                       
                       links.push (
                            <NavLink to={path}>
                                <div className="calIconStudy" >
                                    <FaBook className="calIconImage" />
                                </div>
                            </NavLink>
                        );
                   }
                    if (ddays.find((one) => one.date === moment(date).format("YYYY-MM-DD"))) {
                        links.push (
                            <NavLink to="/dday" className='calLinkDday'>
                                <div className="calIconDday" >
                                    D-DAY                                  
                                </div>
                            </NavLink>
                        );
                    }   
                    return(
                        <div className="calLinks">{links}</div>
                    );
                  }} 
            />
            <div className="calToday">
                TODAY <button id="calTodayBtn" onClick={() => window.location.replace("/calendar")}> ▶</button>
            </div>
        </div>
        </div>
    );
   
}