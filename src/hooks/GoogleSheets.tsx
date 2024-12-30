import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FetchSheetsResponse,
  FetchSpreadsheetsResponse,
  Spreadsheet,
  FetchDataResponse,
  Sheet,
  ApiRequest
} from "../types/SpreadsheetTypes";
import { GoogleAuth } from "../types/AuthTypes";
import { getISOWeekNumber } from "../utils/dateUtils";
import { usePlayers } from "../contexts/PlayersContext";
import { Player } from "../types/PlayerTypes";

const useGoogleSheets = () => {
  const { auth, setAuth } = useAuth();
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]);
  const { setPlayers } = usePlayers();

  const request = async ({ url, method = 'GET', data }: ApiRequest) => {
    if (!auth?.accessToken) {
      throw Error('User is not signed in.')
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
      console.log(response)
      throw Error(`API Error: ${response.statusText}`);
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
      url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/input!${range}?valueRenderOption=FORMULA`
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
    postData(range, [[getISOWeekNumber(new Date()).toString(), ...data]], spreadsheetId)
  }

  const selectSpreadsheet = async (spreadsheetId: string, spreadsheetName: string): Promise<void> => {
    const sheets = await fetchSheets(spreadsheetId);
    const inputSheet = sheets.find(
      (sheet) => sheet.properties.title === "input"
    );
    if (!inputSheet) {
      throw Error ("Invalid format: Spreadsheet must contain a sheet named input.");
    } 
    const response = await fetchData("B1:1000", spreadsheetId);
    const headers = response[0];
    if (JSON.stringify(headers) !== JSON.stringify(headers.sort())) {
      throw Error ("Invalid format: First row must contain names in alphabetical order starting from cell B1.");
    }
    const totals = headers.map((_, colIndex) => 
      response.slice(1).reduce((sum, row) => sum + (parseFloat(row[colIndex]) || 0), 0));
    const sum = totals.reduce((a,b) => a+b,0);
    if (sum !== 0) {
      throw Error(`Invalid format: Sum equals ${sum}. Please ensure totals for each column add up to zero.`)
    }
    const updatedAuth: GoogleAuth = {
      ...auth,
      spreadsheetId,
      spreadsheetName
    };
    setAuth(updatedAuth);
    setPlayers(headers.map((name, i) => new Player(name,totals[i])))
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

export default useGoogleSheets;