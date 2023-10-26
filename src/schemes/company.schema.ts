import mongoose, { Schema } from "mongoose";
import { companyDocument } from "../interface/company";
import { BaseService } from "../services/base";


const companySchema = new mongoose.Schema<companyDocument>({
    enterprise: {
        type: Schema.Types.Mixed
    },
    team: {
        type: Schema.Types.Mixed
    },
    user: {
        type: Schema.Types.Mixed,
        required: true,
    },
    bot: {
        type: Object,
        required: false,
    },
    incomingWebhook: {
        type: Object,
        required: false,
    },
    appId: {
        type: String,
        required: false,
        trim: true
    },
    tokenType:{
        type: String,
        required: false,
        trim: true
    },
    enterpriseUrl: {
        type: String,
        required: false,
        trim: true
    },
    isEnterpriseInstall: {
        type: Boolean,
        required: false,
        trim: true 
    },
    authVersion: {
        type: Object,
        required: false,
        trim: true 
    },
    metadata: {
        type: String,
        required: false,
        trim: true
    }
}, { timestamps: true })

const companyModel = mongoose.model<companyDocument>('company', companySchema)

export const companyService = new BaseService(companyModel);