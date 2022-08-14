import { Routes, Route, NavLink, Link } from "react-router-dom";
import React, { useState, useEffect, useRef, useParams, Component } from "react";
import moment from 'moment';
import { useSelector } from 'react-redux';
import { FaRunning, FaCheck, FaStar, FaPen, FaRegCheckCircle, FaPlus, FaTrashAlt, FaTimes } from 'react-icons/fa';
import axios from "axios";
import Oxnote from "./Oxnote";
import './Detail_study.css';
import './Detail_ox.css';


export default function Oxnotefunction() {
    const memberid = useSelector((state) => state.memberid);

    const [details, setDetails] = useState([]);
    const [oxdetails, setOxDetails] = useState([]);
    const [input, setInput] = useState("");
    const [edited, setEdited] = useState(false);
    const [newText, setNewTest] = useState(details.detailtitle); // 새로운 아이템 내용
    const [visible, setVisible] = useState(false);
    const [inputVisible, setInputVisible] = useState(false);
    const [getMoment, setMoment] = useState(moment());
    const [readonly, setReadonly] = useState(true);

    const today = getMoment;

    const editInputRef = useRef(null);
    const inputRef = useRef(null);

    const onClickEditButton = (e, detailnum, detailtitle) => {
        console.log("onClickEditButton==>" + detailnum);
        setNewTest(detailtitle);
        setDetails(details.map((detail) =>
            detail.detailnum === detailnum ? { ...detail, readonly: false } : { ...detail, readonly: true }
        ));

        setEdited(true);
        console.log(edited);
    };

    const onChangeEditInput = (e, detailnum) => {
        setNewTest(e.target.value);
        setDetails(details.map((detail) =>
            detail.detailnum === detailnum ? { ...detail, detailtitle: e.target.value } : detail
        ));

    };

    useEffect(() => {
        if (inputVisible) {
            inputRef.current.focus();
        }
    }, [inputVisible]);

    useEffect(() => {
        getDetails();
    }, [memberid]);

    async function getDetails() {
        await axios
            .get("/handemore/oxdetail", { params: { memberid} })
            .then((response) => {
                setOxDetails(response.data);
                setEdited(false);
                console.log(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    function insertDetail(e) {
        e.preventDefault();

        const insertDetail = async () => {
            await axios
                .post("/handemore/insert/detail", {
                    memberid: memberid,
                    detailtitle: input
                })
                .then((response) => {
                    console.log(response.data)
                    setDetails("");
                    getDetails();
                    setEdited(false);
                    setInput("");
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        insertDetail();
        console.log("할일이 추가됨!");
    }

    function updateDetail(detailnum) {
        console.log(detailnum);
        const updateDetail = async () => {
            await axios
                .put("/handemore/detail/" + detailnum, {})
                .then((response) => {
                    console.log(response.data)
                    //setDetails("");
                    getDetails();
                    setEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        updateDetail();
    }

    function iconChange(oxnum) {
        console.log(oxnum);
        const iconChange = async () => {
            await axios
                .put("/handemore/detail/icon/" + oxnum, {})
                .then((response) => {
                    console.log(response.data);
                    //setDetails("");
                    getDetails();
                    setEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        iconChange();
    }

    function deleteDetail(detailnum) {
        console.log(detailnum);
        const deleteDetail = async () => {
            await axios
                .delete("/handemore/detail/delete/" + detailnum, {})
                .then((response) => {
                    console.log(response.data);
                    setDetails(
                        details.filter((detail) => detail.detailnum !== detailnum)
                    );
                    //getDetails();
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        deleteDetail();
    }

    function updateText(detailnum) {
        console.log(newText);
        console.log(detailnum);
        const updateText = async () => {
            await axios
                .post("/handemore/updatetext/" + detailnum, {
                    'detailtitle': newText
                })
                .then((response) => {
                    console.log(response.data)
                    //setDetails("");
                    getDetails();
                    setEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        updateText();
        setEdited(false);
    };

    function changeText(e) {
        e.preventDefault();
        setInput(e.target.value);
        console.log(input);
    }

    return (
        <Oxnote>

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
                                                <div className="ox_detail_iconchangebox" onClick={() => iconChange(detail.oxnum)} >
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
                                                        <label
                                                            className={detail.oxstate === 3 ? "ox_detailcompleted" : "ox_detailstate"}
                                                            onClick={() => updateDetail(detail.oxnum)}>
                                                            {detail.oxtitle}
                                                        </label>
                                                        :
                                                        (detail.readonly ?
                                                            <label
                                                                className={detail.detailstate === 3 ? "ox_detailcompleted" : "ox_detailstate"}
                                                                onClick={() => updateDetail(detail.oxnum)}>
                                                                {detail.oxtitle}
                                                            </label>
                                                            :
                                                            <input autoFocus type="text" className="ox_detail_input" readOnly={detail.readonly} required={true} value={detail.oxtitle}
                                                                ref={editInputRef} onChange={(e) => onChangeEditInput(e, detail.oxnum)} />
                                                        )
                                                }

                                                {
                                                    edited === false ?
                                                        <div className="ox_detail_peniconbox" onClick={(e) => onClickEditButton(e, detail.oxnum, detail.oxtitle)}><FaPen className="ox_detail_penicon" /></div>
                                                        :
                                                        (detail.readonly ?
                                                            <div className="ox_detail_peniconbox" onClick={(e) => onClickEditButton(e, detail.oxnum, detail.oxtitle)}><FaPen className="ox_detail_penicon" /></div>
                                                            :
                                                            <button type="button" className="ox_detail_check" onClick={() => updateText(detail.oxnum)}>
                                                                <FaRegCheckCircle className="ox_detail_checkicon" />
                                                            </button>
                                                        )
                                                }

                                            </div>

                                            {

                                                visible ?

                                                    <div className="ox_detail_xiconbox">
                                                        <div className="ox_detail_xicon_box" onClick={() => deleteDetail(detail.oxnum)}>
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

                            inputVisible ?
                                <div className="ox_detail" >
                                    <div className="ox_detailicon">
                                        <div className="ox_detail_iconchangebox"></div>
                                    </div>
                                    <form onSubmit={insertDetail} className="ox_detail_inputform">
                                        <input type="text" className="ox_detail_input" required={true} ref={inputRef} value={input} onChange={changeText} />
                                        <button type="submit" className="ox_detail_check"> <FaRegCheckCircle className="ox_detail_checkicon" /></button>
                                    </form>
                                </div>
                                : null

                        }

                    </div>

                </div>

                <div className="ox_detail_innerspace">

                    <div className="ox_detail_plusbox" onClick={() => setInputVisible(!inputVisible)}>
                        <FaPlus className="ox_detail_plusicon" />
                    </div>

                    <div className="ox_detail_trashbox" onClick={() => setVisible(!visible)}>
                        <FaTrashAlt className="ox_detail_trash" />
                    </div>

                </div>

            </div>

        </Oxnote>
    );
}
