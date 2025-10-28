// components/AppText.tsx
import { typography } from "@/components/theme/typography";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

type Variant = "title" | "subtitle" | "body" | "small";

interface AppTextProps extends TextProps {
  variant?: Variant;
  weight?: "regular" | "semibold";
}

export const AppText = ({
  variant = "body",
  weight = "regular",
  style,
  ...props
}: AppTextProps) => {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        {
          fontFamily: typography[weight].fontFamily,
          fontSize: typography.sizes[variant],
        },
        style,
      ]}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: "#273B4D",
  },
});
