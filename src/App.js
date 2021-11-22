import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {theme} from './theme';

import MainScreen from './MainScreen';
import SelectScreen from './SelectScreen';

//navigation stack을 이용해 화면 이동
const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MAIN">
        {/*Main_Screen*/}
        <Stack.Screen name="MAIN" component={MainScreen} 
          options={{ headerShown: false}}/>

        {/*Select_Screen*/}
        <Stack.Screen name="SELECT" component={SelectScreen} 
          options={{
            title: 'SELECT & DELETE',
            cardstyle: {backgroundColor: theme.background},
            headerStyle: {
              backgroundColor: theme.background
            },
            headerTitleStyle: {
              fontSize: 25,
              color: theme.main,
            },
            headerTitleAlign: 'center',
            headerBackTitleVisible: true,
            headerBackTitle:' ',
            headerTintColor: theme.main,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;