import { Button, StyleSheet } from "react-native";
import Text from "../components/Text";
import BackgroundView from "../components/BackgroundView";
import { StackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<StackParamList, "Select">;

export default function SelectScreen({ navigation }: Props) {
  return (
    <BackgroundView style={styles.container}>
      <Text style={styles.header}>Bloomie Setup</Text>
      <Text style={styles.infoText}>Make sure your Bloomie is turned on.</Text>
      <Text style={styles.infoText}>When you see the prompt to connect to Wi-Fi, allow it!</Text>
      <Text style={[styles.infoText, { marginTop: 32 }]}>Scanning for Bloomie...</Text>
      <Button title="test" onPress={() => navigation.navigate("Loading", { reason: "scanning" })}></Button>
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
    marginBottom: 60,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    color: "#94a3b8"
  }
});
