import React, { useEffect, useRef } from "react";
import { Button, StyleSheet } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { SET_LOGIND, SET_TOP_NAV } from "../store/action/Actions";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import { FontAwesome } from "@expo/vector-icons";

// views
import HomeScene from "../views/tabbar/HomeScene";
import TradeScene from "../views/tabbar/TradeScene";
import OrderScene from "../views/tabbar/OrderScene";
import MineScene from "../views/tabbar/MineScene";

import MainInScene from "../views/main";
import SettingScene from "../views/setting";

import TestScene from "../views/test/TestScene";

const Stack = createNativeStackNavigator();

// 视图
function NavigatorStack() {
  return (
    <Stack.Navigator
      headerMode="screen"
      initialRouteName="main"
      style={{ backgroundColor: "#000" }}
      screenOptions={{
        headerTintColor: "white",
        headerStyle: { backgroundColor: "tomato" },
        cardStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen
        name="main"
        options={{ headerShown: false, cardStyle: { backgroundColor: "red" } }}
        component={MainInScene}
      />
      <Stack.Screen
        name="setting"
        options={{
          headerShown: false,
          animation:'fade_from_bottom',
        }}
        component={SettingScene}
      />
      <Stack.Screen
        name="test"
        options={{
          headerRight: () => (
            <Button onPress={() => alert("This is a button!")} title="Info" />
          ),
        }}
        component={TestScene}
      />
    </Stack.Navigator>
  );
}

function handleNavigationChange(prevState, newState, action) {
  // console.log(prevState, newState, action);
}

const AppNavigator = () => {
  const navigationRef = useRef(null);

  const linking = {};
  return (
    <NavigationContainer
      style={{ backgroundColor: "#000" }}
      ref={navigationRef}
      linking={linking}
      uriPrefix="/app"
      onStateChange={handleNavigationChange}
    >
      <NavigatorStack />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
  },
});

export default AppNavigator;
