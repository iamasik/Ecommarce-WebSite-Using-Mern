import ErrorHandle from "../Utils/ErrorHandle.js"
function userRole(Role) {
    return ((req,res,next)=>{
        if(req.user.role!==Role){
            return next(new ErrorHandle(`Your role is ${req.user.role}. Not allowed to do this operation`))
        }
        next()
    })
}

export default userRole
