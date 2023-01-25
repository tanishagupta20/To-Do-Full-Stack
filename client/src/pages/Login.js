import React, {useRef} from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const username = useRef()
  const password = useRef()
  const navigate = useNavigate()

  async function loginUser() {
    const user = {
      username: username.current.value,
      password: password.current.value
    }

    const data = {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(user)
    }

    const res = await fetch('/auth/login', data)
    const response = await res.json()
    if (response.error == false) {
      navigate('/todo')
    }
    else {
      alert(response.message)
    }
  }
  return (
    <div className='login-parent'>
            Username : <input type = "text" ref = {username} id='usn-in' name = "usn"/><br></br>
            Password : <input type = "password" ref = {password} id='pwd-in' name = "pwd"/><br></br>
            <button id = "sub-btn-in" onClick={loginUser}>Submit</button><br></br>

            Already have an account? <a href = '/signup'>Register</a>
    </div>
  )
}

export default Login