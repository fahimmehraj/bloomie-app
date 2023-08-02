import { useFonts, Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import StartScreen from "./screens/StartScreen";
import SelectScreen from "./screens/SelectScreen";
import LoadingScreen from "./screens/LoadingScreen";
import ComponentCalibrationScreen from "./screens/ComponentCalibrationScreen";
import { BluetoothProvider } from "./context/BluetoothProvider";
import HomeScreen from "./screens/Home";

export type StackParamList = {
  Start: undefined;
  Select: undefined;
  Loading: { reason: 'scanning' | 'finished' };
  ComponentCalibration: { component: 'water' | 'light', stage: 'before' | 'after' };
  Home: undefined;
}

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  let [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
        <BluetoothProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Start">
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Select" component={SelectScreen} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="ComponentCalibration" component={ComponentCalibrationScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
        </BluetoothProvider>
    </NavigationContainer>
  );
}