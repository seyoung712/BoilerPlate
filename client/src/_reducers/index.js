import { combineReducers } from 'redux';
import user from './user_reducer';


const rootReducer = combineReducers({
    user
})

export default rootReducer; //다른 파일에서 Reducer를 사용할 수 있도록