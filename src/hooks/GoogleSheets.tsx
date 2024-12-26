import { useCallback, useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import { FetchSheetsResponse, FetchSpreadsheetsResponse, Sheet, Spreadsheet } from "../types/GoogleSheetsTypes";
import { GoogleAuth } from "../types/GoogleAuth";

export const useGoogleSheets = () => {
  const { auth, setAuth } = useAuth();
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]); 
  const [sheets, setSheets] = useState<Sheet[]>([]); 
  

  const fetchSpreadsheets = useCallback(async (filter: string) : Promise<void> => {
    if (!auth?.accessToken) {
      console.error('No access token available.')
      return;
    }

    try {
      const query = encodeURIComponent(`name contains '${filter}' and mimeType='application/vnd.google-apps.spreadsheet'`);
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}`
      const response = await fetch(
        url,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`
          }
        }
      );
      
      if (!response.ok) {
        console.log(response.status)
        console.log(url)
        throw new Error(`Error fetching spreadsheets: ${response.statusText}`)
      }

      const data: FetchSpreadsheetsResponse = await response.json();
      setSpreadsheets(data.files || []);
    } catch (error) {
      console.error(error);
    }
  },[auth]);

  const fetchSheets = useCallback(async (spreadsheetId: string): Promise<void> => {
    if (!auth?.accessToken) {
      console.error('No access token available.');
      return;
    }

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching sheets: ${response.statusText}`)
      }

      const data: FetchSheetsResponse = await response.json();
      setSheets(data.sheets || []);
    } catch (error) {
      console.error(error);
    }
  }, [auth]);

  const selectSpreadsheet = useCallback((spreadsheetId: string): void => {
    const updatedAuth: GoogleAuth = {
      ...auth,
      spreadsheetId: spreadsheetId
    }
    setAuth(updatedAuth);
    fetchSheets(spreadsheetId);
    const inputSheet = sheets.find(sheet => sheet.properties.title === 'input');
    if (!inputSheet) {
      console.log('Spreadsheet must contain a sheet named input.');
    }
    else {
      selectSheet(inputSheet.properties.title);
    }
  }, [fetchSheets, setAuth]);
  
  const selectSheet = useCallback((sheetId: string): void => {
    const updatedAuth: GoogleAuth = {
      ...auth,
      sheetId: sheetId
    }
    setAuth(updatedAuth);
  }, [setAuth]);

  

  return {
    spreadsheets,
    sheets,
    fetchSpreadsheets,
    fetchSheets,
    selectSpreadsheet,
    selectSheet,
  }
  

}




