const express = require('express')
const app =express()

app.use(express.json())
require('./mongoose_file_validation.js')
const Task = require('./validation_code.js')

const port = process.env.PORT 
app.use(express.json())

const userRouter = require('./router.js')
app.use(userRouter)


/*
app.get('/users',(req,res)=>{
    
    Task.find({}).then((users)=>{
        res.send(users)
    }).catch((e)=>{
        console.log(e)
    })
})
*/


app.listen(port,()=>console.log('running at port = '+port))

