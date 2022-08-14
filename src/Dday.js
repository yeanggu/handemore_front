import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import './Dday.css';
import DdayItem from "./DdayItem";

export default function Dday() {
    const [list, setList] = useState([]);
    const memberid = useSelector((state) => state.memberid);
    const [mode, setMode] = useState('READ'); //현재 화면 모드 CREATE, UPDATE, READ, RELOAD
    const [checkedList, setcheckedList] = useState([]);    

    //DdayItem 출력 시 참고하는 상태 변수 create, update, read, reload
    let view = 'read';

    useEffect(() => {
        // if(memberid === 'none'){
        //     console.log("로그아웃 상태");
        //     setList([]); 
        // }
        // else{
        // }
        getlist();
        console.log("목록조회 getlist()실행");
    }, [memberid]);

    //Dday 목록 조회
    function getlist() {
        console.log("====목록조회 getlist()실행");
        axios.get('/handemore/dday/' + memberid)
        .then(function (response) {
            console.log(response.data.length);
            setList(response.data);
        }).catch(function (error) {
            console.error(error)
        });
    }       
     //update할 ddaynum
     let updateNum;

     // mode 별 실행
     if (mode === 'UPDATE') {
         console.log('현재 mode ' + mode);
         view = 'update';
         updateNum = checkedList[0];
     }
     else if(mode ==='READ'){        
         console.log('현재 mode ' + mode);
         console.log('현재 체크list ==== ' + checkedList);
         view = 'read';
     }
     else if(mode ==='RELOAD'){
         console.log('현재 mode ' + mode);
         console.log('현재 체크list ==== ' + checkedList);
         view = 'reload';        
     }

    //체크박스 클릭 이벤트
    const checkHandler = (ddaynum, checked) => {
        if (mode === 'CREATE') { //현재 새 DDAY 작성 중일 경우
            alert('작성중인 NEW D-DAY를 완료해주세요');
        }
        else if (mode === 'UPDATE') { //현재 수정 중일 경우
            alert('수정 ✓ (완료)해주세요');
        }
        else {
            console.log('체크이벤트 실행')

            if(checked){ 
                const checkednum = ddaynum;
                const newCheckList = [...checkedList];
                newCheckList.push(checkednum);
                setcheckedList(newCheckList);
            }else if(!checked && checkedList.find(one => one === ddaynum)){ //체크가 안되어있고 클릭 2번시 체크목록에서 삭제
                const filter = checkedList.filter(one => one !== ddaynum);
                setcheckedList([...filter]);
            }  
        }
    }

    //date 'yyyy-MM-dd'형식으로 변경
    const editDate = (date) => {
        let month = date.getMonth() + 1; //월은 0에서 부터 시작에서 +1
        let day = date.getDate();
        
        //한자리 숫자일 경우 '0'추가
        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;

        return date.getFullYear() + '-' + month + '-' + day;
    }

    //수정 버튼 클릭 했을 경우
    const updateHandler = () => {
        console.log('수정하기 버튼 클릭');

        if (checkedList.length === 1) { //체크 항목 하나일때 수정 실행
            setMode('UPDATE');            
        }
        else if (checkedList.length > 1) {
            alert('체크박스 하나만 선택하세요');
        }
        else if (checkedList.length === 0) {
            alert('수정할 D-DAY를 선택하세요');
        }        
    }
    //DdayItem에서 수정한 항목 내용 받아오기, put 요청
    const onUpdate = (ddaytitle, date) => {
        date = editDate(date);
        console.log(updateNum + " ddaynum update값 부모로 전달 ===== " + ddaytitle + date);
        axios.put('/handemore/dday/', {
            ddaynum: updateNum, ddaytitle: ddaytitle, date: date
        })
        .then(function (response) {
            console.log('update axios 실행 결과 = '+response.data);
            getlist();              
        }).catch(function (error) {
            console.error(error);
        })
        setcheckedList([]);
        setMode('RELOAD');
    }

    //NEW D-DAY 버튼 클릭 이벤트
    const createHandler = () => {
        if (mode === 'UPDATE') { //수정 중에 new dday 클릭했을 경우
            alert('수정 중입니다 ✓ (완료)해주세요');
        }
        else if (checkedList.length !== 0) {
            alert('현재 체크된 항목이 있습니다. NEW D-DAY를 원하시면 체크를 다 해제해 주세요');
        }  
        else {
            setMode('CREATE');
        }
    }
    //DdayItem에서 create할 내용 받아오기, post 요청
    const onCreate = (ddaytitle, date) => {
        date = editDate(date);
        console.log("create 할 내용 - " + ddaytitle + date);

        axios.post('/handemore/dday/create', {
            memberid: memberid, ddaytitle: ddaytitle, date: date
        })
        .then(function (response) {
            console.log('create axios 실행 결과 = '+response.data);
            getlist();              
        }).catch(function (error) {
            console.error(error);
        })        
        setMode('READ');
    }

    //삭제 버튼 클릭이벤트
    const deleteHandler = () => {
        console.log("삭제 버튼 클릭");
        if (mode === 'UPDATE') { // 수정 중에 삭제 버튼 클릭했을 경우
            alert('수정 중입니다 ✓ (완료)해주세요');
            return;
        }
        if (checkedList.length === 0) {
            alert('삭제할 Dday를 선택하세요');
        }
        else{
            const ddaynums = { ddaynums: checkedList.join(",") };
            axios.get('/handemore/dday/delete', { params: ddaynums })
                .then(function (response) {
                    console.log('delete axios 실행 결과 = ' + response.data);
                    getlist();
                }).catch(function (error) {
                    console.error(error);
            })
            //체크박스 초기화
            setcheckedList([]);
            setMode('RELOAD'); 
        }
    }

    return (
        <div className="ddayContent">
            {console.log('Dday return 실행')}
            <div className="ddayList">
                {
                    list
                        ? list.map((one, index) => ( 
                            <div className="onedday">
                                <div className="oneddayCheckBox">                                
                                    <input type='checkbox' id={one.ddaynum} className="ddaycheckbox" checked={checkedList.includes(one.ddaynum)?true:false} onChange={e => {checkHandler(one.ddaynum, e.target.checked)}}/>                     
                                </div>                           
                                <DdayItem one={one} key={index} view ={view} mode={mode} updateNum={updateNum} onUpdate={onUpdate}/>
                            </div>
                        ))
                        : null
                }
                {
                    mode === 'CREATE' &&
                    <div className="onedday">
                        <div className="oneddayCheckBox">
                            <input type='checkbox' className="ddaycheckbox" disabled/>
                        </div> 
                            <DdayItem view ='create' onCreate={onCreate}></DdayItem>    
                    </div>                
                }
            </div>
            <div className="ddayItem">
                <input type="button" className="ddayBtn" value="NEW D-DAY" onClick={createHandler} />
                <input type="button" className="ddayBtn" value="수정" onClick={updateHandler} />
                <input type="button" className="ddayBtn" value="삭제" onClick={deleteHandler}/>
            </div>            
        </div>
    );
}

