import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Animated, View, Easing, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Ionicons from '@expo/vector-icons/Ionicons';

import Text from "../components/Text";
import BackgroundView from "../components/BackgroundView";
import { StackParamList } from "../App";
import { BluetoothDispatchContext, BluetoothStatusContext, BluetoothValuesContext } from "../context/BluetoothProvider";

const spinValue = new Animated.Value(0);

const spinAnim = Animated.loop(
  Animated.timing(spinValue, {
    toValue: 1,
    duration: 750,
    easing: Easing.linear,
    useNativeDriver: true,
  })
);

spinAnim.start(() => { spinValue.setValue(0) })

const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "360deg"],
});

type Props = NativeStackScreenProps<StackParamList, "Loading">;

export default function LoadingScreen({ navigation, route }: Props) {
  const connectionStatus = useContext(BluetoothStatusContext);
  const values = useContext(BluetoothValuesContext);
  const dispatch = useContext(BluetoothDispatchContext);

  useEffect(() => {
    if (!dispatch) {
      return;
    }
    if (route.params.reason == "scanning") {
      console.log("Scanning for Bluetooth Networks")
      dispatch("startCalibration")
    } else {
      console.log("Wait for bloomie to be ready");
      setTimeout(() => {
        try {
          dispatch("finishedCalibration")
        } catch (e) {
          console.log("failed to finish calibration", e);
        }
        navigation.navigate("Home");
      }, 5000)
    }
  }, [route.params.reason]);

  useEffect(() => {
    console.log(connectionStatus);
    if (connectionStatus == "CONNECTED") {
      console.log("this is where the calibration step would proceed");
      console.log(values)
      navigation.push("ComponentCalibration", { component: "water", stage: "before" })
    }
  }, [connectionStatus])

  return (
    <BackgroundView style={styles.container}>
      <Text style={styles.header}>Bloomie Setup</Text>
      {route.params.reason == "scanning" ? (
        <>
          <Text style={styles.infoText}>Make sure your Bloomie is turned on.</Text>
          <Text style={styles.infoText}>When you see the prompt to connect to Bluetooth, allow it!</Text>
          <Text style={[styles.infoText, { marginTop: 32 }]}>Scanning for Bloomie...</Text>
        </>) : (

        <Text style={[styles.infoText, { fontSize: 18 }]}>Your Bloomie is Blooming!</Text>
      )
      }
      <View style={styles.iconWrapper}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="flower-outline" size={64} color="#da627d" />
        </Animated.View>
      </View>
      <Button title="test" onPress={() => navigation.navigate("ComponentCalibration", { component: "water", stage: "before" })} />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  header: {
    fontSize: 42,
    marginTop: 32,
    marginBottom: 60,
  },
  iconWrapper: {
    marginTop: 120,
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    color: "#94a3b8",
    marginVertical: 5,
  },
});