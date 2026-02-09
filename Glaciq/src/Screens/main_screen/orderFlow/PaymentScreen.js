import React, { useState, useContext, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import RazorpayCheckout from 'react-native-razorpay'
import api from '../../../utils/api'
import { CartContext } from '../../../../context/CartContext'

const GOLD = '#B59A3A'

const PaymentScreen = ({ route, navigation }) => {
    const { cartItems, address } = route.params
    const { clearCart } = useContext(CartContext)

    const [method, setMethod] = useState('COD')
    const [loading, setLoading] = useState(false)

    const itemsTotal = cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    )
    const totalAmount = itemsTotal

    const placeCODOrder = async () => {
        setLoading(true)
        try {
            const res = await api.post('/order/create', {
                items: cartItems,
                address,
                paymentMethod: 'COD',
            })

            await clearCart()
            navigation.navigate('OrderSuccess', { order: res.data.order })
        } catch {
            Alert.alert('Error', 'Order failed')
        } finally {
            setLoading(false)
        }
    }

    const startOnlinePayment = async () => {
        try {
            setLoading(true)

            // 1. Create DB order
            const res = await api.post('/order/create', {
                items: cartItems,
                address,
                paymentMethod: method,
            })

            const order = res.data.order

            // 2. Create Razorpay order
            const { data: rpOrder } = await api.post('/payment/create-order', {
                orderId: order._id,
            })

            const options = {
                key: rpOrder.key,
                amount: rpOrder.amount,
                currency: 'INR',
                name: 'GLACIQ',
                description: 'Water Order',
                order_id: rpOrder.id,
                prefill: {
                    contact: address.phone,
                },
                theme: { color: GOLD },
            }

            const payment = await RazorpayCheckout.open(options)

            // 3. Verify
            await api.post('/payment/verify', {
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature,
                orderId: order._id,
            })

            await clearCart()
            navigation.navigate('OrderSuccess', { order })
        } catch (e) {
            Alert.alert('Payment Failed', 'Try again')
        } finally {
            setLoading(false)
        }
    }

    const handlePay = () => {
        if (method === 'COD') return placeCODOrder()
        startOnlinePayment()
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment Method</Text>

            {['UPI', 'CARD', 'COD'].map(m => (
                <TouchableOpacity
                    key={m}
                    style={[styles.option, method === m && styles.selected]}
                    onPress={() => setMethod(m)}
                >
                    <Text>{m}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity
                style={styles.payBtn}
                onPress={handlePay}
                disabled={loading}
            >
                <Text style={styles.payText}>
                    {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default PaymentScreen

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
    option: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 10,
    },
    selected: {
        borderColor: GOLD,
        backgroundColor: '#fdf8e8',
    },
    payBtn: {
        backgroundColor: GOLD,
        padding: 16,
        borderRadius: 30,
        marginTop: 'auto',
    },
    payText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
})