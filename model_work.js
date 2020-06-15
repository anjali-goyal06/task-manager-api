const mongoose = require('mongoose')
//const Task = require('./validation_code.js')


const workSchema = new mongoose.Schema({
    description : { 
        type : String ,
        required : true,
        trim : true
    },
    complete:  {
        type : String,
        required : true,
        default: false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'task'
    }
},{
    timestamps : true
})
const work = mongoose.model('work',workSchema)

module.exports = work