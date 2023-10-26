import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

export async function createChartBuffer(opts: ChartConfiguration){
    const height = 400;
    const width = 800;
    const canvas = new ChartJSNodeCanvas({width, height });
    const buffer = await canvas.renderToBufferSync(opts);
    return buffer;
}