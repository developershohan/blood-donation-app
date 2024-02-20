import multer from "multer"

// multer configuration
const storage = multer.diskStorage({
    filename: (req, file, cb)=>{
        cb(null, Date.now() + "_"+ file.fieldname)
    }
})

// multer middleware configuration
export const userPhoto = multer({storage}).single("user-photo")