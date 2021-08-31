const express=require('express');
const { getBootcamps,createbootcamp,updatebootcamp,deletebootcamp,getBootcampsInRadius,getBootcamp,bootcampPhotoUpload} = require('../controllers/bootcamps.');
const Bootcamp=require('./../models/Bootcamp')
const advancedResults=require('./../middleware/advancedResults')
//const Bootcamp=require('./../models/Bootcamp')
const router=express.Router()
const{protect,authorize}=require('../middleware/auth')

// include resource route

const courseRouter=require('./courses');
const reviewRouter=require('./reviews')

// Re route into other resource router
router.use('/:bootcampId/courses',courseRouter)
router.use('/:bootcampId/reviews',reviewRouter)

router.get('/',advancedResults(Bootcamp,'Courses'),getBootcamps)
router.get('/:id',getBootcamp)
router.post('/',protect,createbootcamp)
router.put('/:id',protect,authorize('publisher', 'admin'),updatebootcamp)
router.delete('/:id',protect,authorize('publisher', 'admin'),deletebootcamp)
router.get('/radius/:zipcode/:distance',getBootcampsInRadius)
router.put('/:id/photo',protect,bootcampPhotoUpload)



// or we can use
//router.route('/').get(getbootcamp).post(createbootcamp)





module.exports=router;
