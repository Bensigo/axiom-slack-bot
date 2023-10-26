import { App, View } from "@slack/bolt";
import appConfig from "../config";
import { isValidAxiomOrgIdAndToken } from "./connect-account.view";
import { userDocument } from "../interface/user";
import { userService } from "../schemes/user.schema";

const homeviewBlock: any = [                  
    {
        type: "input",
        element: {
            type: "plain_text_input",
            action_id: "axiom_apiKey"
        },
        label: {
            type: "plain_text",
            text: "Axiom Api Key ",
            emoji: true
        }
    },
    {
        type: "input",
        element: {
            type: "plain_text_input",
            action_id: "axiom_orgId"
        },
        label: {
            type: "plain_text",
            text: "Axiom OrgId",
            emoji: true
        }
    },
    {
        type: "section",
        text: {
            type: "mrkdwn",
            text: "Authenticate to your axiom account"
        },
        accessory: {
            type: "button",
            style: 'primary',
            text: {
                type: 'plain_text',
                text: 'Authenticate',
                emoji: true
            },
            action_id: 'Authenticate_clicked'
        }
    }

]
export function homeOpened(app: App){
    app.event('app_home_opened', async ({ event, client }) => {
        try {
            await client.views.publish({
              user_id: event.user,
              token: appConfig.slack?.botToken,
              view: {
                type: 'home',
                blocks: homeviewBlock
              },
            });
          } catch (error) {
            console.error('Error publishing home view:', error);
          }
    })
    app.action('Authenticate_clicked', async ({ ack, body, client }) => {
       try {

        ack()
        const customBody = body as any;
        console.log({ body })
        const values = customBody.view.state.values;
        let token;
        let orgId;
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                const inputValues = values[key];
                console.log({ inputValues })
                if (inputValues.axiom_apiKey) {
                    token = inputValues.axiom_apiKey.value;
                  } else if (inputValues.axiom_orgId) {
                    orgId = inputValues.axiom_orgId.value;
                 }
             
            }
        }

        if (!orgId || !token) {
            client.views.update({
                view_id: customBody.view.id,
                view: {
                 type: 'home',
                 blocks: [
                     {
                         type: "input",
                         element: {
                             type: "plain_text_input",
                             action_id: "axiom_apiKey"
                         },
                         label: {
                             type: "plain_text",
                             text: "Axiom Api Key ",
                             emoji: true
                         }
                     },
                     {
                         type: "input",
                         element: {
                             type: "plain_text_input",
                             action_id: "axiom_orgId"
                         },
                         label: {
                             type: "plain_text",
                             text: "Axiom OrgId",
                             emoji: true
                         }
                     },
                     {
                         type: "section",
                         text: {
                             type: "mrkdwn",
                             text: "Authenticate to your axiom account"
                         },
                         accessory: {
                             type: "button",
                            style: 'primary',
                             text: {
                                 type: 'plain_text',
                                 text: 'Authenticate',
                                 emoji: true
                             },
                             action_id: 'Authenticate_clicked'
                         }
                     },
                     {
                         type: "context",
                         elements: [{
                             type: "plain_text",
                             text: "OrgId and Token required.",
                             emoji: true
                         }]
                     }
                 ]
                }
             })
          }
          const isValid = await isValidAxiomOrgIdAndToken(orgId, token);
          if (!isValid) {
            client.views.update({
               view_id: customBody.view.id,
               view: {
                type: 'home',
                blocks: [
                    {
                        type: "input",
                        element: {
                            type: "plain_text_input",
                            action_id: "axiom_apiKey"
                        },
                        label: {
                            type: "plain_text",
                            text: "Axiom Api Key ",
                            emoji: true
                        }
                    },
                    {
                        type: "input",
                        element: {
                            type: "plain_text_input",
                            action_id: "axiom_orgId"
                        },
                        label: {
                            type: "plain_text",
                            text: "Axiom OrgId",
                            emoji: true
                        }
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "Authenticate to your axiom account"
                        },
                        accessory: {
                            type: "button",
                            style: 'primary',
                            text: {
                                type: 'plain_text',
                                text: 'Authenticate',
                                emoji: true
                            },
                            action_id: 'Authenticate_clicked'
                        }
                    },
                    {
                        type: "context",
                        elements: [{
                            type: "plain_text",
                            text: "invalid OrgId and Token.",
                            emoji: true
                        }]
                    }
                ]
               }
            })
          }

          const user: Partial<userDocument> = {
            userId: body.user.id,
            axiomOrgId: orgId,
            axiomToken: token,
            teamId: body.team?.id,
            exterpriseId: body.enterprise?.id,
            appId: customBody.api_app_id,
          }  
          
          await userService.create(user)

       }catch (err){
        // TODO: handle error with slack
        console.log(JSON.stringify(err))
        console.log({ err })

       }
      
    })
}