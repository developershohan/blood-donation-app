import express from 'express';
import { createNewUser, deleteUser, getAllUser, getSingleUser, updateUser } from '../controllers/user.controller.js';
import { userPhoto } from '../utils/multer.js';


const router = express.Router()

// router.get("/", ()=>{
//     console.log(`hello router`);
// })


router.route("/").get(getAllUser).post(userPhoto,createNewUser)
router.route("/:id").get(getSingleUser).delete(deleteUser).put(updateUser).patch(updateUser)
export default router