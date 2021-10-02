/* eslint-disable import/first */
// This is the first file that ReactNative will run when it starts up.
//
// We jump out of here immediately and into our main entry point instead.
//
// It is possible to have React Native load our main module first, but we'd have to
// change that in both AppDelegate.m and MainApplication.java.  This would have the
// side effect of breaking other tooling like mobile-center and react-native-rename.
//
// It's easier just to leave it here.
import 'react-native-get-random-values'
global.Buffer = require('buffer').Buffer;
import App from "./app/app.tsx"
import { AppRegistry } from "react-native"

AppRegistry.registerComponent("passHolder", () => App)
export default App
