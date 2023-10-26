import { App, SlackActionMiddlewareArgs } from "@slack/bolt";
import { QUERY_VIEW_CALLBACK_ID, QUERY_ACTION } from "./config";
import { QUERY_INPUT_BLOCK_ID, QUERY_INPUT_ACTION_ID } from "../ui/query-input";
import { queryAxiomDataset } from "./utils/query-fn";
import { createAxiomClient } from "../utils/axiom";
import { companyService } from "../schemes/company.schema";




export function queryDatasetView(app: App) {
    app.view(QUERY_VIEW_CALLBACK_ID, async ({ ack, client, body, context,view }) => {
        try {
        await ack();
        const query = view.state.values[QUERY_INPUT_BLOCK_ID][QUERY_INPUT_ACTION_ID]['value'];
        const channelID = body.user.id
        if (!query){
            client.chat.postMessage({
                channel: channelID,
                text: "Invalid query sent"
            })
        }else {

            let install;
            if (body.is_enterprise_install && body.enterprise?.id !== undefined){
                install  = await companyService.findOne({ isEnterpriseInstall: true, "enterprise.id":  body.enterprise.id  }); 
              }else {
                install  = await companyService.findOne({  "team.id":  body.team?.id }); 
              }
           ;
            const axiomClient = install?.axiomToken && install?.axiomOrgId
              ? await createAxiomClient(install.axiomToken, install.axiomOrgId)
              : null;
              if (!axiomClient) {
                throw new Error("axiom orgId and token not found");
              } 
           
            queryAxiomDataset(channelID, axiomClient, query, client)
            

        }
        
        
       

        }catch(err){
            console.log({ err })
        }
    })
}


