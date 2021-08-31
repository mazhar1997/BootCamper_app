const express=require('express')
const User = require('../models/User');
const router = express.Router();
const {register,login,getme,forgotPassword,resetPassword,updateDetails,updatePassword,logout}=require('./../controllers/auth')
const {protect}=require('./../middleware/auth')

router.post('/register',register)
router.post('/login',login)
router.get('/logout', logout);
router.get('/me',protect,getme)
router.post('/forgotPassword',forgotPassword)
router.put('/resetPassword/:resettoken',resetPassword)
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);



module.exports=router;