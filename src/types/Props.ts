export interface CustomAlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export interface SpreadsheetPickerProps {
  setShowPicker: (show: boolean) => void;
}
