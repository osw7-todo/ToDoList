import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { theme } from './theme';

import MainScreen from './MainScreen';
import SelectScreen from './screens/SELECT_Main&All_Screen';
import EditScreen from './screens/EditScreen';
import ViewAll from './screens/ViewAllScreen';
import Completed from './screens/CompletedScreen';
import Uncompleted from './screens/UncompletedScreen';
import CompletionRate from './screens/CompletionRateScreen';
import CategoryScreen from './screens/CategoryScreen';
import SelectedCategoryScreen from './screens/SelectedCategoryScreen';
import SELECT_Completed_Screen from './screens/SELECT_Completed_Screen';
import SELECT_Uncompleted_Screen from './screens/SELECT_Uncompleted_Screen';

//change screen using navigation stack&tab
const Stack = createStackNavigator();
//const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/*
//BottomTab >> Drawer로 대체
function BottomTab() {
  return (
    <Tab.Navigator initalRouteName="MAIN" drawerPosition="bottom">
      <Tab.Screen name="ViewAll" component={ViewAll}
        options={{
          headerShown: false, //delete headear
          tabBarInactiveBackgroundColor: theme.background,
          tabBarActiveBackgroundColor: theme.background,
          tabBarActiveTintColor: "#778bdd",
          tabBarIcon: ({ focused }) => { //after set color, must change 2nd img src
            const image = focused ? require('../assets/list.png') : require('../assets/list.png')
            return (<Image source={image} style={{ width: 30, height: 24 }} />)
          }
        }} />
      <Tab.Screen name="MAIN" component={MainScreen}
        options={{
          headerShown: false,
          tabBarInactiveBackgroundColor: theme.background,
          tabBarActiveBackgroundColor: theme.background,
          tabBarActiveTintColor: "#778bdd",
          tabBarIcon: ({ focused }) => { //after set color, must change 2nd img src
            const image = focused ? require('../assets/due-date.png') : require('../assets/due-date.png')
            return (<Image source={image} style={{ width: 30, height: 24 }} />)
          }
        }} />
    </Tab.Navigator>
  )
}
*/

function MenuBar() {
  return (
    <Drawer.Navigator initialRouteName="MAIN">
      <Drawer.Screen
        name="main"
        component={MainScreen}
        options={{
          title: "main",
          headerStyle: {
            backgroundColor: theme.background
          },
          headerTitleStyle: {
            fontSize: 35,
            color: theme.main,
          },
          headerTitleAlign: 'center',
          headerTintColor: theme.main,
        }}
      />

      <Drawer.Screen
        name="all"
        component={ViewAll}
        options={{
          headerStyle: {
            backgroundColor: theme.background
          },
          headerTitleStyle: {
            fontSize: 35,
            color: theme.main,
          },
          headerTitleAlign: 'center',
          headerTintColor: theme.main,
          /*headerRight: () => (
            <IconButton type={images.searchI} onPressOut={()=>setShouldShow(!shouldShow)}/>

          )*/
        }}
      />

      <Drawer.Screen
        name="completed"
        component={Completed}
        options={{
          headerStyle: {
            backgroundColor: theme.background
          },
          headerTitleStyle: {
            fontSize: 35,
            color: theme.main,
          },
          headerTitleAlign: 'center',
          headerTintColor: theme.main,
        }}
      />

      <Drawer.Screen
        name="uncompleted"
        component={Uncompleted}
        options={{
          headerStyle: {
            backgroundColor: theme.background
          },
          headerTitleStyle: {
            fontSize: 35,
            color: theme.main,
          },
          headerTitleAlign: 'center',
          headerTintColor: theme.main,
        }}
      />

      <Drawer.Screen
        name="categories"
        component={CategoryScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.background
          },
          headerTitleStyle: {
            fontSize: 35,
            color: theme.main,
          },
          headerTitleAlign: 'center',
          headerTintColor: theme.main,
        }}
      />

      <Drawer.Screen
        name="completion rate"
        component={CompletionRate}
        options={{
          headerStyle: {
            backgroundColor: theme.background
          },
          headerTitleStyle: {
            fontSize: 30,
            color: theme.main,
          },
          headerTitleAlign: 'center',
          headerTintColor: theme.main,
        }}
      />
    </Drawer.Navigator>
  );
}


function App() {
  /*
   * Stack.Navigator 목록에, 1) MenuBar 2) Tab 3) SELECT 있는 것. (Navigation nested)
   * 이때 형식이 1) Drawer, 2)Tab bar 3)은 그냥 screen.
   */

  const [tasks, setTasks] = React.useState({});

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MenuBar}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="SELECT"
          component={SelectScreen}
          options={{
            title: 'SELECT & DELETE',
            cardstyle: { backgroundColor: theme.background },
            headerStyle: {
              backgroundColor: theme.background
            },
            headerTitleStyle: {
              fontSize: 25,
              color: theme.main,
            },
            headerTitleAlign: 'center',
            headerBackTitleVisible: true,
            headerBackTitle: ' ',
            headerTintColor: theme.main,
          }}
        />

        <Stack.Screen
          name="SELECT_Completed"
          component={SELECT_Completed_Screen}
          options={{
            title: 'SELECT & DELETE',
            cardstyle: { backgroundColor: theme.background },
            headerStyle: {
              backgroundColor: theme.background
            },
            headerTitleStyle: {
              fontSize: 25,
              color: theme.main,
            },
            headerTitleAlign: 'center',
            headerBackTitleVisible: true,
            headerBackTitle: ' ',
            headerTintColor: theme.main,
          }}
        />

        <Stack.Screen
          name="SELECT_Uncompleted"
          component={SELECT_Uncompleted_Screen}
          options={{
            title: 'SELECT & DELETE',
            cardstyle: { backgroundColor: theme.background },
            headerStyle: {
              backgroundColor: theme.background
            },
            headerTitleStyle: {
              fontSize: 25,
              color: theme.main,
            },
            headerTitleAlign: 'center',
            headerBackTitleVisible: true,
            headerBackTitle: ' ',
            headerTintColor: theme.main,
          }}
        />

        <Stack.Screen
          name="EDIT"
          component={EditScreen}
          options={{
            title: 'EDIT',
            cardstyle: { backgroundColor: theme.background },
            headerStyle: {
              backgroundColor: theme.background
            },
            headerTitleStyle: {
              fontSize: 25,
              color: theme.main,
            },
            headerTitleAlign: 'center',
            headerBackTitleVisible: true,
            headerBackTitle: ' ',
            headerTintColor: theme.main,
          }}
        />

        <Stack.Screen
          name="CATEGORY"
          component={SelectedCategoryScreen}
          options={{
            title: 'CATEGORY',
            cardstyle: { backgroundColor: theme.background },
            headerStyle: {
              backgroundColor: theme.background
            },
            headerTitleStyle: {
              fontSize: 25,
              color: theme.main,
            },
            headerTitleAlign: 'center',
            headerBackTitleVisible: true,
            headerBackTitle: ' ',
            headerTintColor: theme.main,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;