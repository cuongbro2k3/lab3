import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const DoiPass = () => {
  const navigation = useNavigation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reauthenticate = (currentPassword: string) => {
    const user = auth().currentUser
    if (!user || !user.email) {
      return Promise.reject(new Error('User chưa đăng nhập hoặc không có email'))
    }
    const credential = auth.EmailAuthProvider.credential(user.email, currentPassword)
    return user.reauthenticateWithCredential(credential)
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin')
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp')
      return
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setIsSubmitting(true)

    reauthenticate(currentPassword)
      .then(() => {
        const user = auth().currentUser
        if (!user) {
          Alert.alert('Lỗi', 'User chưa đăng nhập')
          return
        }
        return user.updatePassword(newPassword)
      })
      .then(() => {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Lỗi', 'Mật khẩu hiện tại không đúng')
        }
        else if (error.code === 'auth/weak-password') {
          Alert.alert('Lỗi', 'Mật khẩu mới quá yếu')
        } 
        else if (error.code === 'auth/user-not-found') {
          Alert.alert('Lỗi', 'Người dùng không tồn tại')
        } 
        else if (error.code === 'auth/network-request-failed') {
          Alert.alert('Lỗi', 'Không có kết nối mạng')
        }
        else if (error.code === 'auth/too-many-requests') {
            Alert.alert('Lỗi', 'Quá nhiều yêu cầu, vui lòng thử lại sau')
            }
        else if (error.code === 'auth/invalid-credential') {
            Alert.alert('Lỗi', 'Mật khẩu cũ không đúng')
            }
        else {
          Alert.alert('Lỗi', error.message)
        }
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Nhập mật khẩu hiện tại"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Nhập lại mật khẩu mới"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DoiPass

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRightPlaceholder: {
    width: 24,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  formContainer: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})