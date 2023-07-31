import { ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

import Text from "../components/Text";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../App";

type Props = NativeStackScreenProps<StackParamList, "Start">;

export default function StartScreen({ navigation }: Props) {
  return (
      <ImageBackground style={styles.image} source={require("../assets/splash-bg.jpg")} resizeMode="cover">
        <SafeAreaView>
          <View style={styles.content}>
            <View>
              <Text style={styles.header}>Bloomie</Text>
              <Text style={styles.smile}>(</Text>
              <Text style={[styles.text, { color: "#be95c4"}]}>it's bloomin with bloomie!</Text>
            </View>
            <TouchableOpacity style={{ marginVertical: 80, marginHorizontal: 20, flex: 1 }} onPress={() => navigation.navigate("Select")}>
              <View style={styles.button}>
                <Text style={[styles.text, styles.buttonText]}>Calibrate</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    color: "#da627d",
    paddingBottom: 0,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#da627d",
    padding: 10,
    borderRadius: 10,
    minWidth: "100%",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
  },
  smile: {
    fontSize: 32,
    color: "#da627d",
    fontFamily: "Nunito_400Regular",
    position: "relative",
    transform: [{ rotate: "-90deg" }, { translateX: 210 }, { translateY: -12 }],
    paddingBottom: 0,
  },
  text: {
    fontFamily: "Nunito_400Regular",
    color: "white",
    textAlign: "center",
  },
  content: {
    paddingTop: 300,
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    alignItems: "center",
    paddingTop: 200,
  },
});
