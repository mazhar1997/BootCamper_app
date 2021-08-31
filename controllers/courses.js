const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public


exports.getCourses=asyncHandler(async(req,res,next)=>{
    if (req.params.bootcampId) {
      const courses=await Course.find({bootcamp:req.params.bootcampId})
      return res.status(200).json({
          sucess:true,
          count:courses.length,
          data:courses
      })
        
    }else{
res.status(200).json(res.advancedResults)
    }
    const courses=await query1

    res.status(200).json({
        Sucess:true,
        count:courses.length,
        data:courses


    })
})

exports.getCourse=asyncHandler(async(req,res,next)=>{
const course=await Course.findById(req.params.id).populate({
    path:'bootcamp',
    select:'name description'
})
        
   if (!course) {
    return next(new ErrorResponse(`no course with id of${req.params.id}`,404))
       
   }
    

    res.status(200).json({
        Sucess:true,
        count:course.length,
        data:course


    })
})

exports.addCourse=asyncHandler(async(req,res,next)=>{
req.body.bootcamp=req.params.bootcampId;
req.body.user=req.user.id;

 const bootcamp=await Bootcamp.findById(req.params.bootcampId);
 console.log(`the id of boootcamp is ${bootcamp}`)
 if (!bootcamp) {
    return next(new ErrorResponse(`no course with id of${req.params.id}`,404));
     
 }
 if (bootcamp.user.toString()!==req.user.id && req.user.role !=='admin') {
    return next
    (new ErrorResponse(`User ${req.user.id} is not authorised to add course changes in bootcamp ${bootcamp._id}`, 404))  
    
  }


 const course=await Course.create(req.body)

 res.status(200).json({
    Sucess:true,
    count:course.length,
    data:course


})
})





exports.updateCourse=asyncHandler(async(req,res,next)=>{
    
   // course=await Course.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

   course=await Course.findById(req.params.id)
    if (!course) {
        res.status(400).json({sucess:'couldnot find'})
        
    }
    if (course.user.toString()!==req.user.id && req.user.role !=='admin') {
        return next
        (new ErrorResponse(`User ${req.user.id} is not authorised to update course  in bootcamp ${course._id}`, 404))  
        
      }
      course=await Course.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})


     res.status(200).json({data:course})
    })





    exports.deleteCourse=asyncHandler(async(req,res,next)=>{
    
      const course=await Course.findById(req.params.id)
        if (!course) {
            res.status(400).json({sucess:'couldnot find'})
            
        }
        if (course.user.toString()!==req.user.id && req.user.role !=='admin') {
            return next
            (new ErrorResponse(`User ${req.user.id} is not authorised to delete course  in bootcamp ${course._id}`, 404))  
            
          }


         course.remove()
    
         res.status(200).json({data:{}})
        })