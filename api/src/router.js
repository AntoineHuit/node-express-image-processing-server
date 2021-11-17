const {Router} = require('express')
const multer = require('multer')
const path = require('path');
const imageProcessor = require('./imageProcessor');

const router = Router()

//Pass __dirname and '../../client/photo-viewer.html'.

const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html')


//Let's write a function called filename. It should take request, file, and callback as its parameters.
const filename = (request, file, callback) => {
    //Inside the function body make a call to callback() passing in null as the first argument and file.originalname as the second argument.
    callback(null, file.originalname);
}

/* 
Pass an object literal as the only argument.
 The object literal should have two properties: the first with a key of destination and a value of 'api/uploads/';
 the second with a key of filename and a value of filename. 
*/
const storage = multer.diskStorage({
    destination: "api/uploads/", 
    filename
});

const fileFilter = (request, file, callback) => {
    if (file.mimetype !== "image/png") {
        request.fileValidationError = "Wrong file type"
        callback(null, false, new Error("Wrong file type"))
    } else {
        callback(null, true) 
    }
};

const upload = multer({
    fileFilter,
    storage
});

router.post('/upload', upload.single('photo'), (request, response) => {
    if (request.fileValidationError) return response.status(400).json({error: request.fileValidationError});
    
    return response.status(201).json({success: true});
});

router.get('/photo-viewer', (request, response) => {
    response.sendFile(photoPath);
})

module.exports = router;