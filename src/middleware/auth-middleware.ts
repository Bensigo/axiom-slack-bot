import { InstallURLOptions, Installation, InstallationQuery, Logger } from '@slack/bolt';
import { IncomingMessage, ServerResponse } from 'http';
import appConfig from "../config";
import { logger } from "../utils/logger";
import { extractCokies } from '../utils/extract-cookie';
import { companyService } from '../schemes/company.schema';



export async function beforeRedirection(req: IncomingMessage, res: ServerResponse, options?: InstallURLOptions)  {
    // // get user orgId and token from header
    // const orgId = req.headers['x-org-id']
    // const token = req.headers['x-token']
    // if (!orgId && !token){
    //     logger.error({ type: 'error', msg: 'token and orgId not found'}, appConfig.slackDataset)
    //     return false;
    // }
    // res.setHeader('Set-Cookie', [ 
    //     `orgId=${orgId};  Secure; HttpOnly; Path=/; Max-Age=600`,
    //     `token=${token};  Secure; HttpOnly; Path=/; Max-Age=600`,
    // ])
    return true
}

export async function afterInstallation(installation: Installation, options: InstallURLOptions, req: IncomingMessage, res: ServerResponse) {
  
   const { enterprise, isEnterpriseInstall, team, user } = installation;
   let data: any;
   // check if installed already
   if (isEnterpriseInstall && enterprise?.id !== undefined) {
     data = await companyService.findOne({ isEnterpriseInstall: true, "enterprise.id":  enterprise.id  }); 
   }else {
    data = await companyService.findOne({ "team.id":  team?.id });
   }
   if (data) return true;
   await companyService.create({
    ...installation,
   })
   return true
}

export async function fetchInstallation(installQuery: any, logger?: Logger) {
    let  data;
    if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // get installation by enterpriseId
        data = await companyService.findOne({ isEnterpriseInstall: true, "enterprise.id":  installQuery.enterpriseId })
        console.log({ data })
        return data as any
    }
    if (installQuery.teamId !== undefined) {
        // single team app installation lookup
         data = await companyService.findOne({ "team.id": installQuery.teamId  })
        return data as any;
    }
    throw new Error("Failed fetching installation")
}