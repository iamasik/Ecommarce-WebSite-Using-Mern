import mongoose from "mongoose";
 const DabaseConnect=()=>{
    let URL=""
    if(process.env.NODE_ENV==="Development") URL=process.env.DB_LOCAL_URL
    if(process.env.NODE_ENV==="Production") URL=process.env.DB_ONLINE_URL
    
    mongoose.connect(URL).then(conn=>{
        console.log(`Dabase is connected at ${conn?.connection?.host}`);
    }) 
}  
export default DabaseConnect  