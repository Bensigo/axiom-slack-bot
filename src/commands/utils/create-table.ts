import { Entry, QueryResult } from "@axiomhq/axiom-node";
import nodeHtmlToImage from "node-html-to-image";
import { JSDOM } from "jsdom";




export async function createTableBuffer(matches: Entry[]| undefined) {
  if (!matches)return;
    const firstRow = matches?.[0];
    const { data, ...rest } = firstRow || {};
    const headers = [...Object.keys(rest), ...Object.keys(data || {})];
    const rows = matches?.map((row: any) => {
      const { data, ...rest } = row || {};
      const rowValues = [...Object.values(rest), ...Object.values(data || {})];
      return rowValues;
    });

         // Calculate the height of the table based on the number of rows
  const numRows = rows ? rows.length : 0;
  const tableHeight = Math.max(numRows * 50 + 150, 1000);
  
    const html = `
      <html>
        <head>
          <style>
            body {
                width: 2480px;
               height: ${tableHeight}px;
              padding: 50px;
              background-color: #F5F5F5;
            }
            
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 30px;
            }
            
            th, td {
              padding: 8px;
              text-align: left;
              border: 1px solid #ddd;
              white-space: normal;
              max-width: 300px;
              overflow-wrap: break-word;
            }
            
            th {
              background-color: black;
              color: white;
              height: 20px;
              vertical-align: middle;
            }
            
            td {
             line-height: 1.2em;
              vertical-align: top;
            }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                {{#each headers}}
                  <th>{{this}}</th>
                {{/each}}
              </tr>
            </thead>
            <tbody>
              {{#each rows}}
                <tr>
                  {{#each this}}
                    <td>{{this}}</td>
                  {{/each}}
                </tr>
              {{/each}}
            </tbody>
          </table>
        </body>
      </html>
    `;
  
    const buffer = await nodeHtmlToImage({ html, content: { headers, rows } });
  
    return buffer as Buffer;
  }
  
  
  

