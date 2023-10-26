import { App } from '@slack/bolt';
import * as dotenv from 'dotenv'
import appConfig from './config'
import { app } from './app';
import { connectToDb } from './config/db';

dotenv.config()

const port = appConfig.port;

export async function createBotServer(app: App, port: number){
    await app.start(port)
    console.log("⚡️ Bolt app is running on port:", port);
 }

// start bot server
(async () => {
   await  createBotServer(app, port);
   await connectToDb()
})();
