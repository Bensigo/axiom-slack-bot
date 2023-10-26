
export const QUERY_INPUT_BLOCK_ID = "query_input_block"
export const QUERY_INPUT_ACTION_ID = "QUERY_INPUT_ACTION_ID"

export function queryInput(actionId: string) {
  return ({

        "blocks": [
            {
                "type": "input",
                "block_id": QUERY_INPUT_BLOCK_ID,
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": QUERY_INPUT_ACTION_ID
                },
                "label": {
                    "type": "plain_text",
                    "text": "Enter your query",
                    "emoji": true
                }
            }
        ]
  });
}
