import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_action/user_action';

function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); //이 코드가 없다면 버튼을 누를때마다 페이지 새로고침됨

    //state의 내용을 개발자도구 log를 통해 확인
    console.log('Email', Email)
    console.log('Password', Password)

    let body = {
      email: Email,
      password: Password
    }

    //Action을 취하는 단계, loginUser:Action명 (user_action.js)
    dispatch(loginUser(body))
      .then(response => {
        if(response.payload.loginSuccess) {
          props.history.push('/')
        } else {
          alert('Error')
        }
      })
  }



  return (
    <div style={{
      display:'flex', justifyContent:'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
    
      <form style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <br />
        <button>login</button>
      </form>

    </div>
  )
}

export default LoginPage
