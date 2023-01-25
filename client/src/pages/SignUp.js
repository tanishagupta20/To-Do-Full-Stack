import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignUp.css';

function SignUp() {
  const username = useRef()
  const name = useRef()
  const email = useRef()
  const password = useRef()
  const navigate = useNavigate()

  async function registerUser() {
    const user = {
      username: username.current.value,
      name: name.current.value,
      email: email.current.value,
      password: password.current.value
    }

    const data = {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(user)
    }

    const res = await fetch('/auth/register', data)
    const response = await res.json()
    if (response.error == false) {
      navigate('/')
    }
    else {
      alert(response.message)
    }
  }

  return (
    <div className='signup-parent'>
      Username : <input type="text" ref={username} id='usn-up' name="usn" /><br></br>
      Name : <input type="text" ref={name} id='name-up' name="name" /><br></br>
      Email : <input type="email" ref={email} id='email-up' name="email" /> <br></br>
      Password : <input type="password" ref={password} id='pwd-up' name="pwd" /><br></br>
      <button id="sub-btn-up" onClick={registerUser}>Submit</button><br></br>

      Back to Login <a href='/'>Login</a>
    </div>
  )
}

export default SignUp