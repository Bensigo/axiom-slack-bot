import { App, SlackCommandMiddlewareArgs } from '@slack/bolt';
import  { axiomCommand } from './axiom'



export function botCommands(app: App ){
    axiomCommand(app);
}