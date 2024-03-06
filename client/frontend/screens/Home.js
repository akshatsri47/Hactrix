import React, { useState, useRef, useEffect } from "react";
import { View, Animated, LayoutAnimation, StyleSheet } from "react-native";
import { Layout, TopNav, Text, Button, Section, SectionContent, useTheme, themeColor } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();

  // Animation values
  const buttonFadeAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Animation on button press
  const onPressAnimation = () => {
    Animated.sequence([
      Animated.timing(buttonFadeAnim, { toValue: 0.6, duration: 200, useNativeDriver: true }),
      Animated.spring(buttonScaleAnim, { toValue: 1.1, friction: 3, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(buttonFadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(buttonScaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
      ])
    ]).start();
  };

  // LayoutAnimation configuration
  useEffect(() => {
    const config = {
      duration: 300,
      update: { type: LayoutAnimation.Types.spring, springDamping: 0.7 },
    };
    LayoutAnimation.configureNext(config);
  }, []);

  return (
    <Layout style={styles.container}>
      <TopNav
        middleContent="Home"
        rightContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          if (isDarkmode) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
      />
      <Section style={styles.section}>
        <SectionContent style={styles.content}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Animated.View style={{ opacity: buttonFadeAnim, transform: [{ scale: buttonScaleAnim }] }}>
            <Button
              text="Go to Second Screen"
              onPress={() => {
                navigation.navigate("SecondScreen");
                onPressAnimation();
              }}
              style={styles.button}
            />
          </Animated.View>
          <Animated.View style={{ opacity: buttonFadeAnim, transform: [{ scale: buttonScaleAnim }] }}>
            <Button
              text="Go to Third Screen"
              onPress={() => {
                navigation.navigate("ThirdScreen");
                onPressAnimation();
              }}
              style={styles.button}
            />
          </Animated.View>
        </SectionContent>
      </Section>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColor.white,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
    backgroundColor: themeColor.primary,
    borderRadius: 5,
  },
  section: {
    marginBottom: 20
  }
});
