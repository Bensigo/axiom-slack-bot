import { IConfig } from '../interface/config';

const appConfig: IConfig = {
    port: parseInt(process.env.PORT as string) || 5000,
    slack: {
        appToken: process.env.SLACK_APP_TOKEN as string,
        signingSecret: process.env.SLACK_SIGNING_SECRET as string,
        botToken: process.env.SLACK_BOT_TOKEN as string,
        clientId: process.env.SLACK_CLIENT_ID as string,
        clientSecret: process.env.SLACK_CLIENT_SECRET as string
    },
    axiom: {
        token: process.env.AXIOM_TOKEN as string,
        orgId: process.env.AXIOM_ORG_ID as string
    },
    slackDataset: process.env.SLACK_DATASET || 'slack-bot',
    db: {
        url: process.env.DB_URI as string, // NOTE: if using mongon cloud we should encode the username and pass
        name: process.env.DB_NAME || 'axiom-slack'
    }

  }


// make config immutable in other module in other to have 
// single source of change
Object.freeze(appConfig)
Object.seal(appConfig)

export default appConfig;