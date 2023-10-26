
export const defaultMsg = {
    blocks: [
     {
       type: "section",
       text: {
         type: "mrkdwn",
         text: `Hey there 👋 I'm Axiom Bot.I'm here to help you access your axiom dataset in Slack.\n There are two ways to quickly access your dataset:`
       }
     },
     {
       type: 'section',
       text: {
         type: 'mrkdwn',
         text: "1️⃣ Use the `/axiom query` command*. Type `/axiom query`. An example will look like this `/axiom query `"
       }
     },
     {
      type: 'section',
      text: {
        type: "mrkdwn",
        text: "*2️⃣ Use the `/axiom datasets` command*. Type `/axiom list` to get list of all your dataset"
      }
     }
    ]
  }