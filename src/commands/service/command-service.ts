import Client, { Interval, QueryResult } from "@axiomhq/axiom-node";
import { createAxiomClient } from "../../utils/axiom";
import { query } from "express";
import { subMinutes } from "../../view/utils/time";
import { aggregateData } from "../utils/aggregate-data";
import { createChartBuffer } from "../../utils/chart";



const chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

export class CommandService {
  private app: any;
  private axiomClient: Client | undefined;
  constructor(app: any, axiomToken: string, axiomOrgId: string) {
    this.app = app;
    this.axiomClient = createAxiomClient(axiomToken, axiomOrgId);
  }

  async listDataset(channelID: string) {
    if (!this.axiomClient) {
      await this.app.chat.postMessage({
        channel: channelID,
        text: "Uncaught error, please try again",
      });
      throw new Error("Unable to connect to axiom");
    }

    const list = await this.axiomClient.datasets.list();
    this.app.chat.postMessage({
      channel: channelID,
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
            text: this.printList(list, (item: any) => item.name),
          },
        },
      ],
    });
  }

  async queryDataset(channelID: string, queryStr: string) {
    if (!queryStr) {
      await this.app.chat.postMessage({
        channel: channelID,
        text: "Invalid query sent",
      });
      return;
    }

    const response = await this.axiomClient?.query(queryStr, {
      startTime: subMinutes(new Date(), 30).toISOString(),
    });
    return response;
    // if (isChartCompactable) {
    //   //  prepare a chart
    // } else {
    //   // prepare a table;
    //   if (response?.buckets.series){ 
    //     const tableData = this.prepareData(response);
    //     if (tableData) {
    //        const buffer = await createChartBuffer({
    //         type: 'line',
    //         data: tableData,
    //         options: chartOptions as any,
    //        })
           
    //     }
    //   }
    // }
  }

  async uploadFile(channelID: string, buffer: any) {
    console.log({ file: buffer })
    await this.app.client.files.upload({
      channels: channelID,
      file: buffer,
      filename: 'chart.png',
      initial_comment: 'Here is your file'
  })
  }
  prepareData(intervals: Interval[]|  undefined) {
    if (!intervals) return;
      // add support for multiple chart
      const data = aggregateData(intervals);
      const chartData = {
        labels: data?.xData || [],
        datasets: [
          {
            label: data?.yAxisName || "",
            data: data?.yData || [],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };
      return chartData;
   
  }

  private printList(list: any, fn: any) {
    let text = "";
    for (let i = 0; i < list?.length; i++) {
      text += `${i + 1}. ${fn(list[i])} \n`;
    }
    return text;
  }
}
