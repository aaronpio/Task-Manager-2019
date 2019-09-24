const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())  //parses the postman request into an object
app.use(userRouter)      //gives access to user router file
app.use(taskRouter)      //gives access to task router file

//----------------------------------------------------------------------

app.listen(port, () => {
    console.log('Server is up you crazy mofo')
})


//----------------------------------------
const bcrypt = require('bcryptjs')

const myFunction = async () => {
 const pass = 'red12345!'
 const hashedPass = await bcrypt.hash(pass, 8)

    console.log(pass)
    console.log(hashedPass)

    const isMatch = await bcrypt.compare('red12345!', hashedPass)
    console.log(isMatch)
}

myFunction()