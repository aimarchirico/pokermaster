import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FetchSheetsResponse,
  FetchSpreadsheetsResponse,
  Spreadsheet,
  SheetData,
  FetchDataResponse,
  Sheet,
  ApiRequest
} from "../types/SpreadsheetTypes";
import { GoogleAuth } from "../types/AuthTypes";

export const useGoogleSheets = () => {
  const { auth, setAuth } = useAuth();
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]);

  const request = async ({ url, method = 'GET', data }: ApiRequest) => {
    if (!auth?.accessToken) {
      throw new Error('User is not signed in.')
    }
    const response = await fetch(
      `${url}`,
      {
        method,
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json',
        },
        ...(data && { body: JSON.stringify(data) })
      }
    );
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  const fetchSpreadsheets = async (filter: string = ''): Promise<void> => {
    const query = encodeURIComponent(
      `name contains '${filter}' and mimeType='application/vnd.google-apps.spreadsheet'`
    );
    const response: FetchSpreadsheetsResponse = await request({
      url: `https://www.googleapis.com/drive/v3/files?q=${query}`
    })
    setSpreadsheets(response.files || []);
  };

  const fetchSheets = async (spreadsheetId: string = auth?.spreadsheetId): Promise<Sheet[]> => {
    const response: FetchSheetsResponse = await request({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`
    })
    return response.sheets || [];
  };

  const fetchData = async (
    range: string,
    spreadsheetId: string = auth?.spreadsheetId
  ): Promise<string[][]> => {
    const response: FetchDataResponse = await request({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/input!${range}`
    })
    return response.values || [];
  };

  const postData = async (range: string, values: string[][], spreadsheetId: string = auth?.spreadsheetId): Promise<void> => {
    await request({
      method: 'PUT',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/input!${range}?valueInputOption=USER_ENTERED`,
      data: {
        range: `input!${range}`,
        majorDimension: 'ROWS',
        values
      }
    });
  };

  const getNextEmptyRow = async (spreadsheetId: string = auth?.spreadsheetId): Promise<number> => {
    const response = await fetchData('A:A', spreadsheetId);
    return (response.length || 0) + 1;
  }

  const appendData = async (data: string[], spreadsheetId: string = auth?.spreadsheetId): Promise<void> => {
    const row = await getNextEmptyRow(spreadsheetId);
    const range = `A${row}:${row}`;
    postData(range, [["1", ...data]], spreadsheetId)
  }

  const selectSpreadsheet = async (spreadsheetId: string = auth?.spreadsheetId): Promise<void> => {
    const sheets = await fetchSheets(spreadsheetId);
    const inputSheet = sheets.find(
      (sheet) => sheet.properties.title === "input"
    );
    const response = await fetchData("B1:1", spreadsheetId);
    const headers = response[0];
    if (!inputSheet) {
      console.log("Spreadsheet must contain a sheet named input.");
    } else if (JSON.stringify(headers) !== JSON.stringify(headers.sort())) {
      console.log('Headers are invalid.');
    } else {
      const updatedAuth: GoogleAuth = {
        ...auth,
        spreadsheetId: spreadsheetId
      };
      setAuth(updatedAuth);
    }
  };

  return {
    spreadsheets,
    fetchSpreadsheets,
    selectSpreadsheet,
    fetchData,
    postData,
    appendData
  };
};
