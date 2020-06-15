require('./mongoose_file_validation.js')
const Task = require('./validation_code.js')

Task.findByIdAndUpdate("5edd3fb94c454d73b00c87df",{
    age:7,
    name : "Kavita"
}).then((res)=>{
    console.log(res)
    return Task.countDocuments({name:"Validator"})
}).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})