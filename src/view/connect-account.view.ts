import { App } from "@slack/bolt";
import { Connect_Account_Callback_Id, Connect_Account_Org_Id_Action_Id, Connect_Account_Org_Id_Block_Id, Connect_Account_Token_Action_Id, Connect_Account_Token_Block_Id } from "../commands/reply/user-cred";
import  axios from 'axios'
import { userDocument } from "../interface/user";
import { userService } from "../schemes/user.schema";

export function connectAccount(app: App){
app.view(Connect_Account_Callback_Id,   async ({ ack, body, view, client }) => {
   try {
    
    const orgId = view.state.values[Connect_Account_Org_Id_Block_Id][Connect_Account_Org_Id_Action_Id]['value'];
    const token = view.state.values[Connect_Account_Token_Block_Id][Connect_Account_Token_Action_Id]['value'];
    if (!orgId || !token) {
      throw new Error('Please provide a valid orgId and token')
    }
    const isValid = await isValidAxiomOrgIdAndToken(orgId, token);
    if (!isValid) {
      throw new Error('Please provide a valid orgId and token')
    }
    ack()
    // save user's orgId and token in the database
    const user: Partial<userDocument> = {
      userId: body.user.id,
      axiomOrgId: orgId,
      axiomToken: token,
      teamId: body.team?.id,
      exterpriseId: body.enterprise?.id,
      appId: body.api_app_id,
    }
    await userService.create(user)

    
   } catch (error) {
         console.log({ error })
         await ack({
            response_action: 'errors',
            errors: {
              [Connect_Account_Org_Id_Block_Id]: 'Please provide a valid orgId',
              [Connect_Account_Token_Block_Id]: 'Please provide a valid API key/ personal token',
            }
         }) 
   }
})
} 

export async function isValidAxiomOrgIdAndToken(orgId: string, token: string){
    if (!isValidToken(token))return false;
   // call dataset endpoint with the token and orgId to validate the token and orgId   
   const  resp = await axios(`https://api.axiom.co/v1/datasets`, {
      headers: {
            authorization: `Bearer ${token}`,
            'X-Axiom-Org-ID': orgId,
      }
   })
  return resp.status === 200;
}

function isValidToken(token: string){
  return token.startsWith('xapt-') || token.startsWith('xaat-')
}