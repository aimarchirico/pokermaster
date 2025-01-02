export interface Spreadsheet {
  id: string;
  name: string;
}

export interface Sheet {
  properties: {
    title: string;
  };
}
export interface FetchSpreadsheetsResponse {
  files: Spreadsheet[];
}

export interface FetchSheetsResponse {
  sheets: Sheet[];
}

export interface FetchDataResponse {
  values: string[][];
}

export interface SheetData {
  range: string;
  majorDimension?: "ROWS" | "COLUMNS";
  values: string[][];
}

export interface ApiRequest {
  url: string;
  method?: "GET" | "PUT" | "POST";
  data?: SheetData;
}
