import mongoose from "mongoose";


export interface userDocument extends mongoose.Document {
    teamId?: string;
    axiomOrgId: string;
    exterpriseId?: string;
    axiomToken: string;
    appId: string;
    userId: string;
}