import React from "react";
import { Text as DefaultText, StyleProp, StyleSheet, TextStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};
const Text: React.FC<Props> = ({ children, style }) => (
  <DefaultText style={[styles.text, style]}>{children}</DefaultText>
);

const styles = StyleSheet.create({
  text: {
    fontFamily: "Nunito_700Bold",
    color: "white",
  },
});

export default Text;
