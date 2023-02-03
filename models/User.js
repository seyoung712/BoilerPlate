const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 //암호화
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})


//비밀번호 암호화
userSchema.pre('save', function( next ) {
    var user = this; //userSchema를 가리킴

    if(user.isModified('password')) {

        //비밀번호 암호화(bcrypt에서 가져온 코드)
        bcrypt.genSalt(saltRounds, function (err, salt){
            if(err) return next(err) //에러 발생 시 next 이용하여, index.js의 err로 보내줌

            //user.password : 입력하는 비밀번호를 가져오기(위 userSchema의 password에서)
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err) //에러 발생 시 index.js의 err로 보내줌
                user.password = hash //성공 시 password를 hash된 password로 바꿔줌

                next() //index.js로 돌아가기
            }) 
        })
    } else { //비밀번호 외의 정보를 변경할 때
        next() //必
    }
}) //userSchema.pre


//*비밀번호가 맞는 비밀번호인지 확인(index.js)*
userSchema.methods.comparePassword = function(plainPassword, cb) {

    //plainPassword와 암호화된 DB의 비밀번호가 같은지 체크하기
    //따라서, plainPassword를 암호화한 후 DB의 비밀번호와 같은지 확인
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch) // -> index.js의 isMatch로 이동!
    })
} //comparePassword


//*비밀번호까지 맞다면, 토큰을 생성(index.js)*
userSchema.methods.generateToken = function (cb) {

    var user = this; //es5 문법

    // jsonwebtoken을 이용해서 token을 생성하기
    var token =  jwt.sign(user._id.toHexString(), 'secretToken')

    //user._id + 'secretToken' = token  -> 결합하여 토큰을 만들고
    //token 해석 시, secretToken를 넣으면 user._id를 알 수 있음 (누군지 알 수 있음)

    // userSchema의 token 필드에 넣어주기
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err) //에러 발생 시 에러 전달
        cb(null, user) //에러 없을 경우 user정보만 전달 => index.js의 user로 이동!
    })

} //userSchema


//*Token을 복호화(index.js / auth.js)*
userSchema.statics.findByToken = function ( token, cb ) { //token 가져옴
    var user = this;

    //토큰을 decode 한다(verify)
    jwt.verify(token, 'secretToken', function(err,decoded) {  //secretToken : 위에서 생성한 토큰
    
        //유저 아이디를 이용하여 유저를 찾은 다음에
        //Client에서 가져온 token과 DB에 보관된 token이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function(err,user){
            if(err) return cb(err);
            cb(null, user)
        })

    })//jwt.verify
} //userSchema.statics.findByToken


const User = mongoose.model('User', userSchema) //userSchema를 model로 감싸줌

module.exports= { User } //다른 파일에서도 사용할 수 있도록 설정