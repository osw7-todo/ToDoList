import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './MainScreen';
import SelectScreen from './SelectScreen';

//navigation stack을 이용해 화면 이동
const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MAIN">
        <Stack.Screen name="MAIN" component={MainScreen} 
          options={{ headerShown: false}}/>
        <Stack.Screen name="SELECT" component={SelectScreen} 
          options={{
            title: 'SELECT & DELETE'
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;