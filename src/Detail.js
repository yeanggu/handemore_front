//import Year from "react-live-clock";
//import Month from "react-live-clock";
//import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, Component } from "react";
import moment from 'moment';
import { useSelector } from 'react-redux';
import { FaRunning, FaCheck, FaStar, FaPen, FaArrowLeft, FaRegCheckCircle, FaPlus, FaTrashAlt, FaTimes } from 'react-icons/fa';
import axios from "axios";
//import { getNotes } from '../../Data';
import Oxnote from "./Oxnote";
import './Detail_study.css';
import './Detail_ox.css';

export default function Detail() {

    const {notenum} = useParams();
    console.log(notenum);
    const {notetitle} = useParams();
    console.log(notetitle);

    const memberid = useSelector((state) => state.memberid);

    const [oxdetails, setOxDetails] = useState([]);
    const [studydetails, setStudyDetails] = useState([]);
    const [input, setInput] = useState("");
    const [studyinput, setStudyInput] = useState("");
    const [edited, setEdited] = useState(false);
    const [studyedited, setStudyEdited] = useState(false);
    const [newText, setNewTest] = useState(oxdetails.oxtitle); // 새로운 아이템 내용
    const [newStudyText, setNewStudyTest] = useState(studydetails.studytitle);
    const [visible, setVisible] = useState(false);
    const [studyvisible, setStudyVisible] = useState(false);
    const [oxinputVisible, setOxInputVisible] = useState(false);
    const [studyinputVisible, setStudyInputVisible] = useState(false);
    const [getMoment, setMoment] = useState(moment());
    const [readonly, setReadonly] = useState(true);

    const today = getMoment;

    const editInputRef = useRef(null);
    const inputRef = useRef(null);

    const navigate = useNavigate();



    const oxonClickEditButton = (e, oxnum, oxtitle) => {
        console.log("oxonClickEditButton==>" + oxnum);
        setNewTest(oxtitle);
        setOxDetails(oxdetails.map((detail) =>
            detail.oxnum === oxnum ? { ...detail, readonly: false } : { ...detail, readonly: true }
        ));

        setEdited(true);
        console.log(edited);
    };
    
    const oxonChangeEditInput = (e, oxnum) => {
        setNewTest(e.target.value);
        setOxDetails(oxdetails.map((detail) =>
            detail.oxnum === oxnum ? { ...detail, oxtitle: e.target.value } : detail
        ));

    };

    function changeText(e) {
        e.preventDefault();
        setInput(e.target.value);
        console.log(input);
    }
    
    useEffect(() => {
        oxDetails();
    }, [memberid]);

    useEffect(() => {
        if (oxinputVisible) {
            inputRef.current.focus();
        }
    }, [oxinputVisible]);

    async function oxDetails() {
        await axios
            .get("/handemore/oxdetail/" + notenum , { params: { memberid} })
            .then((response) => {
                setOxDetails(response.data);
                setEdited(false);
                console.log(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    function oxinsertDetail(e) {
        e.preventDefault();

        const oxinsertDetail = async () => {
            await axios
                .post("/handemore/insert/oxnote/" + notenum, {
                    memberid: memberid,
                    oxtitle: input,
                    notenum : notenum,
                    notetitle : notetitle
                })
                .then((response) => {
                    console.log(response.data);
                    setOxDetails("");
                    oxDetails();
                    setEdited(false);
                    setInput("");
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        oxinsertDetail();
        console.log("할일이 추가됨!");
    }

    function oxupdateDetail(oxnum) {
        console.log(oxnum);
        const oxupdateDetail = async () => {
            await axios
                .put("/handemore/detail/oxnote/" + oxnum, {})
                .then((response) => {
                    console.log(response.data)
                    //setDetails("");
                    oxDetails();
                    setEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        oxupdateDetail();
    }

    function oxiconChange(oxnum) {
        console.log(oxnum);
        const oxiconChange = async () => {
            await axios
                .put("/handemore/oxdetail/icon/" + oxnum, {})
                .then((response) => {
                    console.log(response.data);
                    //setDetails("");
                    oxDetails();
                    setEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        oxiconChange();
    }

    function oxdeleteDetail(oxnum) {
        console.log(oxnum);
        const oxdeleteDetail = async () => {
            await axios
                .delete("/handemore/oxdetail/delete/" + oxnum, {})
                .then((response) => {
                    console.log(response.data);
                    setOxDetails(
                        oxdetails.filter((detail) => detail.oxnum !== oxnum)
                    );
                    //getDetails();
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        oxdeleteDetail();
    }

    function oxupdateText(oxnum) {
        console.log(newText);
        console.log(oxnum);
        const oxupdateText = async () => {
            await axios
                .post("/handemore/oxupdatetext/" + oxnum, {
                    'oxtitle': newText
                })
                .then((response) => {
                    console.log(response.data)
                    //setDetails("");
                    oxDetails();
                    setEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        oxupdateText();
        setEdited(false);
    };
    







    const studyonClickEditButton = (e, studynum, studytitle) => {
        console.log("studyonClickEditButton==>" + studynum);
        setNewStudyTest(studytitle);
        setStudyDetails(studydetails.map((detail) =>
            detail.studynum === studynum ? { ...detail, readonly: false } : { ...detail, readonly: true }
        ));

        setStudyEdited(true);
        console.log(studyedited);
    };

    const studyonChangeEditInput = (e, studynum) => {
        setNewStudyTest(e.target.value);
        setStudyDetails(studydetails.map((detail) =>
        detail.studynum === studynum ? { ...detail, studytitle: e.target.value } : detail
        ));
        
    };
    
    function changeStudyText(e) {
        e.preventDefault();
        setStudyInput(e.target.value);
        console.log(studyinput);
    }

    useEffect(() => {
        studyDetails();
    }, [memberid]);

    useEffect(() => {
        if (studyinputVisible) {
            inputRef.current.focus();
        }
    }, [studyinputVisible]);

    async function studyDetails() {
        await axios
            .get("/handemore/studydetail/" + notenum , { params: { memberid} })
            .then((response) => {
                setStudyDetails(response.data);
                setStudyEdited(false);
                console.log(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    function studyinsertDetail(e) {
        e.preventDefault();

        const studyinsertDetail = async () => {
            await axios
                .post("/handemore/insert/studynote/" + notenum, {
                    memberid: memberid,
                    studytitle: studyinput,
                    notenum : notenum,
                    notetitle : notetitle
                })
                .then((response) => {
                    console.log(response.data);
                    setStudyDetails("");
                    studyDetails();
                    setStudyEdited(false);
                    setStudyInput("");
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        studyinsertDetail();
        console.log("할일이 추가됨!");
    }

    function studyupdateDetail(studynum) {
        console.log(studynum);
        const studyupdateDetail = async () => {
            await axios
                .put("/handemore/detail/studynote/" + studynum, {})
                .then((response) => {
                    console.log(response.data)
                    //setDetails("");
                    studyDetails();
                    setStudyEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        studyupdateDetail();
    }

    function studyiconChange(studynum) {
        console.log(studynum);
        const studyiconChange = async () => {
            await axios
                .put("/handemore/studydetail/icon/" + studynum, {})
                .then((response) => {
                    console.log(response.data);
                    //setDetails("");
                    studyDetails();
                    setStudyEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        studyiconChange();
    }

    function studydeleteDetail(studynum) {
        console.log(studynum);
        const studydeleteDetail = async () => {
            await axios
                .delete("/handemore/studydetail/delete/" + studynum, {})
                .then((response) => {
                    console.log(response.data);
                    setStudyDetails(
                        studydetails.filter((detail) => detail.studynum !== studynum)
                    );
                    //getDetails();
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        studydeleteDetail();
    }

    function studyupdateText(studynum) {
        console.log(newStudyText);
        console.log(studynum);
        const studyupdateText = async () => {
            await axios
                .post("/handemore/studyupdatetext/" + studynum, {
                    'studytitle': newStudyText
                })
                .then((response) => {
                    console.log(response.data)
                    //setDetails("");
                    studyDetails();
                    setStudyEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        studyupdateText();
        setStudyEdited(false);
    };




    return (
        <div>
            <div className="detail_titlebox">
                <div className="detail_historybox" onClick={() => {navigate(-1)}}>
                    <FaArrowLeft className="detail_history"/>
                </div>
                <div className="detail_titlebox">
                    {notetitle} 
                </div>
                <div className="detail_space"></div>    
            </div>

        <div className="all_detail">

            <div className="ox_detail_content">
                <div className="ox_detail_titlebox">
                    오답노트
                </div>

                <div className="ox_Detail">

                    <div className="ox_detailbox">

                        {
                            oxdetails
                                ? oxdetails.map((detail) => {
                                    return (
                                        <div className="ox_detail" key={detail.oxnum}>
                                            <div className="ox_detailicon">
                                                <div className="ox_detail_iconchangebox" onClick={() => oxiconChange(detail.oxnum)} >
                                                    {
                                                        detail.oxstate === 0 ? null
                                                            : detail.oxstate === 1 ? <FaRunning className="ox_detail_iconchange" /> 
                                                            : detail.oxstate === 2 ? <FaStar className="ox_detail_iconchange" />
                                                            : <FaCheck className="ox_detail_iconchange" />
                                                    }

                                                </div>
                                            </div>
                                            <div className="ox_detail_listbox">
                                                {
                                                    edited === false ?
                                                        <NavLink to={`/oxdetail/${detail.oxnum}`} style={{textDecoration: 'none',color: "black"}}>
                                                            <div className={detail.oxstate === 3 ? "ox_detailcompleted" : "ox_detailstate"}
                                                                /* onClick={() => oxupdateDetail(detail.oxnum)} */>
                                                                {detail.oxtitle}
                                                            </div>
                                                        </NavLink>
                                                        :
                                                        (detail.readonly ?
                                                            <NavLink to={`/oxdetail/${detail.oxnum}`} style={{textDecoration: 'none',color: "black"}}>
                                                                <div className={detail.oxstate === 3 ? "ox_detailcompleted" : "ox_detailstate"}
                                                                    /* onClick={() => oxupdateDetail(detail.oxnum)} */>
                                                                    {detail.oxtitle}
                                                                </div>
                                                            </NavLink>
                                                            :
                                                            <input autoFocus type="text" className="ox_detail_input" readOnly={detail.readonly} required={true} value={detail.oxtitle}
                                                                ref={editInputRef} onChange={(e) => oxonChangeEditInput(e, detail.oxnum)} />
                                                        )
                                                }

                                                {
                                                    edited === false ?
                                                        <div className="ox_detail_peniconbox" onClick={(e) => oxonClickEditButton(e, detail.oxnum, detail.oxtitle)}><FaPen className="ox_detail_penicon" /></div>
                                                        :
                                                        (detail.readonly ?
                                                            <div className="ox_detail_peniconbox" onClick={(e) => oxonClickEditButton(e, detail.oxnum, detail.oxtitle)}><FaPen className="ox_detail_penicon" /></div>
                                                            :
                                                            <button type="button" className="ox_detail_check" onClick={() => oxupdateText(detail.oxnum)}>
                                                                <FaRegCheckCircle className="ox_detail_checkicon" />
                                                            </button>
                                                        )
                                                }

                                            </div>

                                            {

                                                visible ?

                                                    <div className="ox_detail_xiconbox">
                                                        <div className="ox_detail_xicon_box" onClick={() => oxdeleteDetail(detail.oxnum)}>
                                                            <FaTimes className="ox_detail_xicon" />
                                                        </div>
                                                    </div>
                                                    : null

                                            }
                                        </div>
                                    )
                                })
                                : null
                        }

                        {

                            oxinputVisible ?
                                <div className="ox_detail" >
                                    <div className="ox_detailicon">
                                        <div className="ox_detail_iconchangebox"></div>
                                    </div>
                                    <form onSubmit={oxinsertDetail} className="ox_detail_inputform">
                                        <input type="text" placeholder="오답노트의 제목을 입력하세요." className="ox_detail_input" required={true} ref={inputRef} value={input} onChange={changeText} />
                                        <button type="submit" className="ox_detail_check"> <FaRegCheckCircle className="ox_detail_checkicon" /></button>
                                    </form>
                                </div>
                                : null

                        }

                    </div>

                </div>

                <div className="ox_detail_innerspace">

                    <div className="ox_detail_plusbox" onClick={() => setOxInputVisible(!oxinputVisible)}>
                        <FaPlus className="ox_detail_plusicon" />
                    </div>

                    <div className="ox_detail_trashbox" onClick={() => setVisible(!visible)}>
                        <FaTrashAlt className="ox_detail_trash" />
                    </div>

                </div>

            </div>



            <div className="study_detail_content">
                <div className="study_detail_titlebox">
                    필기노트
                </div>

                <div className="study_Detail">

                    <div className="study_detailbox">

                        {
                            studydetails
                                ? studydetails.map((detail) => {
                                    return (
                                        <div className="study_detail" key={detail.studynum}>
                                            <div className="study_detailicon">
                                                <div className="study_detail_iconchangebox" onClick={() => studyiconChange(detail.studynum)} >
                                                    {
                                                        detail.studystate === 0 ? null 
                                                        : detail.studystate === 1 ? <FaRunning className="study_detail_iconchange" /> 
                                                        : detail.studystate === 2 ? <FaStar className="study_detail_iconchange" />
                                                        : <FaCheck className="study_detail_iconchange" />
                                                    }

                                                </div>
                                            </div>
                                            <div className="study_detail_listbox">
                                                {
                                                    studyedited === false ?
                                                        <NavLink to={`/studydetail/${detail.studynum}`} style={{textDecoration: 'none',color: "black"}}>
                                                            <div
                                                                className="study_detailstate" /* {detail.detailstate === 2 ? "study_detailcompleted" : "study_detailstate"} */
                                                                onClick={() => studyupdateDetail(detail.studynum)}>
                                                                {detail.studytitle}
                                                            </div>
                                                        </NavLink>
                                                        :
                                                        (detail.readonly ?
                                                            <NavLink to={`/studydetail/${detail.studynum}`} style={{textDecoration: 'none',color: "black"}}>
                                                                <div
                                                                    className="study_detailstate" /* {detail.detailstate === 2 ? "study_detailcompleted" : "study_detailstate"} */
                                                                    onClick={() => studyupdateDetail(detail.studynum)}>
                                                                    {detail.studytitle}
                                                                </div>
                                                             </NavLink>
                                                            :
                                                            <input autoFocus type="text" className="study_detail_input" readOnly={detail.readonly} required={true} value={detail.studytitle}
                                                                ref={editInputRef} onChange={(e) => studyonChangeEditInput(e, detail.studynum)} />
                                                        )
                                                }

                                                {
                                                    studyedited === false ?
                                                        <div className="study_detail_peniconbox" onClick={(e) => studyonClickEditButton(e, detail.studynum, detail.studytitle)}><FaPen className="study_detail_penicon" /></div>
                                                        :
                                                        (detail.readonly ?
                                                            <div className="study_detail_peniconbox" onClick={(e) => studyonClickEditButton(e, detail.studynum, detail.studytitle)}><FaPen className="study_detail_penicon" /></div>
                                                            :
                                                            <button type="button" className="study_detail_check" onClick={() => studyupdateText(detail.studynum)}>
                                                                <FaRegCheckCircle className="study_detail_checkicon" />
                                                            </button>
                                                        )
                                                }

                                            </div>

                                            {

                                                studyvisible ?

                                                    <div className="study_detail_xiconbox">
                                                        <div className="study_detail_xicon_box" onClick={() => studydeleteDetail(detail.studynum)}>
                                                            <FaTimes className="study_detail_xicon" />
                                                        </div>
                                                    </div>
                                                    : null

                                            }
                                        </div>
                                    )
                                })
                                : null
                        }

                        {

                            studyinputVisible ?
                                <div className="study_detail" >
                                    <div className="study_detailicon">
                                        <div className="study_detail_iconchangebox"></div>
                                    </div>
                                    <form onSubmit={studyinsertDetail} className="study_detail_inputform">
                                        <input type="text" placeholder="필기노트의 제목을 입력하세요." className="study_detail_input" required={true} ref={inputRef} value={studyinput} onChange={changeStudyText} />
                                        <button type="submit" className="study_detail_check"> <FaRegCheckCircle className="study_detail_checkicon" /></button>
                                    </form>
                                </div>
                                : null

                        }

                    </div>

                </div>

                <div className="study_detail_innerspace">

                    <div className="study_detail_plusbox" onClick={() => setStudyInputVisible(!studyinputVisible)}>
                        <FaPlus className="study_detail_plusicon" />
                    </div>

                    <div className="study_detail_trashbox" onClick={() => setStudyVisible(!studyvisible)}>
                        <FaTrashAlt className="study_detail_trash" />
                    </div>

                </div>

            </div>

        </div>
        </div>
    );

}