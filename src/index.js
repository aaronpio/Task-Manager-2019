const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

//--------------------- middleware to check auth token ------------------------------
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET req disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     if (req.method) {
//         res.status(503).send('Site is under maintenance')
//         next()
//     }
// })

//----------------------------------------------------------------------

app.use(express.json())  //parses the postman request into an object
app.use(userRouter)      //gives access to user router file
app.use(taskRouter)      //gives access to task router file

//----------------------------------------------------------------------

app.listen(port, () => {
    console.log('Server is up you crazy guy')
})


// //----------------------------------------
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({_id: '123'}, 'thisismynewcourse', {expiresIn: '1 hour'})
    console.log(token)

    const data = jwt.verify(token, 'thisismynewcourse')
    console.log(data)
}

myFunction()