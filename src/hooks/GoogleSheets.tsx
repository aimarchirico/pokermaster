import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FetchSheetsResponse,
  FetchSpreadsheetsResponse,
  Spreadsheet,
  FetchDataResponse,
  Sheet,
  ApiRequest,
  CreateSpreadsheetResponse,
} from "../types/SpreadsheetTypes";
import { getISOWeekNumber } from "../utils/dateUtils";
import { usePlayers } from "../contexts/PlayersContext";
import useGoogleSignin from "./GoogleSignin";
import { useSpreadsheet } from "../contexts/SpreadsheetContext";

const useGoogleSheets = () => {
  const { auth } = useAuth();
  const { spreadsheet, setSpreadsheet } = useSpreadsheet();
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]);
  const { setPlayers } = usePlayers();
  const { refreshToken } = useGoogleSignin();

  const request = async ({ retryOnError = true, url, method = "GET", data, token = auth?.accessToken}: ApiRequest) => {
    if (!token) {
      throw Error("User is not signed in.");
    }
    
    const response = await fetch(`${url}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(data && { body: JSON.stringify(data) }),
    });
    if (!response.ok) {
      if (!retryOnError) {
        console.log(response);
        throw Error(`API Error: ${response.statusText}`);
      }
      const newToken = await refreshToken();
      return request({retryOnError: false, url, method, data, token: newToken}); 
    }
    return response.json();
  };

  const createSpreadsheet = async (cols: number, name: string = 'Untitled spreadsheet'): Promise<string> => {
    const response: CreateSpreadsheetResponse = await request({
      url: 'https://sheets.googleapis.com/v4/spreadsheets',
      method: 'POST',
      data: {
        properties: {
          title: name,
        },
        sheets: [
          {
            properties: {
              title: 'input',
              gridProperties: {
                columnCount: cols,
                rowCount: 1000
              }
            }
          }
        ]
      }
    });
    setSpreadsheet({ id: response.spreadsheetId, name: name });
    return response.spreadsheetId;
  }

  const fetchSpreadsheets = async (filter: string = ""): Promise<void> => {
    const query = encodeURIComponent(
      `name contains '${filter}' and mimeType='application/vnd.google-apps.spreadsheet'`
    );
    const response: FetchSpreadsheetsResponse = await request({
      url: `https://www.googleapis.com/drive/v3/files?q=${query}`,
    });
    setSpreadsheets(response.files || []);
  };

  const fetchSheets = async (
    currentSpreadsheetId: string = spreadsheet?.id 
  ): Promise<Sheet[]> => {
    const response: FetchSheetsResponse = await request({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${currentSpreadsheetId}`,
    });
    return response.sheets || [];
  };

  const fetchData = async (
    range: string,
    currentSpreadsheetId: string = spreadsheet?.id
  ): Promise<string[][]> => {
    const response: FetchDataResponse = await request({
      url: `https://sheets.googleapis.com/v4/spreadsheets/${currentSpreadsheetId}/values/input!${range}?valueRenderOption=FORMULA`,
    });
    return response.values || [];
  };

  const postData = async (
    range: string,
    values: string[][],
    currentSpreadsheetId: string = spreadsheet?.id
  ): Promise<void> => {
    await request({
      method: "PUT",
      url: `https://sheets.googleapis.com/v4/spreadsheets/${currentSpreadsheetId}/values/input!${range}?valueInputOption=USER_ENTERED`,
      data: {
        range: `input!${range}`,
        majorDimension: "ROWS",
        values,
      },
    });
  };

  const getNextEmptyRow = async (
    currentSpreadsheetId: string = spreadsheet?.id
  ): Promise<number> => {
    const response = await fetchData("A:A", currentSpreadsheetId);
    return (response.length || 0) + 1;
  };

  const appendData = async (
    data: string[],
    currentSpreadsheetId: string = spreadsheet?.id
  ): Promise<void> => {
    const row = await getNextEmptyRow(currentSpreadsheetId);
    const range = `A${row}:${row}`;
    postData(
      range,
      [[getISOWeekNumber(new Date()).toString(), ...data]],
      currentSpreadsheetId
    );
  };

  const selectSpreadsheet = async (
    newSpreadsheetId: string,
    newSpreadsheetName: string
  ): Promise<void> => {
    const sheets = await fetchSheets(newSpreadsheetId);
    const inputSheet = sheets.find(
      (sheet) => sheet.properties.title === "input"
    );
    if (!inputSheet) {
      throw Error(
        "Invalid format: Spreadsheet must contain a sheet named input."
      );
    }
    const response = await fetchData("B1:1000", newSpreadsheetId);
    const headers = response[0];
    if (JSON.stringify(headers) !== JSON.stringify(headers.sort())) {
      throw Error(
        "Invalid format: First row must contain names in alphabetical order starting from cell B1."
      );
    }
    const totals = headers.map((_, colIndex) =>
      response
        .slice(1)
        .reduce((sum, row) => sum + (parseFloat(row[colIndex]) || 0), 0)
    );
    const sum = totals.reduce((a, b) => a + b, 0);
    if (sum !== 0) {
      throw Error(
        `Invalid format: Sum equals ${sum}. Please ensure totals for each column add up to zero.`
      );
    }
    setSpreadsheet({ id: newSpreadsheetId, name: newSpreadsheetName });
    setPlayers(
      headers.map((name, i) => ({
        name,
        balance: totals[i],
      }))
    );
  };

  return {
    spreadsheets,
    createSpreadsheet,
    fetchSpreadsheets,
    selectSpreadsheet,
    fetchData,
    postData,
    appendData,
  };
};

export default useGoogleSheets;
