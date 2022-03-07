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

import SignInScene from "../views/signIn";
import SignUpScene from "../views/signUp";

import TestScene from "../views/test/TestScene";

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();

// 底部tabBar
function BottomTabs() {
  return (
    <MaterialBottomTabs.Navigator barStyle={styles.tabBar}>
      <MaterialBottomTabs.Screen
        name="home"
        component={HomeScene}
        options={{
          tabBarLabel: "首页",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome name="location-arrow" size={30} color={color} />
          ),
          tabBarColor: "#C9E7F8",
        }}
      />
      <MaterialBottomTabs.Screen
        name="trade"
        component={TradeScene}
        options={{
          tabBarLabel: "交易",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome name="bell" size={26} color={color} />
          ),
          tabBarColor: "#9FD5C9",
        }}
      />
      <MaterialBottomTabs.Screen
        name="order"
        component={OrderScene}
        options={{
          tabBarLabel: "订单",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome name="book" size={26} color={color} />
          ),
          tabBarColor: "#F7EAA2",
        }}
      />
      <MaterialBottomTabs.Screen
        name="mine"
        component={MineScene}
        options={{
          tabBarLabel: "我的",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome name="user" size={26} color={color} />
          ),
          tabBarColor: "#FAD4D6",
        }}
      />
    </MaterialBottomTabs.Navigator>
  );
}

// 视图
function NavigatorStack() {
  return (
    <Stack.Navigator
      headerMode="screen"
      initialRouteName="signIn"
      style={{ backgroundColor: "#000" }}
      screenOptions={{
        headerTintColor: "white",
        headerStyle: { backgroundColor: "tomato" },
        cardStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen
        headerMode="none"
        name="tab"
        options={{ headerShown: false }}
        component={BottomTabs}
      />
      <Stack.Screen
        name="signIn"
        options={{ headerShown: false, cardStyle: { backgroundColor: "red" } }}
        component={SignInScene}
      />
      <Stack.Screen
        name="signUp"
        options={{
          headerShown: false,
          animation:'fade_from_bottom',
        }}
        component={SignUpScene}
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
  const dispatch = useDispatch();

  useEffect(() => {
    auth();
  }, []);

  const auth = async () => {
    try {
      let t = await Storage.getItem("token");
      if (t) {
        dispatch(SET_LOGIND(true));
      } else {
        dispatch(SET_LOGIND(false));
        navigationRef.current.dispatch(StackActions.replace("signIn"));
      }
      dispatch(SET_TOP_NAV(navigationRef.current));
    } catch (error) {
      dispatch(SET_LOGIND(false));
      if (navigationRef.current) {
        dispatch(SET_TOP_NAV(navigationRef.current));
        navigationRef.current.dispatch(StackActions.replace("signIn"));
      }
    }
  };

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
