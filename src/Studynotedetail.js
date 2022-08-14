import { BrowserRouter as Router, Routes, Route, NavLink, Link, useParams,useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, Component } from "react";
import moment from 'moment';
import { useSelector } from 'react-redux';
import {FaPen, FaArrowLeft, FaCheck} from 'react-icons/fa';
import axios from "axios";
import Oxnote from "./Oxnote";
import './Content_Detail_study.css';

export default function Detail() {

    const { studynum } = useParams();
    console.log(studynum);


    const memberid = useSelector((state) => state.memberid);

    const [studydetails, setStudyDetails] = useState([]);
    const [studyinput, setStudyInput] = useState("");
    const [studyedited, setStudyEdited] = useState(false);
    const [newStudyText, setNewStudyTest] = useState(studydetails.content);
    const [studyvisible, setStudyVisible] = useState(false);
    const [studyinputVisible, setStudyInputVisible] = useState(false);
    const [getMoment, setMoment] = useState(moment());
    const [readonly, setReadonly] = useState(true);

    const today = getMoment;

    const editInputRef = useRef(null);
    const inputRef = useRef(null);

    const userDate = (studydetails.regdate);
    const navigate = useNavigate();

    const studyonClickEditButton = (e, studynum, content) => {
        console.log("studyonClickEditButton==>" + studynum);
        setNewStudyTest(content);
        setStudyDetails(studydetails.map((detail) =>
            detail.studynum === studynum ? { ...detail, readonly: false } : { ...detail, readonly: true }
        ));

        setStudyEdited(true);
        console.log(studyedited);
    };

    const studyonChangeEditInput = (e, studynum) => {
        setNewStudyTest(e.target.value);
        setStudyDetails(studydetails.map((detail) =>
            detail.studynum === studynum ? { ...detail, content: e.target.value } : detail
        ));

    };


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
            .get("/handemore/studydetailcontent/" + studynum, { params: { memberid } })
            .then((response) => {
                setStudyDetails(response.data);
                setStudyEdited(false);
                console.log(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }


    function studyupdateText(studynum) {
        console.log(newStudyText);
        console.log(studynum);
        const studyupdateText = async () => {
            await axios
                .post("/handemore/studyupdatetextcontent/" + studynum, {
                    content: newStudyText
                    //regdate : today
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
            <div className="content_study_detail_titlebox">
                필기노트
            </div>

            <div className="all_detail">
                {
                    studydetails
                        ? studydetails.map((detail) => {
                            return (
                                <div className="content_study_detail_content">
                                    <div className="content_study_detail_titlebox_two">
                                        <div className="content_study_detail_title">{detail.studytitle}</div>
                                        <div className="content_study_detail_date">{moment(userDate).format('YYYY-MM-DD')}</div>
                                    </div>

                                    <div className="content_study_Detail" key={detail.studynum}>

                                        {
                                            studyedited === false ?
                                                <div className="cotent_study_statebox">
                                                    <div className="cotent_study_state">
                                                        <div className="studytext">
                                                        {detail.content}
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <textarea autoFocus type="text" placeholder="필기노트의 내용을 입력하세요." className="cotent_study_detail_input" readOnly={detail.readonly} required={true} value={detail.content}
                                                    ref={editInputRef} onChange={(e) => studyonChangeEditInput(e, detail.studynum)} />
                                        }

                                    </div>

                                    <div className="content_study_detail_innerspace">

                                        <div className="content_study_detail_editbox" onClick={() => {navigate(-1)}}>
                                            <FaArrowLeft className="content_study_detail_edit"/>
                                        </div>    

                                        {
                                            studyedited === false ?
                                                <div className="content_study_detail_editbox" onClick={(e) => studyonClickEditButton(e, detail.studynum, detail.content, detail.answer)}>
                                                    <FaPen className="content_study_detail_edit" />
                                                </div>
                                                :
                                                <button type="button" className="content_study_detail_check" onClick={() => studyupdateText(detail.studynum)}>
                                                    <FaCheck className="content_study_detail_checkicon" />
                                                </button>
                                        }

                                    </div>

                                </div>
                            )
                        })
                        : null
                }
            </div>
        </div>
    );




}