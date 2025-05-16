import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'

import home from './home'
import setting from './setting'

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Home') {
              iconName = 'home'; 
              } else if (route.name === 'Settings') {
              iconName = 'settings';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
          },
      })}
    >
      <Tab.Screen name="Home" component={home} />
      <Tab.Screen name="Settings" component={setting} />
    </Tab.Navigator>
  );
}
