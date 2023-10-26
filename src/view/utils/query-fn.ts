import Client, { QueryResult } from "@axiomhq/axiom-node"
import { createChartBuffer } from "../../utils/chart"
import { App } from "@slack/bolt"
import { WebClient } from "@slack/web-api";
import { aggregateData } from "../../commands/utils/aggregate-data";
import { subMinutes } from "./time"

  const chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };




function prepareChartData(response: QueryResult){
  if (response.buckets.series){
    // add support for multiple chart
   const data  = aggregateData(response.buckets.series);
    console.log({ data })
    const chartData = {
      labels: data?.xData || [],
      datasets: [{
        label: data?.yAxisName|| '',
        data: data?.yData || [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    }
    return chartData;
  }  
 
  return;
}  



export async function queryAxiomDataset(userId: string, client: Client | undefined, query: string, slackClient: WebClient){
    if (!client){
      throw new Error('unable to connect to axiom client')
    }
    let isChartCompactable = query.includes("summarize")
    // query the last 30 min
    const response = await client.query(query, {
      startTime: subMinutes(new Date(), 30).toISOString(),
    })
    if (isChartCompactable){
        const chartData =  prepareChartData(response)
       if (chartData){
        const buffer = await createChartBuffer({
          type: 'line',
          data: chartData,
          options: chartOptions as any,
        })
        await slackClient.files.upload({
          channels: userId,
          initial_comment: 'Here is your chart:',
          file: buffer,
          filename: 'chart.png'
        })
       }else {
         await slackClient.chat.postMessage({
          channel: userId,
           text: "query cannot make a graph. please vist your dashboard"
         })
       }
    }
  }