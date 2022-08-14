import { BrowserRouter as Router, Routes, Route, NavLink, Link, useParams,useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, Component } from "react";
import moment from 'moment';
import { useSelector } from 'react-redux';
import { FaPen, FaCheck, FaArrowLeft } from 'react-icons/fa';
import axios from "axios";
import Oxnote from "./Oxnote";
import './Content_Detail_ox.css';

export default function Detail() {

    const { oxnum } = useParams();
    console.log(oxnum);


    const memberid = useSelector((state) => state.memberid);

    const [oxdetails, setOxDetails] = useState([]);
    const [input, setInput] = useState("");
    const [edited, setEdited] = useState(false);
    const [newText, setNewTest] = useState(oxdetails.question); 
    const [newAnswerText, setNewAnswerTest] = useState(oxdetails.answer);
    const [visible, setVisible] = useState(false);
    const [oxinputVisible, setOxInputVisible] = useState(false);
    const [getMoment, setMoment] = useState(moment());
    const [readonly, setReadonly] = useState(true);

    const today = getMoment;

    const editInputRef = useRef(null);
    const inputRef = useRef(null);


    const userDate = (oxdetails.regdate);
    const navigate = useNavigate();


    const oxonClickEditButton = (e, oxnum, question,answer) => {
        console.log("oxonClickEditButton==>" + oxnum);
        setNewTest(question);
        setNewAnswerTest(answer);
        setOxDetails(oxdetails.map((detail) =>
            detail.oxnum === oxnum ? { ...detail, readonly: false } : { ...detail, readonly: true }
        ));

        setEdited(true);
        console.log(edited);
    };

    const oxonChangeEditInput = (e, oxnum) => {
        setNewTest(e.target.value);
        setOxDetails(oxdetails.map((detail) =>
            detail.oxnum === oxnum ? { ...detail, question: e.target.value } : detail
        ));

    };

    const answeronChangeEditInput = (e, oxnum) => {
        setNewAnswerTest(e.target.value);
        setOxDetails(oxdetails.map((detail) =>
            detail.oxnum === oxnum ? { ...detail, answer: e.target.value } : detail
        ));

    };



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
            .get("/handemore/oxdetailcontent/" + oxnum, { params: { memberid} })
            .then((response) => {
                setOxDetails(response.data);
                setEdited(false);
                console.log(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }


    function oxupdateText(oxnum) {
        console.log(newText);
        console.log(oxnum);
        console.log(today);
        const oxupdateText = async () => {
            await axios
                .post("/handemore/oxupdatetextcontent/" + oxnum, {
                    question : newText,
                    answer :newAnswerText,
                    regdate : today
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




    return (
        <div>
            <div className="content_detail_titlebox">
                오답노트
            </div>

            <div className="all_detail">
                {
                    oxdetails
                        ? oxdetails.map((detail) => {
                            return (
                                <div className="content_ox_detail_content">
                                    <div className="content_detail_titlebox_two">
                                        <div className="content_ox_detail_title">{detail.oxtitle}</div>
                                        <div className="content_ox_detail_date">{moment(userDate).format('YYYY-MM-DD')}</div>
                                    </div>

                                    <div className="content_ox_Detail" key={detail.oxnum}>

                                        {
                                            edited === false ?
                                                <div className="cotent_ox_statebox">
                                                    <div className="cotent_ox_state">
                                                        <div className="text">
                                                        {detail.question}
                                                        </div>
                                                    </div>
                                                    <div className="cotent_ox_state">
                                                        <div className="text">
                                                        {detail.answer}
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div className="cotent_ox_statebox">
                                                    <textarea autoFocus type="text" placeholder="오답노트의 문제를 입력하세요." className="cotent_ox_detail_input" readOnly={detail.readonly} required={true} value={detail.question}
                                                        ref={editInputRef} onChange={(e) => oxonChangeEditInput(e, detail.oxnum)} />
                                                    <textarea type="text" placeholder="오답노트의 정답 및 해설을 입력하세요." className="cotent_ox_detail_input" readOnly={detail.readonly} required={true} value={detail.answer}
                                                        ref={editInputRef} onChange={(e) => answeronChangeEditInput(e, detail.oxnum)} />
                                                </div>

                                        }

                                    </div>

                                    <div className="content_ox_detail_innerspace">

                                        <div className="content_ox_detail_editbox" onClick={() => {navigate(-1)}}>
                                            <FaArrowLeft className="content_ox_detail_edit"/>
                                        </div>    

                                        {
                                            edited === false ?
                                                <div className="content_ox_detail_editbox" onClick={(e) => oxonClickEditButton(e, detail.oxnum, detail.question, detail.answer)}>
                                                    <FaPen className="content_ox_detail_edit" />
                                                </div>
                                                :
                                                <button type="button" className="content_ox_detail_check" onClick={() => oxupdateText(detail.oxnum)}>
                                                    <FaCheck className="content_ox_detail_checkicon" />
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