const mongoose=require('mongoose')

//mongoURL :'mongodb://localhost:27017/fullstack',
const connectDB=()=>{
    const conn=mongoose.connect(process.env.mongoURL,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology: true 

    });
    console.log(`MongoDB Connected: ${connectDB.connect}`);
    
}



module.exports=connectDB