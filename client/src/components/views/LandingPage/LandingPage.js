import React, { useEffect } from 'react'
import axios from 'axios';

function LandingPage() {

  useEffect(() => {
    axios.get('/api/hello') //get request를 서버로 보냄 -> index.js
    .then(response => console.log(response.data)) //돌아온 response를 console에
  }, [])


  return (
    <div style={{
      display:'flex', justifyContent:'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <h2>LandingPage 시작 페이지</h2>
    </div>
  )
}

export default LandingPage
