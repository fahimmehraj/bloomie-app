import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, View, Easing, Button } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import Text from "../components/Text";
import BackgroundView from "../components/BackgroundView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../App";

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
export default function LoadingScreen({ navigation }: Props) {
  return (
    <BackgroundView style={styles.container}>
      <Text style={styles.header}>Bloomie Setup</Text>
      <Text style={{ fontSize: 18 }}>Your Bloomie is Blooming!</Text>
      <View style={styles.iconWrapper}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="flower-outline" size={64} color="#da627d" />
        </Animated.View>
      </View>
      <Button title="test" onPress={() => navigation.navigate("ComponentCalibration", { component: "water", stage: "before"})}/>
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
});