import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FetchSheetsResponse,
  FetchSpreadsheetsResponse,
  Spreadsheet,
  SheetData,
  FetchDataResponse,
} from "../types/SpreadsheetTypes";
import { GoogleAuth } from "../types/AuthTypes";
import { usePlayers } from "../contexts/PlayersContext";

export const useGoogleSheets = () => {
  const { auth, setAuth } = useAuth();
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]);
  const { players } = usePlayers();

  const fetchSpreadsheets = async (filter: string): Promise<void> => {
    if (!auth?.accessToken) {
      console.error("No access token available.");
      return;
    }

    try {
      const query = encodeURIComponent(
        `name contains '${filter}' and mimeType='application/vnd.google-apps.spreadsheet'`
      );
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching spreadsheets: ${response.statusText}`);
      }

      const data: FetchSpreadsheetsResponse = await response.json();
      setSpreadsheets(data.files || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSheets = async (spreadsheetId: string) => {
    if (!auth?.accessToken) {
      console.error("No access token available.");
      return;
    }

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching sheets: ${response.statusText}`);
      }

      const data: FetchSheetsResponse = await response.json();
      return data.sheets || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const selectSpreadsheet = async (spreadsheetId: string): Promise<void> => {
    const sheets = await fetchSheets(spreadsheetId);
    const inputSheet = sheets.find(
      (sheet) => sheet.properties.title === "input"
    );
    const { rows } = await fetchData(spreadsheetId, "1:1");
    const headers = rows[0];
    if (!inputSheet) {
      console.log("Spreadsheet must contain a sheet named input.");
    } else if (JSON.stringify(headers.slice(1)) !== JSON.stringify(players.map((player) => player.name))) {
      console.log('Headers are invalid.');
    } else {
      const updatedAuth: GoogleAuth = {
        ...auth,
        spreadsheetId: spreadsheetId,
      };
      setAuth(updatedAuth);
    }
  };

  const fetchData = async (
    spreadsheetId: string,
    range: string
  ): Promise<SheetData> => {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/input!${range}`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data: FetchDataResponse = await response.json();
      return {
        rows: data.values || [],
      };
    } catch (error) {
      console.error(error);
      return {
        rows: [],
        error: error.message,
      };
    }
  };

  return {
    spreadsheets,
    fetchSpreadsheets,
    selectSpreadsheet,
    fetchData,
  };
};
