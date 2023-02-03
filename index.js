const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require("./config/key");


const {User} = require('./models/User');

//application/x-www-form-urlencoded를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));

//aplication/json으로 된 것을 분석해 가져옴
app.use(bodyParser.json());


//MongoDB 연결 (config/dev.js)
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected'))
.catch((e) => console.log('MongoDB error: ', e));


app.get('/', (req, res) => {
  res.send('Hello World!, 새해 복 많이 받으세요.')
})

//회원가입을 위한 Router
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})