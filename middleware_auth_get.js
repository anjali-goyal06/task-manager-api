const Task = require("./validation_code")
const jwt = require('jsonwebtoken')

const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const task1 = await Task.findOne({_id:decoded._id,'tokens.token' : token})
        if(!task1){
            throw new Error()
        }
        req.token1 = token
        req.taskme = task1
        next()
    }catch(e){
        res.status(401).send({error : 'please authenticate'})
    }
}

module.exports = auth