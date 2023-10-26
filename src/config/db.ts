import mongoose, { Mongoose } from "mongoose";
import { logger } from "../utils/logger";
import appConfig from ".";

export let connection: Mongoose;

export async function connectToDb() {
    if (connection) return connection;
    try {
        connection = await mongoose.connect(appConfig.db.url, {
           dbName: appConfig.db.name
          })
          console.log("🛢  DB connected sucessfully!!")
          return connection;
    }catch(err){
        console.log({err})
        logger.error({type: 'error', msg: 'faild to connect to database' }, appConfig.slackDataset);
        setTimeout(()=> {
            process.exit(1)
        }, 1000) // exist after 1 sec to be able to log on axiom
    
        
    }
}