//import Year from "react-live-clock";
//import Month from "react-live-clock";
//import styled from "styled-components";
import { Routes, Route, Router, NavLink, Link } from "react-router-dom";
import React, {useState, useEffect, useRef, Component} from "react";
import moment from 'moment';
import { useSelector } from 'react-redux';
import {FaPen, FaRegCheckCircle, FaPlus, FaTrashAlt, FaTimes } from 'react-icons/fa';
import axios from "axios";
import Detail from "./Detail";
import './Note.css';

export default function Note() {

    const memberid = useSelector((state) => state.memberid);

    const [notes, setNotes] = useState([]);
    const [input, setInput] = useState("");
    const [edited, setEdited] = useState(false);
    const [newText, setNewTest] = useState(notes.notetitle); // 새로운 아이템 내용
    const [visible, setVisible] = useState(false);
    const [inputVisible, setInputVisible] = useState(false);
    const [getMoment, setMoment]=useState(moment());     
    const [readonly, setReadonly] = useState(true);

    const today = getMoment; 

    const editInputRef = useRef(null);
    const inputRef = useRef(null);

    
    const onClickEditButton = (notenum, notetitle)=>{
        console.log("onClickEditButton==>"+notenum);
        setNewTest(notetitle);
        setNotes(notes.map( (note) =>
        note.notenum === notenum ? { ...note, readonly:false } : { ...note, readonly:true }
        ));
       
        setEdited(true);
        console.log(edited); 
    };

    const onChangeEditInput = (e, notenum) => { 
        setNewTest(e.target.value);
        setNotes(notes.map( (note) =>
        note.notenum === notenum ? { ...note, notetitle:e.target.value } : note
        )) ;         
        
    };

    useEffect(() => { 
        if (inputVisible) { 
            inputRef.current.focus(); 
        } 
    }, [inputVisible]);

    useEffect(() => {
        getNotes();
    }, [memberid,today]);

    async function getNotes() {
        await axios
            .get("/handemore/note", { params: { memberid }})
            .then((response) => {
                setNotes(response.data);
                setEdited(false);
                console.log(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    function insertNote(e) {
        e.preventDefault();

        const insertNote = async () => {
            await axios
                .post("/handemore/insert/note", {
                    memberid: memberid,
                    notetitle: input
                })
                .then((response) => {
                    console.log(response.data)
                    setNotes("");
                    getNotes();
                    setEdited(false);
                    setInput("");
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        insertNote();
        console.log("할일이 추가됨!");
    }

    function deleteNote(notenum) {
        console.log(notenum);
        const deleteNote = async () => {
            await axios
                .delete("/handemore/note/delete/" + notenum, {})
                .then((response) => {
                    console.log(response.data);
                    setNotes(
                        notes.filter((note) => note.notenum !== notenum)
                    );
                    //getNotes();
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        deleteNote();
    }

    function updateNote(notenum){ 
        console.log(newText);
        console.log(notenum);
        const updateNote = async () => {
            await axios
                .post("/handemore/updatenote/" + notenum, {
                    'notetitle' : newText
                })
                .then((response) => {
                    console.log(response.data)
                    //setNotes("");
                    getNotes();
                    setEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        updateNote();
        setEdited(false);
    };

    function changeText(e) {
        e.preventDefault();
        setInput(e.target.value);
        console.log(input);
    }

    return (
        <div className="all_note">

            <div className="Note">

                <div className="notebox">

                    {
                        notes
                            ? notes.map((note) => {
                                return (
                                    <div className="note" key={note.notenum}>
                                        
                                        <div className="note_listbox">
                                                { 
                                                    edited === false?
                                                    
                                                    <NavLink to={`/detail/${note.notenum}/${note.notetitle}`} style={{textDecoration: 'none',color: "black"}}>
                                                        <div className="notestate" >
                                                        {note.notetitle}
                                                        </div>  
                                                    </NavLink>
                                                      
                                                    :
                                                    ( note.readonly ?
                                                    <NavLink to={`/detail/${note.notenum}/${note.notetitle}`} style={{textDecoration: 'none',color: "black"}}>
                                                        <div className="notestate">
                                                            {note.notetitle}
                                                        </div>  
                                                    </NavLink>
                                                    :
                                                    <input autoFocus type="text" className="note_input" readOnly={note.readonly} required={true} value={note.notetitle} 
                                                    ref={editInputRef} onChange={(e)=>onChangeEditInput(e, note.notenum)} />
                                                    )
                                                }

                                                {
                                                    edited === false ?
                                                    <div className="note_peniconbox" onClick={() => onClickEditButton(note.notenum, note.notetitle)}><FaPen className="note_penicon" /></div>
                                                    :
                                                    ( note.readonly ?
                                                    <div className="note_peniconbox" onClick={() => onClickEditButton(note.notenum, note.notetitle)}><FaPen className="note_penicon" /></div>
                                                    :
                                                    <button type="button" className="note_check" onClick={() => updateNote(note.notenum)}> 
                                                        <FaRegCheckCircle className="note_checkicon" /> 
                                                    </button>  
                                                    )
                                                }    

                                        </div>

                                        {

                                        visible ?    

                                        <div className="note_xiconbox">
                                            <div className="note_xicon_box" onClick={() => deleteNote(note.notenum)}>
                                                <FaTimes className="note_xicon" />
                                            </div>
                                        </div>
                                        :null

                                        }
                                    </div>
                                )
                            })
                            : null
                    }

                    {

                    inputVisible ?
                    <div className="note" >
                        <div className="noteleftspace"></div>
                        <form onSubmit={insertNote} className="note_inputform">
                            <input type="text" placeholder="추가할 노트의 제목을 입력하세요" className="note_input" required={true} ref={inputRef} value={input} onChange={changeText} />
                            <button type="submit" className="note_check"> <FaRegCheckCircle className="note_checkicon" /></button>
                        </form>
                    </div>
                    :null

                    }

                </div>

            </div>

            <div className="note_innerspace">

                <div className="note_plusbox" onClick={() => setInputVisible(!inputVisible)}>
                    <FaPlus className="note_plusicon" />
                </div>

                <div className="note_trashbox" onClick={() => setVisible(!visible)}>
                    <FaTrashAlt className="note_trash" />
                </div>

            </div>

        </div>

    );

}