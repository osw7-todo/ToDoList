import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="All" component={ViewAllScreen} />
      <Tab.Screen name="Home" component={MainScreen} />
    </Tab.Navigator>
  );
}