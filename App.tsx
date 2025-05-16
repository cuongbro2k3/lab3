// App.tsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Tabs from './src/screens/tabs/tabs'
import Login from './src/screens/account/login'
import SignUp from './src/screens/account/signup'
import listSanPham from './src/screens/admin/listSanPham'
import detailSanPham from './src/screens/admin/detailSanPham'
import addSanPham from './src/screens/admin/addSanPham'
import DoiPass from './src/screens/account/doiPass'
import QlKhachHang from './src/screens/admin/qlKhachHang'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
        <Stack.Screen name="ListSanPham" component={listSanPham} options={{ headerShown: false }}/>
        <Stack.Screen name="DetailSanPham" component={detailSanPham} options={{ headerShown: false }}/>
        <Stack.Screen name="AddSanPham" component={addSanPham} options={{ headerShown: false }}/>
        <Stack.Screen name="DoiPass" component={DoiPass} options={{ headerShown: false }}/>
        <Stack.Screen name="QLKhachHang" component={QlKhachHang} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}