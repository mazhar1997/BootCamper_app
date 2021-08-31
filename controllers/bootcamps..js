const path=require('path')
const mongoose=require('mongoose')
//const Bootcamp=require('./../models/Bootcamp')
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler=require('./../middleware/async')
const geocoder=require('./../utils/geocoder');







exports.getBootcamps=asyncHandler(async(req,res,next)=>{

res.status(200).json(res.advancedResults) 

})
// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});
exports.createbootcamp=asyncHandler(async(req,res,next)=>{
  req.body.user = req.user.id;
   // Check for published bootcamp
   const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

   // If the user is not an admin, they can only add one bootcamp
   if (publishedBootcamp && req.user.role !== 'admin') {
     return next(
       new ErrorResponse(
         `The user with ID ${req.user.id} has already published a bootcamp`,
         400
       )
     );
   }

    bootcamps=await Bootcamp.create(req.body);
    console.log(req.body)
    res.json({msg:"sucess"})
    

  // res.json({msg:"sucess"})

})
exports.deletebootcamp=async (req,res,next)=>{

    try {

        bootcamp=await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
           return res.status(400).json({sucess:false})
            
        }
        if (bootcamp.user.toString()!==req.user.id && req.user.role !=='admin') {
          return next
          (new ErrorResponse(`User ${req.params.id} is not authorised to make changes`, 404))  
          
        }
         bootcamp.remove()
    
    
         res.status(200).json({data:"deleted"})
         
     } catch (error) {
        next(err)
         
     }

}
exports.updatebootcamp=asyncHandler(async (req,res,next)=>{
      //  bootcamps=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
     let bootcamps=await Bootcamp.findById(req.params.id)

        if (!bootcamps) {
            res.status(400).json({sucess:'couldnot find'})
            
        }
        /// to check the bootccamp ownership

        if (bootcamps.user.toString()!==req.user.id && req.user.role !=='admin') {
          return next
          (new ErrorResponse(`User ${req.params.id} is not authorised to make changes`, 404))  
          
        }
        bootcamps=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    
         res.status(200).json({data:bootcamps})
})

exports.getBootcampsInRadius=asyncHandler(async(req,res,next)=>{
const{zipcode,distance}=req.params
  // get lat long from geo coder
  const loc = await geocoder.geocode(zipcode)

  const lat=  loc[0].latitude;
  const lng = loc[0].longitude;

    // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });

})
// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private

exports.bootcampPhotoUpload=asyncHandler(async(req,res,next)=>{


    const bootcamp=await Bootcamp.findById(req.params.id);
      if (!bootcamp) {
         return next
         (new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))    
      }
      if (bootcamp.user.toString()!==req.user.id && req.user.role !=='admin') {
        return next
        (new ErrorResponse(`User ${req.params.id} is not authorised to make changes`, 401))  
        
      }


  // make sure user is bootcamp owner
   if (!req.files) {
    return next(new ErrorResponse(`please upload a file  ${req.params.id}`, 404))
   }

  // console.log(req.files.file.name)
   const file =req.files.file

     // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // create custom file name
 // console.log(path.parse(file.name).ext);
  file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`
 // console.log(file.name)
 file.mv(`${process.env.File_UPLOAD_PATH}/${file.name}`,async err =>{
   if (err) {
     console.error(err);
     return next(new ErrorResponse( `problem with file upload`,500))
 
   }
   await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
   res.status(200).json({
    success: true,
    data: file.name
   })
 })

  })



