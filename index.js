const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Seyoung:1234qaz@cluster0.ueso7yi.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('MongoDB Connected'))
.catch((e) => console.log('MongoDB error: ', e));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})