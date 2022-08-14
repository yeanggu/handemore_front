
import React, { useRef, useEffect, useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
import "react-datepicker/dist/react-datepicker.css";
import './DdayItem.css';

//D-day 날짜 계산
function calcDay(setday) {
    const today = new Date();
    const setDay = new Date(setday);
    //console.log("오늘 날짜 - " + today + ", 설정dday - " + setDay);

    let result;
    if (today < setDay) {
        result = 'D - ' + Math.ceil((setDay - today) / (1000 * 60 * 60 * 24));
    }
    else if (today.getMonth() === setDay.getMonth() && today.getDate() === setDay.getDate()) { //오늘 날짜와 설정 날짜가 같은 경우
        result = '⚝ D - Day';
    }
    else {
        result = 'D + ' + Math.floor((today - setDay) / (1000 * 60 * 60 * 24));
    }
    return result;
}

export default function DdayItem({ one, view, mode, updateNum, onCreate, onUpdate, checkHandler }) {

    const titleInputRef = useRef(); //focus할 태그 변수
    //const [isChecked, setChecked] = useState(false); //체크박스
    //datepicker
    const [startDate, setStartDate] = useState(new Date());
    registerLocale("ko", ko);
    //update 할때 변경 내용
    const [titleInput, setTitleInput] = useState(''); //수정 내용

    useEffect(() => {
        console.log('useEffect view = ' + view);
        if (view === 'update' && one.ddaynum == updateNum) {
            console.log('업데이트할 updateNum == ' + updateNum);
            titleInputRef.current.focus(); //수정할 태그 focus

            //수정 전 값 보여주기
            setStartDate(new Date(one.date));
            setTitleInput(one.ddaytitle);
        }
        else if (view === 'create') {
            titleInputRef.current.focus(); //creat 태그 focus
        }
    }, [view]);


    //수정 시 입력되는 변경 값 반영
    const inputHandle = (e) => {
        e.preventDefault();
        setTitleInput(e.target.value);
    }

    //Dday 목록에 D-day 출력
    let dday = null;
    if (view !== 'create') {
        dday = calcDay(one.date);
    }

    return (
        <>
            {console.log('DdayItem return 실행')}
            <form onSubmit={event => {
                event.preventDefault();
                const ddaytitle = event.target.ddaytitle.value;
                const date = startDate;
                if (view === 'create') {
                    console.log('생성 완료 버튼 클릭');
                    onCreate(ddaytitle, date);
                }
                else if (view === 'update') {
                    console.log('수정 완료 버튼 클릭');
                    onUpdate(ddaytitle, date);
                }
            }}>
                <div className='oneddayItem'>
                    <div className="oneddayContent">
                        <div className="oneddayTitle">
                            {   //생성 , 읽기 , 수정할 태그 , 수정 안하는 태그
                                view === 'create' ? 
                                    <input type='text' name="ddaytitle" className="oneddaytitletxt" ref={titleInputRef}></input> :
                                view === 'read' ? 
                                    <div className="oneddaytitletxt">{one.ddaytitle}</div> :
                                updateNum == one.ddaynum ? <input type='text' id={one.ddaynum} name="ddaytitle" className="oneddaytitletxt" value={titleInput} onChange={inputHandle} ref={titleInputRef}></input>
                                : <div className="oneddaytitletxt">{one.ddaytitle}</div>
                            }
                        </div>
                        <div className="oneddayDate">
                            {
                                view === 'create' ?
                                    <div>D - Day</div>
                                    : <div>{dday}</div>
                            }
                            {
                                view === 'create' ?
                                    <DatePicker
                                        dateFormat="yyyy-MM-dd"
                                        locale="ko"
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        className='ddaypicker'
                                        renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled,
                                        }) => (
                                            <div className='ddaypickerHead'>
                                                <div
                                                    className="ddaypickerBtn"
                                                    onClick={decreaseMonth}
                                                    disabled={prevMonthButtonDisabled}
                                                >&#60;</div>
                                                <div className='ddaypickerYM'>
                                                    {date.getFullYear()}년 {date.getMonth() + 1}월
                                                </div>
                                                <div
                                                    className="ddaypickerBtn"
                                                    onClick={increaseMonth}
                                                    disabled={nextMonthButtonDisabled}
                                                >&#62;</div>
                                            </div>
                                        )}
                                    />
                                : view === 'read' ? <div className="ddayDate">{one.date}</div> :
                                    updateNum == one.ddaynum ?
                                        <DatePicker
                                            dateFormat="yyyy-MM-dd"
                                            locale="ko"
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            className='ddaypicker'
                                            renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled,
                                            }) => (
                                                <div className='ddaypickerHead'>
                                                    <div
                                                        className="ddaypickerBtn"
                                                        onClick={decreaseMonth}
                                                        disabled={prevMonthButtonDisabled}
                                                    >&#60;</div>
                                                    <div className='ddaypickerYM'>
                                                        {date.getFullYear()}년 {date.getMonth() + 1}월
                                                    </div>
                                                    <div
                                                        className="ddaypickerBtn"
                                                        onClick={increaseMonth}
                                                        disabled={nextMonthButtonDisabled}
                                                    >&#62;</div>
                                                </div>
                                            )}
                                        />
                                : <div className="ddaypicker">{one.date}</div>
                            }
                        </div>
                    </div>
                    <div className="oneddayBtn">
                        {
                            view === 'create' ?
                                <input type='submit' value="완료" className="ddaySubmitBtn" /> :
                            view !== 'update' ? null :
                            updateNum == one.ddaynum ?
                                <input type='submit' value="&#10004;" className="ddaySubmitBtn" />
                            : null
                        }
                    </div>
                </div>
            </form>
        </>
    );
}