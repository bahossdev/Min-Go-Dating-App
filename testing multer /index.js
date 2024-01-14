const express = require('express')
// const sequelize = require('seq')
const path = require('path')
const handlebars = require('hbs')
const multer = require("multer")


//init app
const app = express()

//handlebars init
app.set('view engine', 'hbs');
app.use(express.static('./public'))

//this one I didn't add yet
app.get('/', (req, res) => res.render('index')) //add this to each indvidual route since they render seperately 

//set storage 
const storage = multer.diskStorage({
        destination: './public/uploads', 
        filename: function (req, file, cb){
            cb(null,file.fieldname + '-' + Date.now)
            path.extname(file.originalname)
        }
}) 

//init multer (upload variable)
const upload = multer({
        storage: storage,
        fileFilter: function(req, file, cb){
            checkFileType(file, cb);
        }, 
        //limits the file size to 5 megabyte
        limits: {fileSize: 5000000}
    }).single('myImage')

    //check the file type to make sure it is jpeg, jpg, or png only 
    function checkFileType (file, cb){
        const fileTypes= /jpeg|jpg|png/
        //saves the name of the image into disk storage
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = fileTypes.test(file.mimetype)
    //check the mime type
        if(mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only')
        }
    }

    //post request sent to ./uploads
    //the try checks the format of the image and confirms it is either png jpg or jpeg
    app.post('/upload', (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                res.render('index', { msg: err }); // Display the error message
            } else {
                if (req.file == undefined) {
                    res.render('index', { msg: 'No file selected' });
                } else {
                    res.render('index', {
                        msg: 'File uploaded successfully',
                        file: `/uploads/${req.file.filename}` 
                        // This will be the path to the uploaded image
                    });
                }
            }
        });
    });


//port to listen
app.listen(3001, () => {
    console.log('connected to port 3001')
});











// //gets path for templates 
// const templatePath = path.join(__dirname, '../templates')

// const storage = multer.diskStorage({
//     destination: './images', 
//     filename: function (req, file, cb){
//         cb(null,file.fieldname + '-' + Date.now)
//         path.extname(file.originalname)
//     }
    
// });
// //init upload
// const uploadedImage = multer({
//     storage: storage
// }).single('myImage')

// //path to get images 
// app.use(express.static(path.join(__dirname, './images')))
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

// app.set("view engine", "ejs")
// app.set("views", templatePath)

// app.get("/", async (req, res) =>{
//     //render the name hbs homepage
//     const data = await collection.find
//     res.render('homepage', {arr:data})
// })

// let array = []

// //allows us to submit a single image f
// app.post("/",uploadedImage.single("image"), async (req, res) => {
//     //the try checks the format of the image and confirms it is either png jpg or jpeg
//     try {
//         if((ff.mimetype).split('/').pop()=='png' || (ff.mimetype).split('/').pop()=='jpg' (ff.mimetype).split('/').pop()=='jpeg' ){

//             data = {
//                 path: ff.originalname
//             }
//             //pushes the data into the empty array
//             arr.path(data)
//             //inserts the data into MONGO 
//             await collection.insertMany({data})
//         }
        
//         //error message for wrong type of file 
//         else {
//             res.send('invalid file')
//         }

//         res.render('homepage', {arr:array})


//     } catch (error) {
//         console.log('unable to upload image')
//     }
// });

// app.listen(3001, () => {
//     console.log('connected to port')
// });