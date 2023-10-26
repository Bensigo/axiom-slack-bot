import { createAxiomClient } from "./axiom";
import appConfig from "../config";


export type LoggerMessage =  {
  type: string,
  msg: any 
}


class Logger {
    private axiomClient;
    constructor(){
        const { axiom} = appConfig;
        this.axiomClient = createAxiomClient(axiom?.token, axiom?.orgId )
    }

    info(msg: {[key: string]: any}, id?: string ){
        this.publishToAxiom(msg, id)
        console.log(`Bot Info::`, msg)
    }

    error(msg: {[key: string]: any}, id?: string ){
        this.publishToAxiom(msg, id)
        console.log(`Bot error::  ${msg.msg}`)
    }

    private publishToAxiom(msg: {[key: string]: any}, id?: string){
        if (this.axiomClient && id){
            (async (client) => {
              // await client.ingestEvents(id, [ msg ])
            })(this.axiomClient)
          }
    }
}

export const logger = new Logger();