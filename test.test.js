const { userOneid, userOne, setupDatabase} = require('./db.js')

const app = require('./app_file.js')
const mongoose = require('mongoose')
const request = require('supertest')
const Task = require('./validation_code.js')

beforeEach(setupDatabase)

test('task',async()=>{
    await request(app)
    .delete('/user/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        description:'do breakfast'
    })
    .expect(200)
})