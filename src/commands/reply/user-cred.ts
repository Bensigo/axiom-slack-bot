import { ModalView } from "@slack/bolt";

export const Connect_Account_Callback_Id = "Connect_Account_Callback_Id"
export const Connect_Account_Org_Id_Block_Id = "Connect_Account_Org_Id_Block_Id"
export const Connect_Account_Token_Block_Id = "Connect_Account_Token_Block_Id"
export const Connect_Account_Org_Id_Action_Id  = "Connect_Account_Org_Id_Action_Id"
export const Connect_Account_Token_Action_Id = "Connect_Account_Token_Action_Id"

export const userCredView: ModalView = {
    type: "modal",
    callback_id: Connect_Account_Callback_Id,
    title: {
        type: "plain_text",
        text: "Connect To Axiom",
    },
    blocks: [
        {
            type: "input",
            block_id: Connect_Account_Org_Id_Block_Id,
            element: {
                type: "plain_text_input",
                placeholder: {
                    type: "plain_text",
                    text: "axiom",
                },
                action_id: Connect_Account_Org_Id_Action_Id,
            },
            label: {
                type: "plain_text",
                text: "Enter your Axiom org id",
            }
        
        },
        {
            type: "input",
            block_id: Connect_Account_Token_Block_Id,
            element: {
                type: "plain_text_input",
                action_id: Connect_Account_Token_Action_Id,
                placeholder: {
                    type: "plain_text",
                    text: "xaat-22f10450-526a-45da-b668-ea04b71c4daf",
                }
            },
            label: {
                type: "plain_text",
                text: "Enter your Axiom API key",
            }
        
        }
    ],
    submit: {
        type: "plain_text",
        text: "Submit",

    }
}