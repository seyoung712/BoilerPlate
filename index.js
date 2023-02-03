const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require("./config/key");

const {User} = require('./models/User'); //User 정보 가져오기
const {auth} = require('./middleware/auth'); //인증 처리 (auth.js에서 가져옴)

//application/x-www-form-urlencoded를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));

//aplication/json으로 된 것을 분석해 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

//*MongoDB 연결 (config/dev.js)*
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected'))
.catch((e) => console.log('MongoDB error: ', e));


app.get('/', (req, res) => {
  res.send('Hello World!, 새해 복 많이 받으세요.')
})


//*회원가입을 위한 Router*
app.post('/register', (req, res) => {

    //회원가입에 필요한 정보들을 Client에서 가져오면 DB에 저장
    const user = new User(req.body)
    //user에 저장
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})


//*login 기능*
app.post('/login', (req, res) => {
    //1. 요청된 이메일을 DB에 있는지 찾기
    User.findOne({ email: req.body.email }, (err, user) => {
        //만약 해당 이메일을 가진 유저가 한명도 없다면, user 없을 것임
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        //2. 요청된 이메일이 DB에 있다면, 비밀번호가 맞는 비밀번호인지 확인(User.js)
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) //isMatch가 없다면, 비밀번호가 틀렸다는 의미
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            
            //3. 비밀번호까지 맞다면, 토큰을 생성(User.js)
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err); //status(400) : 에러 & send(err) : 에러메시지
                
                //현재 user에 토큰이 저장됨 (User.js의 코드로)
                //토큰을 저장한다. 어디에?  -> 쿠키!
                    res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    
    }) //User.findOne

}) //app.post(login)


//*auto route 만들기*
app.get('/api/users/auth', auth, (req, res) => {

    //여기까지 미들웨어를 통과했다는 것은, Authentication=true 라는 의미
    res.status(200).json({

        //원하는 유저 정보를 제공
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
            //role=0 : 일반유저, role!=0 : 관리자로 설정
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image

    })

}) //app.get(auth)


//*로그아웃 route 만들기*
app.get('/api/users/logout', auth, (req, res) => {
    
    User.findByIdAndUpdate({ _id: req.user._id },
        { token: "" } //token을 지워줌
        , (err, user) => {
            if(err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
    })
}) //app.get(logout)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})