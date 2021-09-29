/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React, { useEffect } from "react"
import { AppState, useColorScheme, View, ViewStyle } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme, Theme, useTheme as useNavTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { WelcomeScreen, DemoScreen, DemoListScreen, HomeScreen, AddPassScreen, QrScanDevScreen } from "../screens"
import { navigationRef } from "./navigation-utilities"
import { testKeychain, testREALM } from "../library-tests"
import { useStores } from "../models"
import { KitStatusbar } from "../components"
import { useTheme } from "@ui-kitten/components"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type NavigatorParamList = {
  home: undefined
  welcome: undefined
  demo: undefined
  demoList: undefined,
  addPass: undefined,
  qrTest: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()

const AppStack = () => {
  const {colors} = useNavTheme()

  const rootViewStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background
  }

  return (
    <View style={rootViewStyle}> 
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="home"
    >
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="demo" component={DemoScreen} />
      <Stack.Screen name="addPass" component={AddPassScreen} />
      <Stack.Screen name="demoList" component={DemoListScreen} />
      <Stack.Screen name="qrTest" component={QrScanDevScreen} />
      </Stack.Navigator>
    </View>
  )
}


interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const { themeStore } = useStores()
  const theme = useTheme()
  const {lockedStore} = useStores()
  
  const KitThemeLight: Theme = {
    dark: false,
    colors: {
      primary: theme['color-primary-500'],
      background: theme['background-basic-color-4'],
      card: theme['background-basic-color-1'],
      text: theme['text-basic-color'],
      border: theme['color-basic-default-border'],
      notification: theme['color-danger-500'],
    },
  };

  const KitThemedark: Theme = {
    dark: true,
    colors: {...KitThemeLight.colors}
  }

  useEffect(() => {
    if (AppState.currentState === 'background') {
      console.log("App entering background.... locking")
      lockedStore.setLocked(true)
    }
  }, [AppState.currentState])

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={themeStore.current === 'dark' ? KitThemedark : KitThemeLight}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["home"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
