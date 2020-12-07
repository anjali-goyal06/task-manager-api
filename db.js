const app = require('./app_file.js')
const mongoose = require('mongoose')
const request = require('supertest')
const jwt = require('jsonwebtoken')

const Task = require('./validation_code.js')

const userOneid = new mongoose.Types.ObjectId()
const userOne = {
    _id :  userOneid, 
    name : 'checking',
    email : 'check@gmail.com',
    password : 'checkhhhing',
    tokens: [{
        token : jwt.sign({_id : userOneid}, process.env.JWT_SECRET)
    }]
}

const setupDatabase = async()=> {
    await Task.deleteMany()
    await new User(userOne).save()
}

modules.export = {
    userOneid,
    userOne,
    setupDatabase
}