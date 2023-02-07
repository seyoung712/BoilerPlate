import {
    LOGIN_USER
} from '../_action/types';

export default function (state = {}, action) {
    //다른 type이 올 때마다 다른 문법을 취해야 함
    switch (action.type) { //types.js에서 type을 관리
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload}
            break;
        
        default:
            return state;
    }

}
