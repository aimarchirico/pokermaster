export interface CustomAlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export interface CustomInputProps {
  visible: boolean;
  title: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
}

export interface SpreadsheetPickerProps {
  setShowPicker: (show: boolean) => void;
}

export interface WeekPickerProps {
  setShowPicker: (show: boolean) => void;
  setRow: (row: number) => void;
}
