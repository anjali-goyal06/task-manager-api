const express = require('express')
const app =express()

app.use(express.json())
require('./mongoose_file_validation.js')
const Task = require('./validation_code.js')

app.use(express.json())

const userRouter = require('./router.js')
app.use(userRouter)
module.exports = app
