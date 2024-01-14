const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
// const handlebars = require('hbs')
const multer = require("multer");
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//set storage 
// const storage = multer.diskStorage({
//   destination: './public/upload',
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

//init multer (upload variable)
// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
//   //limits the file size to 5 megabyte
//   limits: { fileSize: 5000000 }
// }).single('myImage')

//check the file type to make sure it is jpeg, jpg, or png only 
function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png/
  //saves the name of the image into disk storage
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)
  //check the mime type
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only')
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('./public'))

app.use(routes);

    //post request sent to ./uploads
    //the try checks the format of the image and confirms it is either png jpg or jpeg
  //   app.post('/upload', (req, res) => {
  //     upload(req, res, (err) => {
  //         if (err) {
  //             res.render('index', { msg: err }); // Display the error message
  //         } else {
  //             if (req.file == undefined) {
  //                 res.render('index', { msg: 'No file selected' });
  //             } else {
  //                 res.render('index', {
  //                     msg: 'File uploaded successfully',
  //                     file: `/uploads/${req.file.filename}` 
  //                     // This will be the path to the uploaded image
  //                 });
  //             }
  //         }
  //     });
  // });

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
