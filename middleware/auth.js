const { User } = require("../models/User");

let auth = (req, res, next) => {

    //인증 처리를 하는 곳

    //1. Client 쿠키에서 Token을 가져온다
    let token = req.cookies.x_auth; //x_auth : index.js에서 정의한 쿠키 이름

    //2. Token을 복호화한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        //req에 token과 user를 넣어주는 이유는
        //index.js에서 호출하기에 용이하기 때문
        req.token = token;
        req.user = user;
        next(); //必
    })

    //3. 유저가 있으면 인증 Okay

    //4. 유저가 없으면 인증 No

}

module.exports = { auth };