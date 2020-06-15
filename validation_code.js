const mongoose  = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Work = require('./model_work.js')
const userSchema = new mongoose.Schema({
    name : { 
        type : String ,
        required : true,
        trim : true
    },
    age  : {
        type : Number,
        default : 10,
        validate(value){
            if(value<0){
                throw new Error('Age should be +ve')
            }
        }},

    email : {
        type : String,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not correct ')
            }
        }
    },  

    password : {
        type : String,
        required : true,
        minlength : 8
    },
    tokens : [{
        token:{
            type:String,
            required :true
        }
    }]  ,
    avatar:{
        type : Buffer
    }
    },{
        timestamps : true
    })


userSchema.virtual('demo_work',{
    ref:'work',
    localField : '_id',
    foreignField : 'owner'
})

userSchema.statics.findByCredentials = async(email,password)=>{
    const task1 = await task.findOne({email})
   
    if(!task1){
        throw new Error('unable to login')
    }
   
    console.log("pass current = "+password)
    const isMatch = await bcrypt.compare(password,task1.password)
    console.log("ismatch = "+isMatch)
    if(!isMatch){
        throw new Error('unable to login')
    }
   
    return task1
}

userSchema.methods.generateAuthToken = async function(){
   
    const task2 = this
    const token = jwt.sign({_id:task2.id.toString()},process.env.JWT_SECRET)
    task2.tokens = task2.tokens.concat({token})
    await task2.save()
    return token
   
}

userSchema.pre('save',async function(next){
    const taskk = this
 
    if(taskk.isModified('password')){
        taskk.password = await bcrypt.hash(taskk.password,8)
        console.log("bhainkar")
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this

    await Work.deleteMany({owner : user._id})
    next()
})

userSchema.methods.toJSON = function(){
    const user1 = this
    const userObject = user1.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

const task = mongoose.model('task',userSchema)
module.exports = task
