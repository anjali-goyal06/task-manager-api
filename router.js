const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
require('./mongoose_file_validation.js')
const auth = require('./middleware_auth_get')
const Task = require('./validation_code.js')
const Work = require('./model_work.js')
const { render } = require('pug')
const work = require('./model_work.js')
const sharp = require('sharp')
const router = new express.Router

app.use(router)

router.get('/users/me',auth, async(req,res)=>{
    res.send(req.taskme)
})

router.post('/users',async(req,res)=>{
       const task = new Task(req.body)
     await task.generateAuthToken()
    task.save().then(() =>{

        res.send({task,token1})
        console.log(task)
    }).catch((error)=>{
        console.log('error')
        res.send('eroor is there ')
    })
    
})

router.post('/work',auth,async(req,res)=>{
    const work = new Work({
        ...req.body,
        owner : req.taskme._id
    })
 work.save().then(() =>{
     res.send(work)
    
 }).catch((error)=>{
     console.log('error')
     res.send('error is there ')
 })
 
})

router.post('/users/login',async(req,res)=>{
    try{
        const user = await Task.findByCredentials(req.body.email,req.body.password)
        console.log("checked")
        const token = await user.generateAuthToken()
    
        res.send({user,token})
    }catch(e){
        res.send("error")
    }
})

router.post('/user/logout',auth,async(req,res)=>{

   try{
       console.log("1")
        req.taskme.tokens = req.taskme.tokens.filter((token)=>{
        return token.token!== req.token1
    })

    await req.taskme.save()
    res.send()
   }catch(e){
        res.status(500).send()
   }

})


router.post('/user/logoutAll',auth,async(req,res)=>{
    try{
        req.taskme.tokens = []
        await req.taskme.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})


router.delete('/user/me',auth,async(req,res)=>{
    try{
        await req.taskme.remove()
        console.log('a')
        res.send(req.taskme)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
   
   /* const allowUpdates = ['name','age','password','email']

    const isValidOperation = updates.every((update)=>{
        allowUpdates.includes(update)
    })
console.log("valid = "+isValidOperation)
if(!isValidOperation){
    return res.status(400).send({error : 'invalid update'})
}
*/
    try{
        updates.forEach((update)=>{
            req.taskme[update] = req.body[update]

        })

        await req.taskme.save()
        res.send(req.taskme)
        
    }catch(e){
        res.status(400).send(e)
    }
})


router.patch('/users/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    try{
        const task = await Task.findById(req.params.id)

        updates.forEach((update)=>{
            task[update] = req.body[update]

        })

        await task.save()
       
        if(!task){
            return res.status(400).send()
        }

        console.log(task)
    }catch(e){
        res.status(400).send(e)
    }
})

const main = async()=>{
   /* const work1 = await Work.findById('5ee4feea83d0eb17186c6227')
    await work1.populate('owner').execPopulate()
    console.log(work1.owner)

    */

    const user3  = await Task.findById('5ee4d9695832d6a42ccac3da')
    await user3.populate('demo_work').execPopulate()
    console.log(user3.demo_work)
}
//main()


const multer = require('multer')
const upload = multer({
   
    limits : {
        fileSize : 10000000
    },

    fileFilter(req,file,cb){
        if(!file.originalname.endsWith('.jpg')){
            return new Error('please uplaod file with jpg format')
        }
        cb(undefined,true)
    }
})

  

router.post('/upload',auth,upload.single('abc'),async(req,res)=>{ 
    const buffer = await sharp(req.file.buffer).resize({width : 50 , height:50}).png().toBuffer()
   
    req.taskme.avatar = buffer
   
    await req.taskme.save() 
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error : 'error,message'})
})


router.get('/user/:id/profile',async(req,res)=>{
    try{
        const user = await Task.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(500).send({error : 'error is there'})
    }
})

router.get('/work',auth,async(req,res) =>{
    try{
        await req.taskme.populate('demo_work').execPopulate()
        res.send(req.taskme.demo_work)
    }catch(e){
        res.status(500).send()
    }
})


router.get('/work/:id',auth,async(req,res) =>{
    try{
        const work = await Work.findOne({_id : req.params.id, owner : req.taskme._id})

        if(!work){
            return res.status(404).send()
        }

        res.send(work)
    }catch(e){
        res.status(500),send()
    }
})


router.patch('/work/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    try{
        const work = await Work.findOne({_id : req.params.id, owner : req.taskme._id})
        if(!work){
            return res.status(404).send()
        }
      
        updates.forEach((update)=>{
            work[update] = req.body[update]
        })
        await work.save()
       res.send(work)
    }catch(e){
        res.status(400).send(e)
    }
})


router.delete('/work/:id',auth,async(req,res)=>{
    try{
        const work = await Work.findOneAndDelete({_id : req.params.id, owner : req.taskme._id})
        if(!work){
            return res.status(404).send()
        }
        res.send('deleted sucessfully')
    }catch(e){
        res.status(400),send(e)
    }
})


module.exports = router