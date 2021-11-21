import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import {theme} from './theme';


import MainScreen from './MainScreen';
import SelectScreen from './SelectScreen';
import ViewAll from './ViewAllScreen';

//change screen using navigation stack&tab
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//BottomTab
function BottomTab(){
  return(
    <Tab.Navigator initalRouteName="TAB" drawerPosition="bottom">
        <Tab.Screen name="ViewAll" component={ViewAll} 
        options={{headerShown:false, //delete headear
        tabBarInactiveBackgroundColor:theme.background,
        tabBarActiveBackgroundColor:theme.background,
        tabBarActiveTintColor:"#778bdd",
        tabBarIcon: ({ focused }) => { //after set color, must change 2nd img src
          const image = focused ? require('../assets/list.png') : require('../assets/list.png')
          return (<Image source={image} style={{width:30, height:24}}/>)
        }}}/> 
        <Tab.Screen name="Home" component={MainScreen}
        options={{headerShown:false, 
        tabBarInactiveBackgroundColor:theme.background, 
        tabBarActiveBackgroundColor:theme.background,
        tabBarActiveTintColor:"#778bdd",
        tabBarIcon: ({ focused }) => { //after set color, must change 2nd img src
          const image = focused ? require('../assets/due-date.png') : require('../assets/due-date.png')
          return (<Image source={image} style={{width:30, height:24}}/>)
        }}}/>
    </Tab.Navigator>
  )
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TAB" component={BottomTab} 
           options={{headerShown:false}}/>
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