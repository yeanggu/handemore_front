//import Year from "react-live-clock";
//import Month from "react-live-clock";
import styled from "styled-components";
import React, {useState, useEffect, useRef} from "react";
import moment from 'moment';
import { useSelector } from 'react-redux';
import { FaRunning, FaCheck, FaPen, FaRegCheckCircle, FaPlus, FaTrashAlt, FaTimes } from 'react-icons/fa';
import axios from "axios";
import './Todo.css';

export default function Todo() {

    const memberid = useSelector((state) => state.memberid);

    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");
    const [edited, setEdited] = useState(false);
    const [newText, setNewTest] = useState(todos.todotitle); // 새로운 아이템 내용
    const [visible, setVisible] = useState(false);
    const [inputVisible, setInputVisible] = useState(false);
    const [getMoment, setMoment]=useState(moment());     
    const [readonly, setReadonly] = useState(true);

    const today = getMoment; 

    const editInputRef = useRef(null);
    const inputRef = useRef(null);

    
    const onClickEditButton = (e, todonum, todotitle)=>{
        console.log("onClickEditButton==>"+todonum);
        setNewTest(todotitle);
        setTodos(todos.map( (todo) =>
        todo.todonum === todonum ? { ...todo, readonly:false } : { ...todo, readonly:true }
        ));
        //console.log(e.target.parentNode.previousSibling);//포커스 이동할 태그가 input 인지 확인
        // this.parentNode.firstChild.focus();//포커스 이동
        // editInputRef.current.focus();
       
        setEdited(true);
        console.log(edited); 
    };

    const onChangeEditInput = (e, todonum) => { 
        setNewTest(e.target.value);
        setTodos(todos.map( (todo) =>
        todo.todonum === todonum ? { ...todo, todotitle:e.target.value } : todo
        )) ;         
        
       // e.target.focus();
        //editInputRef.current.readOnly = false;
        //editInputRef.current.disabled = false;
        // editInputRef.current.focus();      
        //console.log("onChangeEditInput==>"+ ":"+editInputRef.current.readOnly+":"+e.target.value);
    };


    // useEffect(() => { // edit 모드일때 포커싱을 한다. 
    //     if (!readonly) { 
    //         editInputRef.current.focus(); 
    //     } 
    // }, [edited]);

    useEffect(() => { 
        if (inputVisible) { 
            inputRef.current.focus(); 
        } 
    }, [inputVisible]);

    useEffect(() => {
        getTodos();
    }, [memberid,today]);

    async function getTodos() {
        await axios
            .get("/handemore/todo", { params: { memberid, today }})
            .then((response) => {
                setTodos(response.data);
                setEdited(false);
                console.log(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    function insertTodo(e) {
        e.preventDefault();

        const insertTodo = async () => {
            await axios
                .post("/handemore/insert/todo", {
                    memberid: memberid,
                    todotitle: input,
                    today : today
                })
                .then((response) => {
                    console.log(response.data)
                    setTodos("");
                    getTodos();
                    setEdited(false);
                    setInput("");
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        insertTodo();
        console.log("할일이 추가됨!");
    }

    function updateTodo(todonum) {
        console.log(todonum);
        const updateTodo = async () => {
            await axios
                .put("/handemore/todo/" + todonum, {})
                .then((response) => {
                    console.log(response.data)
                    //setTodos("");
                    getTodos();
                    setEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        updateTodo();
    }

    function iconChange(todonum) {
        console.log(todonum);
        const iconChange = async () => {
            await axios
                .put("/handemore/todo/icon/" + todonum, {})
                .then((response) => {
                    console.log(response.data);
                    //setTodos("");
                    getTodos();
                    setEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        iconChange();
    }

    function deleteTodo(todonum) {
        console.log(todonum);
        const deleteTodo = async () => {
            await axios
                .delete("/handemore/todo/delete/" + todonum, {})
                .then((response) => {
                    console.log(response.data);
                    setTodos(
                        todos.filter((todo) => todo.todonum !== todonum)
                    );
                    //getTodos();
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        deleteTodo();
    }

    function updateText(todonum){ 
        console.log(newText);
        console.log(todonum);
        const updateText = async () => {
            await axios
                .post("/handemore/updatetext/" + todonum, {
                    'todotitle' : newText
                })
                .then((response) => {
                    console.log(response.data)
                    //setTodos("");
                    getTodos();
                    setEdited(false);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        updateText();
        setEdited(false);

        /* const nextTodoList = todos.map((todo) => ({
         ...todo, 
         todotitle: todo.todonum === todonum ? newText : todo.todotitle // 새로운 아이템 내용을 넣어줌 
        })); 
        setTodos(nextTodoList); // 새로운 리스트를 넣어줌  
        setEdited(false);
        */
    };

    function changeText(e) {
        e.preventDefault();
        setInput(e.target.value);
        console.log(input);
    }

    return (
        <div className="all_todo">

            <div className="todo_datebox">
                <div className="todo_movedate" 
                    onClick={() => {setMoment(getMoment.clone().subtract(1, 'day')) 
                                   setEdited(false)}}>◀</div>
                <div className="todo_date">
                <span>{today.format('YYYY.MM.DD(ddd)')}</span>
                </div>
                <div className="todo_movedate" 
                    onClick={() => {setMoment(getMoment.clone().add(1, 'day'))
                                    setEdited(false)}}>▶</div>
            </div>

            <div className="Todo">

                <div className="todobox">

                    {
                        todos
                            ? todos.map((todo) => {
                                return (
                                    <div className="todo" key={todo.todonum}>
                                        <div className="todoicon">
                                            <div className="todo_iconchangebox" onClick={() => iconChange(todo.todonum)} >
                                                {
                                                    todo.todostate === 0 ? null :
                                                        todo.todostate === 1 ? <FaRunning className="todo_iconchange" /> : <FaCheck className="todo_iconchange" />
                                                }

                                            </div>
                                        </div>
                                        <div className="todo_listbox">
                                                { 
                                                    edited === false?  
                                                    <label
                                                        className={todo.todostate === 2 ? "todocompleted" : "todostate"}
                                                        onClick={() => updateTodo(todo.todonum)}>
                                                        {todo.todotitle}
                                                    </label>  
                                                    :
                                                    ( todo.readonly ?
                                                    <label
                                                        className={todo.todostate === 2 ? "todocompleted" : "todostate"}
                                                        onClick={() => updateTodo(todo.todonum)}>
                                                        {todo.todotitle}
                                                    </label>  
                                                    :
                                                    <input autoFocus type="text" required={true} className="todo_input" readOnly={todo.readonly} value={todo.todotitle} 
                                                    ref={editInputRef} onChange={(e)=>onChangeEditInput(e, todo.todonum)} />
                                                    )
                                                }

                                                {
                                                    edited === false ?
                                                    <div className="todo_peniconbox" onClick={(e) => onClickEditButton(e, todo.todonum, todo.todotitle)}><FaPen className="todo_penicon" /></div>
                                                    :
                                                    ( todo.readonly ?
                                                    <div className="todo_peniconbox" onClick={(e) => onClickEditButton(e, todo.todonum, todo.todotitle)}><FaPen className="todo_penicon" /></div>
                                                    :
                                                    <button type="button" className="todo_check" onClick={() => updateText(todo.todonum)}> 
                                                        <FaRegCheckCircle className="todo_checkicon" /> 
                                                    </button>  
                                                    )
                                                }    

                                        </div>

                                        {

                                        visible ?    

                                        <div className="todo_xiconbox">
                                            <div className="todo_xicon_box" onClick={() => deleteTodo(todo.todonum)}>
                                                <FaTimes className="todo_xicon" />
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
                    <div className="todo" >
                        <div className="todoicon">
                            <div className="todo_iconchangebox"></div>
                        </div>
                        <form onSubmit={insertTodo} className="todo_inputform">
                            <input type="text" placeholder="추가할 TODO LIST를 작성하세요." className="todo_input" required={true} ref={inputRef} value={input} onChange={changeText} />
                            <button type="submit" className="todo_check"> <FaRegCheckCircle className="todo_checkicon" /></button>
                        </form>
                    </div>
                    :null

                    }

                </div>

            </div>

            <div className="todo_innerspace">

                <div className="todo_plusbox" onClick={() => setInputVisible(!inputVisible)}>
                    <FaPlus className="todo_plusicon" />
                </div>

                <div className="todo_trashbox" onClick={() => setVisible(!visible)}>
                    <FaTrashAlt className="todo_trash" />
                </div>

            </div>

        </div>

    );

}