import { Button, StyleSheet, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../App";

import Text from "../components/Text";
import BackgroundView from "../components/BackgroundView";

type Props = NativeStackScreenProps<StackParamList, "ComponentCalibration">;

export default function ComponentCalibrationScreen({ route, navigation }: Props) {
  const { component, stage } = route.params;
  const getNextStep = (): { component: "water" | "light"; stage: "after" | "before" } | null => {
    console.log(component, stage);
    if (component == "water") {
      if (stage == "before") {
        return { component: "water", stage: "after" };
      } else {
        return { component: "light", stage: "before" };
      }
    } else {
      if (stage == "before") {
        return { component: "light", stage: "after" };
      } else {
        return null;
      }
    }
  };
  return (
    <BackgroundView style={styles.container}>
      <Text style={styles.header}>Bloomie Setup</Text>
      <Text style={styles.infoText}>Your bloomie is now connected to the internet!</Text>
      <Text style={styles.infoText}>
        Now, Bloomie needs to fine tune your {component == "water" ? "water levels" : "light levels"} for use.
      </Text>
      {component == "water" ? (
        <Text style={[styles.infoText, { marginTop: 32, fontSize: 18 }]}>
          Make sure the bloomie pond is <Text style={styles.bold}>{stage == "before" ? "empty" : "full"}</Text> before
          continuing. For best results, leave the pond empty for at least 5 minutes.
        </Text>
      ) : (
        <Text style={[styles.infoText, { marginTop: 32, fontSize: 18 }]}>
          Put Bloomie in a very <Text style={styles.bold}>{stage == "before" ? "dark" : "bright"}</Text> place in your
          home or put {stage == "before" ? "a cloth over Bloomie" : "Bloomie in the sun"}. Then,{" "}
          <Text style={styles.colorful}>continue</Text>.
        </Text>
      )}
      <TouchableOpacity
        style={{ marginTop: 80, marginHorizontal: 10 }}
        onPress={() => {
          const nextStep = getNextStep();
          if (nextStep == null) {
            navigation.navigate("Loading");
          } else {
            navigation.push("ComponentCalibration", nextStep);
          }
        }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </View>
      </TouchableOpacity>
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
    fontSize: 16,
    color: "#94a3b8",
    marginVertical: 5,
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
