import React, { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { CustomAlertProps, CustomInputProps } from "../types/Props";
import { useStyles } from "../styles/StylesContext";
import { useState } from "react";

export const CustomAlert = ({ visible, message, onClose }: CustomAlertProps) => {
  const { globalStyles } = useStyles();


  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.modalContainer}>
          <Text style={globalStyles.modalText}>{message}</Text>
          <TouchableOpacity style={globalStyles.modalButton} onPress={onClose}>
            <Text style={globalStyles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export const CustomInput = ({
  visible, 
  title, 
  onConfirm, 
  onCancel,
  placeholder,
  keyboardType = 'default'
}: CustomInputProps) => {
const { colors } = useTheme();
const [value, setValue] = useState("");
const { globalStyles } = useStyles();



const handleConfirm = () => {
  if (!value && placeholder) {
    onConfirm(placeholder)
  } else {
    onConfirm(value);
  }
  setValue("");
}


const styles = StyleSheet.create({
 

  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: colors.text,
    fontFamily: "GoogleSans-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },


  cancelButton: {
    backgroundColor: colors.border,
  },
});

return (
  <Modal
    visible={visible}
    transparent
    animationType='fade'
    onRequestClose={onCancel}
  >
    <View style={globalStyles.modalOverlay}>
      <View style={globalStyles.modalContainer}>
        <Text style={globalStyles.modalText}>{title}</Text>
        <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        keyboardType={keyboardType}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.modalButton, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={globalStyles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.modalButton]}
            onPress={handleConfirm}
          >
            <Text style={globalStyles.modalButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

  </Modal>
)

}