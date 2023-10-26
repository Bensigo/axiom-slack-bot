import { App, Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";
import Client from "@axiomhq/axiom-node";

import { companyService } from "../schemes/company.schema";
import { createChartBuffer } from "../utils/chart";
import { defaultMsg } from "./reply/default";
import { CommandService } from "./service/command-service";
import { createMarkDownTable } from "./utils/create-markdown-table";
import { createTableBuffer } from "./utils/create-table";
import { userService } from "../schemes/user.schema";
import { userDocument } from "../interface/user";
import { userCredView } from "./reply/user-cred";

const chartOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

function printList(list: any, fn: any) {
  let text = "";
  for (let i = 0; i < list?.length; i++) {
    text += `${i + 1}. ${fn(list[i])} \n`;
  }
  return text;
}

async function getCompanyInstall(command: any) {
  let install;
  if (command.is_enterprise_install && command.enterprise_id !== undefined) {
    install = await companyService.findOne({
      isEnterpriseInstall: true,
      "enterprise.id": command.enterprise_id,
    });
  } else {
    install = await companyService.findOne({ "team.id": command.team_id });
  }
  return install;
}

async function getUserById(userId: string){
  return userService.findOne({ userId });
}






async function listAxiomDataset(client: Client | undefined, say: any) {
  if (!client) {
    throw new Error("unable to connect to axiom client");
  }
  const list = await client?.datasets.list();
  say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "List of avaliable dataset",
        },
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: printList(list, (item: any) => item.name),
        },
      },
    ],
  });
}

export async function axiomCommand(app: App) {
  app.command("/axiom", async ({ client, ack, say, body, command }) => {
    try {
      await ack();
      const user = await getUserById(body.user_id);
      
      if (!user){
        console.log("got here");
       // create a pop up asking user to save their axiom token and orgId
       await client.views.open({
         trigger_id: body.trigger_id,
         view: userCredView
       });
       return;

      }
      const { axiomOrgId, axiomToken } = user as userDocument;
        const commandService = new CommandService(
          client,
          axiomToken,
          axiomOrgId
        );

        const isListDatasetCommand = command.text.startsWith("datasets");
        const isQuery = command.text.startsWith("query");
        if (isListDatasetCommand) {
          // handle list command
          await commandService.listDataset(body.channel_id);
          return;
        }

        if (isQuery) {
          const query = body.text.split("query")[1]?.trim();
          const isChartCompactable = query.includes("summarize");
          const response = await commandService.queryDataset(
            body.channel_id,
            query
          );
          if (response) {
            if (isChartCompactable) {
              // Split response.buckets.series into batches of 20 items each
              // const batches = [];
              // const batchSize = 20;
              const chartData = commandService.prepareData(response.buckets.series)
              if (chartData){
                const buffer = await createChartBuffer({
                  data: chartData,
                  type: "line",
                  options: chartOptions as any,
                 });
                  await client.files.upload({
                  channels: body.channel_id,
                  file: buffer,
                  filename: `chart.png`,
                });
                return;
              }
              // for (let i = 0; i < (response?.buckets.series?.length as number); i += batchSize) {
              //   const batch = response.buckets.series?.slice(i, i + batchSize);
              //   batches.push(batch);
              // }

              // const charts = batches.map(async (batch, index) => {
              //   const chartData = commandService.prepareData(batch)
              //   if (chartData){
              //     const buffer = await createChartBuffer({
              //       data: chartData,
              //       type: "line",
              //       options: chartOptions as any,
              //      });
              //      return client.files.upload({
              //       channels: body.channel_id,
              //       file: buffer,
              //       filename: `chart-${index}.png`,
              //     });
              //   }
              //   return
              // });
              // await Promise.all(charts);
            } else {
              
              if (response?.matches?.length === 0) {
                say('No result found')
                return
              }
              // Split response.matches into batches of 8 items each  
              const batches = [];
              const batchSize = 8;
              for (let i = 0; i < (response?.matches?.length as number);  i += batchSize) {
                const batch = response.matches?.slice(i, i + batchSize);
                batches.push(batch);
              }

              const tables = batches.map(async (batch, index) => {

                const buffer = await createTableBuffer(batch);
                return client.files.upload({
                  channels: body.channel_id,
                  file: buffer,
                  filename: `table-${index}.png`
                })
              })

               await Promise.all(tables)
            }
          }

          return;
        }

        say(defaultMsg);
      
    } catch (err) {
      console.log({ err }, "-----");
    }
  });
}
