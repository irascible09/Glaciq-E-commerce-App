import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import api from '../../../utils/api'

import RazorpayCheckout from 'react-native-razorpay'

const GOLD = '#B59A3A'

const OrderDetailsScreen = ({ route, navigation }) => {


    const { orderId } = route.params
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadOrder()
    }, [])

    const loadOrder = async () => {
        try {
            const { data } = await api.get(`/order/${orderId}`)
            setOrder(data)
        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Failed to load order details')
        } finally {
            setLoading(false)
        }
    }

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

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'PAID': return '#4CAF50'
            case 'PENDING': return '#FF9800'
            case 'FAILED': return '#F44336'
            case 'REFUNDED': return '#2196F3'
            default: return '#666'
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const handleRetryPayment = async () => {
        try {
            const { data: rpOrder } = await api.post('/payment/retry', {
                orderId,
            })

            const options = {
                key: rpOrder.key,
                amount: rpOrder.amount,
                currency: 'INR',
                name: 'GLACIQ',
                description: 'Retry Payment',
                order_id: rpOrder.id,
                theme: { color: GOLD },
            }

            const payment = await RazorpayCheckout.open(options)

            await api.post('/payment/verify', {
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature,
                orderId,
            })

            Alert.alert('Success', 'Payment completed')
            loadOrder()
        } catch (e) {
            Alert.alert('Failed', 'Payment not completed')
        }
    }


    const handleCancelOrder = () => {
        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.patch(`/order/${orderId}/cancel`)
                            Alert.alert('Success', 'Order cancelled successfully')
                            loadOrder() // Reload to show updated status
                        } catch (error) {
                            console.log(error)
                            Alert.alert('Error', 'Failed to cancel order')
                        }
                    },
                },
            ]
        )
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={GOLD} />
            </View>
        )
    }

    if (!order) {
        return (
            <View style={styles.errorContainer}>
                <Text>Order not found</Text>
            </View>
        )
    }

    const canCancel = ['PLACED', 'CONFIRMED'].includes(order.orderStatus)

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Order Info */}
                <View style={styles.section}>
                    <View style={styles.orderHeader}>
                        <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                        <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                    </View>

                    {/* Status Badges */}
                    <View style={styles.statusRow}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) + '20' }]}>
                            <Ionicons name="cube-outline" size={16} color={getStatusColor(order.orderStatus)} />
                            <Text style={[styles.statusText, { color: getStatusColor(order.orderStatus) }]}>
                                {getStatusLabel(order.orderStatus)}
                            </Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getPaymentStatusColor(order.paymentStatus) + '20' }]}>
                            <Ionicons name="card-outline" size={16} color={getPaymentStatusColor(order.paymentStatus)} />
                            <Text style={[styles.statusText, { color: getPaymentStatusColor(order.paymentStatus) }]}>
                                {order.paymentStatus === 'PAID' ? 'Paid' : 'Payment Pending'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items Ordered</Text>
                    {order.items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>₹{item.subtotal || item.price * item.quantity}</Text>
                        </View>
                    ))}
                </View>

                {/* Delivery Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <View style={styles.addressCard}>
                        <Text style={styles.addressName}>{order.deliveryAddress?.name}</Text>
                        <Text style={styles.addressLine}>{order.deliveryAddress?.line1}</Text>
                        {order.deliveryAddress?.line2 && (
                            <Text style={styles.addressLine}>{order.deliveryAddress?.line2}</Text>
                        )}
                        <Text style={styles.addressLine}>
                            {order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}
                        </Text>
                        <Text style={styles.addressPhone}>{order.deliveryAddress?.phone}</Text>
                    </View>
                </View>

                {/* Payment Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment</Text>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Payment Method</Text>
                        <Text style={styles.paymentValue}>{order.paymentMethod}</Text>
                    </View>
                </View>

                {/* Price Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Details</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Items Total</Text>
                        <Text style={styles.priceValue}>₹{order.itemsTotal || order.totalAmount}</Text>
                    </View>
                    {order.deliveryFee !== undefined && (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Delivery Fee</Text>
                            <Text style={[styles.priceValue, order.deliveryFee === 0 && { color: 'green' }]}>
                                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                            </Text>
                        </View>
                    )}
                    {order.discount > 0 && (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Discount</Text>
                            <Text style={[styles.priceValue, { color: 'green' }]}>-₹{order.discount}</Text>
                        </View>
                    )}
                    <View style={[styles.priceRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
                    </View>
                </View>

                {order.paymentMethod !== 'COD' &&
                    ['FAILED', 'PENDING'].includes(order.paymentStatus) && (
                        <TouchableOpacity
                            style={styles.retryBtn}
                            onPress={handleRetryPayment}
                        >
                            <Text style={styles.retryText}>Retry Payment</Text>
                        </TouchableOpacity>
                    )}

                {/* Cancel Button */}
                {canCancel && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelOrder}>
                        <Text style={styles.cancelText}>Cancel Order</Text>
                    </TouchableOpacity>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    )
}

export default OrderDetailsScreen

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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    orderHeader: {
        marginBottom: 12,
    },
    orderNumber: {
        fontSize: 20,
        fontWeight: '700',
    },
    orderDate: {
        color: '#666',
        marginTop: 4,
    },
    statusRow: {
        flexDirection: 'row',
        gap: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '500',
    },
    itemQty: {
        color: '#666',
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '600',
    },
    addressCard: {
        backgroundColor: '#f9f9f9',
        padding: 14,
        borderRadius: 10,
    },
    addressName: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    addressLine: {
        color: '#444',
        lineHeight: 20,
    },
    addressPhone: {
        color: '#666',
        marginTop: 6,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        padding: 14,
        borderRadius: 10,
    },
    paymentLabel: {
        color: '#666',
    },
    paymentValue: {
        fontWeight: '600',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceLabel: {
        color: '#666',
    },
    priceValue: {
        fontWeight: '500',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: GOLD,
    },
    cancelBtn: {
        borderWidth: 1,
        borderColor: '#F44336',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    cancelText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: '600',
    },

    retryBtn: {
        backgroundColor: GOLD,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 16,
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})
