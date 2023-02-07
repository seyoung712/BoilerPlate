import axios from 'axios';
import {
    LOGIN_USER
} from './types';

 //loginUser : LoginPage.js에서 정해놓은 action
export function loginUser(dataToSubmit){

    //state에 저장한 것을 서버에 보냄 (body)
    const request = axios.post('/login', dataToSubmit) // DB (server/index.js)
        //서버에서 받은 data를 request에 저장
        .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: request
    }
}