import { QueryResult } from "@axiomhq/axiom-node";


export function createMarkDownTable(response: QueryResult){
    const { matches } = response;;
    const firstRow = matches?.[0];
    const { data, ...rest } = firstRow || {}
    const headers =  [...Object.keys(rest), ...Object.keys(data || {})]
    const rows = matches?.map((row: any) => {
        const { data, ...rest } = row || {}
        const rowValues =  [...Object.values(rest), ...Object.values(data || {})]
        return rowValues;
    }) as string[][];

   return generateMarkdownTable(headers, rows)
}

function generateMarkdownTable(header: any[], rows: any[][]) {
    // Determine the maximum length of each column
    const columnLengths = header.map((column, index) => {
      const rowsInColumn = rows.map(row => row[index]);
      const columnWidth = Math.max(column.length, ...rowsInColumn.filter(val => val !== null && val !== undefined).map(value => value.toString().length));
      return columnWidth;
    });
  
    // Construct the markdown table string
    let markdownTable = "|";
    for (let i = 0; i < header.length; i++) {
      const columnWidth = columnLengths[i];
      const column = header[i];
      markdownTable += ` ${column.padEnd(columnWidth, " ")} |`;
    }
    markdownTable += "\n|";
    for (let i = 0; i < header.length; i++) {
      const columnWidth = columnLengths[i];
      markdownTable += ` ${"-".repeat(columnWidth).padEnd(columnWidth, "-")} |`;
    }
    markdownTable += "\n";
    for (let row of rows) {
      markdownTable += "|";
      for (let i = 0; i < row.length; i++) {
        const columnWidth = columnLengths[i];
        const value = row[i];
        const stringValue = (value !== null && value !== undefined) ? value.toString() : "";
        markdownTable += ` ${stringValue.padEnd(columnWidth, " ")} |`;
      }
      markdownTable += "\n";
    }
    markdownTable += "|";
    for (let i = 0; i < header.length; i++) {
      const columnWidth = columnLengths[i];
      markdownTable += ` ${"-".repeat(columnWidth).padEnd(columnWidth, "-")} |`;
    }
    markdownTable += "\n";
    return markdownTable;
  }
  
  