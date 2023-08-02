import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import { BluetoothValuesContext } from "../context/BluetoothProvider";
import BackgroundView from "../components/BackgroundView";
import Text from "../components/Text";

export default function HomeScreen() {
    const values = useContext(BluetoothValuesContext);

  return (
    <BackgroundView style={styles.container}>
      <Text style={styles.header}>Bloomie</Text>
      <View style={styles.infoContainer}>
        <Ionicons name="water-outline" size={48} color="#48cae4"></Ionicons> 
        <Text style={[styles.infoText, styles.water, { marginRight: 15, marginLeft: 2, }]}>Pond Level: </Text>
        <Text style={[styles.infoText, styles.water]}>{values![1]}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Ionicons name="sunny-outline" size={48} color="#ffb703"></Ionicons> 
        <Text style={[styles.infoText, styles.sun, { marginRight: 15, marginLeft: 2, }]}>Light Level: </Text>
        <Text style={[styles.infoText, styles.sun]}>{values![2]}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Ionicons name="thermometer-outline" size={48} color="#E52464"></Ionicons> 
        <Text style={[styles.infoText, styles.bold, { marginRight: 15, marginLeft: 2, }]}>Temperature: </Text>
        <Text style={[styles.infoText, styles.bold]}>{values![3]}°</Text>
      </View>
    </BackgroundView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  header: {
    fontSize: 42,
    marginTop: 32,
    marginBottom: 55,
  },
  infoText: {
    textAlign: "center",
    fontSize: 24,
    color: "#94a3b8",
    marginVertical: 5,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    minWidth: "100%"
  },
  water: {
    color: "#48cae4",
    marginVertical: 20,
  },
  sun: {
    color: "#ffb703",
    marginVertical: 20,
  },
  bold: {
    color: "#E52464",
    fontFamily: "Nunito_700Bold",
  },
  button: {
    backgroundColor: "#00b4d8",
    padding: 10,
    borderRadius: 10,
    minWidth: "100%",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    textAlign: "center",
  },
  colorful: {
    color: "#00b4d8",
  },
});
