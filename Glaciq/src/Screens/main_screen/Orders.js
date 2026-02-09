import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import api from '../../utils/api'

const GOLD = '#B59A3A'

const Orders = ({ navigation }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/order')
      setOrders(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadOrders()
    }, [])
  )

  const onRefresh = () => {
    setRefreshing(true)
    loadOrders()
  }

  // Separate active and past orders
  const activeStatuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY']
  const activeOrders = orders.filter(o => activeStatuses.includes(o.orderStatus))
  const pastOrders = orders.filter(o => !activeStatuses.includes(o.orderStatus))

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED': return '#2196F3'
      case 'CONFIRMED': return '#FF9800'
      case 'PREPARING': return '#9C27B0'
      case 'OUT_FOR_DELIVERY': return '#4CAF50'
      case 'DELIVERED': return '#4CAF50'
      case 'CANCELLED': return '#F44336'
      default: return '#666'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PLACED': return 'Order Placed'
      case 'CONFIRMED': return 'Confirmed'
      case 'PREPARING': return 'Preparing'
      case 'OUT_FOR_DELIVERY': return 'Out for Delivery'
      case 'DELIVERED': return 'Delivered'
      case 'CANCELLED': return 'Cancelled'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const OrderCard = ({ order, isActive }) => (
    <TouchableOpacity
      style={[styles.orderCard, isActive && styles.activeCard]}
      onPress={() => navigation.navigate('OrderDetails', { orderId: order._id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.orderStatus) }]}>
            {getStatusLabel(order.orderStatus)}
          </Text>
        </View>
      </View>

      <View style={styles.itemsPreview}>
        {order.items.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.itemText} numberOfLines={1}>
            {item.quantity}x {item.name}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>+{order.items.length - 2} more items</Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GOLD} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>
            Your orders will appear here
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={[
            ...(activeOrders.length > 0 ? [{ type: 'header', title: 'Active Orders' }] : []),
            ...activeOrders.map(o => ({ type: 'order', data: o, isActive: true })),
            ...(pastOrders.length > 0 ? [{ type: 'header', title: 'Previous Orders' }] : []),
            ...pastOrders.map(o => ({ type: 'order', data: o, isActive: false })),
          ]}
          keyExtractor={(item, index) => item.type === 'header' ? `header-${index}` : item.data._id}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <Text style={styles.sectionHeader}>{item.title}</Text>
              )
            }
            return <OrderCard order={item.data} isActive={item.isActive} />
          }}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[GOLD]}
            />
          }
        />
      )}
    </View>
  )
}

export default Orders

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  list: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: GOLD,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemsPreview: {
    marginBottom: 12,
  },
  itemText: {
    color: '#444',
    marginBottom: 2,
  },
  moreItems: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: GOLD,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#666',
  },
  emptySubtext: {
    color: '#999',
    marginTop: 8,
  },
  shopBtn: {
    backgroundColor: GOLD,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 24,
  },
  shopBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
})