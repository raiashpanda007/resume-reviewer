import {asyncHandler,response} from '../../utils/utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const findPerson = asyncHandler(async (req,res) => {
    const {name} = req.body;
    if(!name) return res.status(400).json(new response (400,"Name is required",null));
    try {
        const person = await prisma.applicant.findMany({
            where:{
                name:{
                    contains:name
                }
            }
        })
        return res.status(200).json(new response(200,"Successfully found person",person));
    } catch (error) {
        console.error("Error finding person:", (error as Error).message);
        return res.status(500).json(new response(500, "Internal Server Error", null));
    }
})

export default findPerson;
