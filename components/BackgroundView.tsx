import React from "react";
import { SafeAreaView, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
} & ViewProps;

const BackgroundView: React.FC<Props> = ({ children, style, ...props }) => (
  <SafeAreaView style={styles.background}>
  <View style={[styles.background, style]} {...props}>
    {children}
  </View>
  </SafeAreaView>
);

export default BackgroundView;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 20,
  }
})