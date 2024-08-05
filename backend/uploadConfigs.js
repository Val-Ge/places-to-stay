//importing dependencies
import multer, { diskStorage } from 'multer';
import { extname } from 'path';

//setting up storage configuration
const storage = diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now( )+ extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

export default upload;
