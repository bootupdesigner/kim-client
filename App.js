import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="keep-it-moving"
        screenOptions={{ headerShown: false }} // Remove headers for all screens
      >
        <Stack.Screen name="keep-it-moving" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
