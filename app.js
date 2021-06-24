const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

//Set Storage Engine
const storage = multer.diskStorage({
    //where you want file uploaded
    destination: './public/uploads/',
    //takes in req,actual file and callback
    filename:function(req,file,cb){
        //for call back param1 is error set to null
        //param2 is what you want to call file(input name(in this case myImage)+curent time + file extension(jpeg,gif,jpg))
        cb(null,file.fieldname + '-'+Date.now()+path.extname(file.originalname))
    }
})

//Init upload
const upload = multer({
    storage:storage,
    //optional size limit
    limits:{fileSize:1000000},//1 mega byte
    //setting upload to only take images
    fileFilter:function(req,file,cb){
       checkFileType(file,cb)
    }
}).single('myImage')//if you want to store single files

//check file type
function checkFileType(file,cb){
     // Allowed extensions
     const filetypes = /jpeg|jpg|png|gif/;
     //check extensions
     const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
     //check mime type
     const mimetype = filetypes.test(file.mimetype)
     //check if mime type and extension name are true
     if(mimetype && extname){
         return cb(null,true)
     }else{
         cb('Error: Images Only')
     }
}

//init app
const app = express()

//EJS
app.set('view engine','ejs')

// Public folder
app.use(express.static('./public'))

app.get('/',(req,res)=>res.render('index'))

app.post('/upload',(req,res)=>{
    //call upload method
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{
                msg:err
            })
        }else{
            if(req.file == undefined){
                res.render('index',{
                    msg:'Error: No File Selected'
                })
            }else{
                res.render('index',{
                    msg:'File Uploaded!',
                    file:`uploads/${req.file.filename}`
                })
            }
        }
    })
})

const port = 3000
app.listen(port,()=>console.log(`Server started on port ${port}...`))