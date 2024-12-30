import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useStyles } from "../styles/StylesContext";
import { useTheme } from "@react-navigation/native";

const CustomAlert = ({ visible, message, onClose }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      width: 300,
      padding: 20,
      backgroundColor: colors.card,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontFamily: 'GoogleSans-Regular',
      color: colors.text,
      fontSize: 18,
      marginBottom: 20,
    },
    modalButton: {
      backgroundColor: '#e91e63',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    modalButtonText: {
      fontFamily: 'GoogleSans-Bold',
      color: colors.text,
      fontSize: 16,
    },
  })

  return (
    <Modal
    transparent={true}
    animationType="slide"
    visible={visible}
    onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};



export default CustomAlert;