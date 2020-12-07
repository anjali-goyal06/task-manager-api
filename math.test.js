const app = require('./app_file.js')
const mongoose = require('mongoose')
const request = require('supertest')
const jwt = require('jsonwebtoken')

const Task = require('./validation_code.js')
const { Mongoose } = require('mongoose')




beforeEach(async()=>{
    await Task.deleteMany()
    await new Task(userOne).save()
})


test('signup',async()=>{
    const response =   await request(app).post('/users').send({
        name : "anjali",
        email : "absjcdjb@gmail.com",
        password : "fgdshbhfr"
    }).expect(200)

    const user = await Task.findById(response.body.task._id)
    expect(user).not.toBeNull()

   expect(response.body.task._id).toMatchObject({
       user : {
           name : 'anjali',
           email : 'absjcdjb@gmail.com' 
       },
       token :user.tokens[0].token
   })
})

test('login',async()=>{
    const response =   await request(app).post('/users/login').send({
        email : userOne.email,
        password : userOne.password

    }).expect(200)

    const user = await Task.findById(userOneid)
    expect(response.body.token).toBe(user.tokens[1].token)
})


test('autenticstion test ',async()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})


test('autenticstion failed ',async()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('delete user autenticstion test ',async()=>{
    await request(app)
    .delete('/user/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await Task.findById(userOneid)
    expect(user).toBeNull()
})

test('delete unautenticstion failed ',async()=>{
    await request(app)
    .delete('/user/me')
    .send()
    .expect(401)
})