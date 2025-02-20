import {asyncHandler,response} from "../../utils/utils";
import {z as zod} from "zod";
import jsonwebtoken from "jsonwebtoken";
const zodSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
});
const auth = asyncHandler(async (req,res) =>{
    const body = req.body;
    const result = zodSchema.safeParse(body);
    if(!result.success){
        return res.status(400).json(new response(400,"Bad Request",result.error));
    }
    const {username,password} = result.data;
    console.log("Env values",process.env.ID,process.env.PASSWORD);
    
    if(username === process.env.ID && password === process.env.PASSWORD){
        if(!process.env.JWT_SECRET){
            return res.status(500).json(new response(500,"Internal Server Error",null));
        }
        const cookieOptions = {
            httpOnly: true,
            secure: true, 
          };
        const token = jsonwebtoken.sign({username:username},process.env.JWT_SECRET)
        return res.status(200).cookie("jwt",token,cookieOptions).json(new response(200,"Success",{JWT:token}));
    } else {
        return res.status(401).json(new response(401,"Unauthorized",null));
    }

})
export default auth;