import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ListSanPham = () => {
  const navigation = useNavigation<NavigationProp>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const refSanPham = database().ref('SanPham/');

    // Lắng nghe realtime cập nhật dữ liệu
    const onValueChange = refSanPham.on('value', snapshot => {
      const data = snapshot.val();
      const loadedProducts = data
        ? Object.entries(data).map(([id, value]: any) => ({
            id,
            ...value,
          }))
        : [];
      setProducts(loadedProducts);
      setLoading(false);
      setRefreshing(false);
    });

    // Cleanup khi component unmount
    return () => refSanPham.off('value', onValueChange);
  }, []);

  // Vẫn giữ nút refresh để người dùng tự kéo làm mới
  const fetchProducts = () => {
    setRefreshing(true);
    database()
      .ref('SanPham/')
      .once('value')
      .then(snapshot => {
        const data = snapshot.val();
        const loadedProducts = data
          ? Object.entries(data).map(([id, value]: any) => ({
              id,
              ...value,
            }))
          : [];
        setProducts(loadedProducts);
        setLoading(false);
        setRefreshing(false);
      });
  };

  const handlePress = (item: any) => {
    navigation.navigate('DetailSanPham', {
      id: item.id,
    });
  };

  const handleAddProduct = () => {
    navigation.navigate('AddSanPham');
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handlePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  const formatPrice = (price: string) => {
    if (!price.includes('VND') && !price.includes('₫')) {
      return `${price} ₫`;
    }
    return price;
  };

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

        <Text style={styles.title}>Danh sách sản phẩm</Text>

        <TouchableOpacity
          onPress={handleAddProduct}
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
          <TouchableOpacity style={styles.addProductButton} onPress={handleAddProduct}>
            <Text style={styles.addProductButtonText}>Thêm sản phẩm mới</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchProducts}
              colors={['#4CAF50']}
              tintColor="#4CAF50"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addProductButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  addProductButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  separator: {
    height: 12,
  },
});

export default ListSanPham;
