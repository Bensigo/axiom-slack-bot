import appConfig from "../config"
import { LoggerMessage, logger } from "./logger"


export async function handleBotError(err: any) {
    console.log({ err })
    const error: LoggerMessage = { type: 'uncaught-bot-error', msg: err }
    logger.error(error, appConfig.slackDataset)
}