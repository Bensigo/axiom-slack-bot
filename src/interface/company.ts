import mongoose from "mongoose";


export interface companyDocument extends mongoose.Document {
    team: any
    enterprise?: any;
    user: { [key: string]: any};
    bot?: { [key: string]: any};
    incomingWebhook?: { [key: string]: any}
    appId?: string;
    tokenType?: string;
    enterpriseUrl?: any;
    isEnterpriseInstall?: any
    authVersion?: any;
    metadata?: string;
}