import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { FirebaseDatabaseTypes } from '@react-native-firebase/database'

import { RootStackParamList } from '../../../types'
import ButtonIcon from '../../components/button/ButtonIcon'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const Setting = () => {
  const navigation = useNavigation<NavigationProp>()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let userRef: any

    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true)

        userRef = database().ref(`/users/${user.uid}`)

        userRef.on('value', (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
          const userData = snapshot.val()
          setIsAdmin(userData?.isAdmin === 1)
        })
      } else {
        setIsLoggedIn(false)
        setIsAdmin(false)
        if (userRef) userRef.off()
      }
    })

    return () => {
      unsubscribe()
      if (userRef) userRef.off()
    }
  }, [])


  const handleLogin = () => navigation.navigate('Login')

  const handleLogout = async () => {
    try {
      await auth().signOut()
    } catch (error) {
      console.error('Lỗi khi đăng xuất: ', error)
    }
  }

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <View style={styles.buttonContainer}>
          {isAdmin ? (
            <>
              <ButtonIcon icon="construct-outline" text="Quản lý dịch vụ" onPress={() => navigation.navigate('ListSanPham')} />
              <ButtonIcon icon="swap-horizontal-outline" text="Quản lý giao dịch" onPress={() => console.log('QL giao dịch')} />
              <ButtonIcon icon="people-outline" text="Quản lý khách hàng" onPress={() => navigation.navigate('QLKhachHang')} />
              <ButtonIcon icon="person-circle-outline" text="Đổi mật khẩu" onPress={() => navigation.navigate('DoiPass')} />
            </>
          ) : (
              <ButtonIcon icon="person-circle-outline" text="Đổi mật khẩu" onPress={() => navigation.navigate('DoiPass')} />
          )}
          <ButtonIcon icon="log-out-outline" text="Đăng xuất" onPress={handleLogout} backgroundColor="#f44336" />
        </View>
      ) : (
        <ButtonIcon icon="log-in-outline" text="Đăng nhập" onPress={handleLogin} />
      )}
    </View>
  )
}

export default Setting

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    gap: 16,
  },
})
