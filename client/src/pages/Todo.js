import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

function Todo() {

    const [list, setList] = useState([])
    const inputRef = useRef()
    const [usn, setUsn] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (usn == "") {
            initToDo()
        }
    }, [])

    async function initToDo() {
        const res = await fetch('/auth/check')
        const response = await res.json()
        if (response.error == true) {
            navigate('/')
        }
        else {
            setUsn(response.data.username)
            const userTasks = await getUserTasks()
            setList(userTasks)
        }
    }

    async function getUserTasks() {
        const res = await fetch('/api/todo/getTasks')
        const response = await res.json()

        if (response["data"].length == 0) {
            alert("You do not have any tasks yet!")
            return []
        }
        else {
            return response.data.list
        }
    }

    async function addTask() {
        let obj = {
            name: inputRef.current.value,
            isComplete: false,
            edit: false
        }

        const data = {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(obj)
        }

        const res = await fetch('/api/todo/addTasks', data)
        const response = await res.json()

        if (response.error == true) {
            navigate('/')
        }
        else {
            console.log(response.data.list)
            setList(response.data.list)
        }
    }

    async function delTask(task) {
        const data = {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(task)
        }

        const res = await fetch('/api/todo/delTask', data)
        const response = await res.json()

        if (response.error == true) {
            navigate('/')
        }
        else {
            console.log(response.data.list)
            setList(response.data.list)
        }
    }

    function updateEdit(id) {
        let updated = list.map((task) => {
            if (task._id == id) {
                if (task.edit == true) {
                    task.edit = false
                }
                else {
                    task.edit = true
                }
            }

            return task
        })

        console.log(updated)

        setList(updated)
    }

    async function updateTask(event, id) {
        if (event.key == "Enter") {
            const data = {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({_id : id, newVal : event.target.value})
            }
    
            const res = await fetch('/api/todo/updateTask', data)
            const response = await res.json()
    
            if (response.error == true) {
                navigate('/')
            }
            else {
                console.log(response.data.list)
                setList(response.data.list)
            }
        }
    }

    async function logoutApp() {
        const res = await fetch('/auth/todo/logout')
        const response = await res.json()
        if (response.error == false) {
            navigate('/')
        }
    }

    return (
        <div className="todo-parent">
            <div className="todo-input">
                <input
                    type="text"
                    ref={inputRef}
                    placeholder="Enter your task here :)"
                    id="input-task"
                    onKeyDown={(event) => {
                        if (event.key == "Enter") {
                            addTask();
                        }
                    }}
                />
                <button id="add-task-btn" onClick={addTask}>
                    + Add
                </button>
                <button id="todo-logout" onClick={logoutApp}>
                    Logout
                </button>
            </div>
            <div className="todo-list">
                <ol>
                    {list.map((task) => {
                        return (<li>
                            <span>
                                {task.edit == true ? <input placeholder={task.name} onKeyDown={(event) => {
                                    updateTask(event, task._id)
                                }} type="text" /> : task.name} &nbsp; &nbsp;
                            </span>
                            <span onClick={() => {
                                updateEdit(task._id)
                            }}>
                                Edit &nbsp; &nbsp;
                            </span>
                            <span onClick={() => {
                                delTask(task)
                            }}>
                                X
                            </span>
                        </li>)
                    })}
                </ol>
            </div>
        </div>
    );
}

export default Todo;
