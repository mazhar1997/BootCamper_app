
const ErrorResponse=require('./../utils/errorResponse')


const errorHandler = (err, req, res, next) => {

    let error = { ...err };
    error.message = err.message;

    console.log(err.stack)
    console.log(err)
    if (err.name=='CastError') {
      const message=  `Resource not found ${err.value}`
      error=new ErrorResponse(message,404);

    }
    if(err.code==11000){
        const message=  `Duplicate Value ${err.keyValue.name}`
        error=new ErrorResponse(message,400);
    }


    res.status(error.statusCode ||500).json({
        success:false,
        error:error.message|| "something went wrong"
    })
    if(error.name=="ValidationError"){
        let msg=object.values(err.errors).map(val=>val.message)
        error=new ErrorResponse(message,400);

    }


}

module.exports=errorHandler


//new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)