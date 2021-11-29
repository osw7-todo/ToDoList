import * as React from 'react';
import { NavigationContainer, DrawerActions} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Image, Dimensions, View } from 'react-native';
import { theme } from './theme';
import Category from './components/Category';

import MainScreen from './MainScreen';
import SelectScreen from './screens/SelectScreen';
import EditScreen from './screens/EditScreen';
import ViewAll from './screens/ViewAllScreen';
import Completed from './screens/CompletedScreen';
import Uncompleted from './screens/UncompletedScreen'; 
import Daily from './screens/DailyScreen';
import Monthly from './screens/monthlyScreen';
import CompletionRate from './screens/CompletionRateScreen';

//change screen using navigation stack&tab
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); 
const Drawer = createDrawerNavigator();

//BottomTab
function BottomTab(){
  return(
    <Tab.Navigator initalRouteName="MAIN" drawerPosition="bottom">
        <Tab.Screen name="ViewAll" component={ViewAll} 
        options={{headerShown:false, //delete headear
        tabBarInactiveBackgroundColor:theme.background,
        tabBarActiveBackgroundColor:theme.background,
        tabBarActiveTintColor:"#778bdd",
        tabBarIcon: ({ focused }) => { //after set color, must change 2nd img src
          const image = focused ? require('../assets/list.png') : require('../assets/list.png')
          return (<Image source={image} style={{width:30, height:24}}/>)
        }}}/> 
        <Tab.Screen name="MAIN" component={MainScreen}
        options={{ headerShown:false,
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


/*
function completed({ navigation }) {
  return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="completed" />
      </View>
  );
}
*/

function MenuBar() {
  var now = new Date();
  var month = now.getMonth() + 1;
  var today = now.getDate();

  const [newCategory, setNewCategory] = React.useState('');
  const [categories, setCategories] = React.useState({});
  

  return(
          <Drawer.Navigator initialRouteName="MAIN">
              <Drawer.Screen 
                  name="main" 
                  component={MainScreen}           
                  options={{
                    title: "main", 
                    /*이 title 자리에 해당 날짜 넣고 싶은데, 이 값이 drawer 젤 윗칸 이름에 그대로 들어가기도하고, 
                    {month}/{today}를 title에 넣는 방법을 모르겠음 */
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
                  name="daily" 
                  component={Daily} 
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
                  name="monthly" 
                  component={Monthly} 
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

              {Object.values(categories).map(item=>{
                <Drawer.Screen
                name={item.text}
                component={<Category key={item.id} item={item}/>}
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
            })}
          </Drawer.Navigator>
  );
}


function App() {
  /*
   * Stack.Navigator 목록에, 1) MenuBar 2) Tab 3) SELECT 있는 것.
   * 이때 형식이 1) Drawer, 2)Tab bar 3)은 그냥 screen.
   */

  const[tasks, setTasks] = React.useState({});

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={MenuBar} 
          options={{
            headerShown:false,
           }}
        />

        <Stack.Screen 
          name="Tab" 
          component={BottomTab} 
          options={{
            headerShown:false, 
            style: {elevation: 0, shadowOffset: {width: 0, height: 0}}, //remove line for Android, iOS
           }}
        />
        
        {/* <Stack.Screen name="MAIN" component={MainScreen} options={{ headerShown: false}}/> */}

        <Stack.Screen 
          name="SELECT" 
          component={SelectScreen} 
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
        
        <Stack.Screen 
          name="EDIT"
          component={EditScreen}
          options={{
            title: 'EDIT',
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