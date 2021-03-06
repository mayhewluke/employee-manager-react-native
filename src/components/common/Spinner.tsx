import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  spinnerStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export enum Size {
  Large = "large",
  Small = "small",
}

export interface IProps {
  size: Size;
}

const Spinner: React.SFC<IProps> = ({ size }) => {
  const { spinnerStyle } = styles;
  return (
    <View style={spinnerStyle}>
      <ActivityIndicator size={size} />
    </View>
  );
};

export default Spinner;
