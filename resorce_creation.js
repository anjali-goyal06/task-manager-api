const port = process.env.PORT ||3000
console.log(process.env.VAL);
const app = require('./app_file.js')
app.listen(port,()=>console.log('running at port = '+port))

