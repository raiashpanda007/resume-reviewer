import {asyncHandler} from '../utils/utils';
import jwt from 'jsonwebtoken';
const verifyUser = asyncHandler(async (req,res,next) =>{
    if(!req.headers.authorization){
        return res.status(401).json({message:"Unauthorized"});
    }
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    if(!process.env.JWT_SECRET){
        return res.status(500).json({message:"Internal Server Error"});
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({message:"Unauthorized"});
    }
    next();
})


export default verifyUser;