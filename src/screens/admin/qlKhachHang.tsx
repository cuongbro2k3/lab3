import { 
  FlatList, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  StatusBar,
  RefreshControl
} from 'react-native'
import React, { useEffect, useState } from 'react'
import database from '@react-native-firebase/database'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'

interface User {
  id: string
  name: string
  email: string
  isAdmin: number // 0 = customer, 1 = admin
  createdAt?: number
}

const QlKhachHang = () => {
  const navigation = useNavigation()
  const [users, setUsers] = useState<User[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchUsers = () => {
    setRefreshing(true)
    const usersRef = database().ref('/users')

    usersRef.once('value').then(snapshot => {
      const data = snapshot.val()
      if (data) {
        const userList: User[] = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key],
          }))
          .filter(user => user.isAdmin === 0) // Filter only customers
        setUsers(userList)
      } else {
        setUsers([])
      }
      setRefreshing(false)
    }).catch(() => {
      setRefreshing(false)
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Xác nhận xóa', 
      `Bạn có chắc muốn xóa khách hàng "${userName}"?`,
      [
        { 
          text: 'Hủy', 
          style: 'cancel' 
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await database().ref(`/users/${userId}`).remove()
              Alert.alert('Thành công', 'Đã xóa khách hàng thành công')
              fetchUsers()
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa khách hàng')
            }
          },
        },
      ]
    )
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Không rõ'
    const date = new Date(timestamp)
    return date.toLocaleDateString('vi-VN')
  }

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={24} color="#fff" />
        </View>
        
        <View style={styles.userDetails}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
          {item.createdAt && (
            <Text style={styles.date}>Ngày tạo: {formatDate(item.createdAt)}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteUser(item.id, item.name)}
      >
        <Ionicons name="trash-outline" size={22} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  )

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
        <Text style={styles.headerTitle}>Quản lý khách hàng</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Content */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchUsers}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Không có khách hàng nào</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  )
}

export default QlKhachHang

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
  },
})