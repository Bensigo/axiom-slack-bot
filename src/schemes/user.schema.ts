import mongoose from "mongoose";
import { userDocument } from "../interface/user";
import { BaseService } from "../services/base";




const userSchema = new mongoose.Schema<userDocument>({
    appId:{
        type: String,
        required: false,
        trim: true
    },
    exterpriseId: {
        type: String,
        required: false,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
    teamId: {
        type: String,
        required: false,
        trim: true
    },
    axiomOrgId: {
        type: String,
        required: true,
        trim: true
    },
    axiomToken: {
        type: String,
        required: true,
        trim: true
    }
},
  { timestamps: true })

const userModel = mongoose.model<userDocument>('user', userSchema)
export const userService = new BaseService(userModel);