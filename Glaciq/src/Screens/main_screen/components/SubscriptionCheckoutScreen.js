import React, { useState, useContext } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import api from '../../../utils/api'
import { AuthContext } from '../../../../context/authContext'

const GOLD = '#B59A3A'

export default function SubscriptionCheckoutScreen({ route, navigation }) {
    const { subscription, plan } = route.params
    const { state } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('COD')

    const calculateTotal = () => {
        // Approximate monthly cost based on monthly quantity
        return subscription.monthlyQuantity * plan.price
    }

    const handlePlaceOrder = async () => {
        setLoading(true)
        try {
            // Construct payload for backend
            const payload = {
                plan: {
                    planId: plan.id,
                    name: plan.name,
                    pricePerMonth: plan.price,
                },
                frequency: subscription.frequency,
                quantityPerDelivery: subscription.quantityPerDelivery,
                deliveriesPerMonth: subscription.deliveriesPerMonth,
                monthlyQuantity: subscription.monthlyQuantity,
                deliverySlot: subscription.deliverySlot,
                startDate: subscription.startDate,
                addressId: subscription.addressId,
                paymentMethod,
                paymentToken: paymentMethod === 'COD' ? 'cod_token' : 'online_token', // Placeholder
            }

            const { data } = await api.post('/subscription/create', payload)

            if (data.success) {
                Alert.alert('Success', 'Subscription active!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('OrderSuccess', {
                            isSubscription: true,
                            message: 'Your subscription is now active.'
                        }),
                    },
                ])
            }
        } catch (error) {
            console.log('Subscription error:', error)
            Alert.alert('Error', 'Failed to create subscription. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Review Subscription</Text>
            </View>

            {/* Plan Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Plan Details</Text>
                <View style={styles.card}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.rowText}>Frequency: <Text style={styles.bold}>{subscription.frequency}</Text></Text>
                    <Text style={styles.rowText}>Start Date: <Text style={styles.bold}>{new Date(subscription.startDate).toDateString()}</Text></Text>
                    <Text style={styles.rowText}>Slot: <Text style={styles.bold}>{subscription.deliverySlot}</Text></Text>
                    <Text style={styles.rowText}>Qty/Delivery: <Text style={styles.bold}>{subscription.quantityPerDelivery}</Text></Text>
                </View>
            </View>

            {/* Billing Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Billing Estimate</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text>Monthly Bottles</Text>
                        <Text>{subscription.monthlyQuantity}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Price per Bottle</Text>
                        <Text>₹{plan.price / 30 /* roughly */}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.totalText}>Est. Monthly Total</Text>
                        <Text style={styles.totalAmount}>₹{subscription.monthlyQuantity * (plan.price / 30)}</Text>
                    </View>
                    <Text style={styles.note}>*You will be billed monthly or per delivery based on payment selection.</Text>
                </View>
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Method</Text>

                <TouchableOpacity
                    style={[styles.paymentOption, paymentMethod === 'COD' && styles.paymentOptionActive]}
                    onPress={() => setPaymentMethod('COD')}
                >
                    <MaterialIcons name="money" size={24} color={paymentMethod === 'COD' ? GOLD : '#666'} />
                    <Text style={styles.paymentText}>Cash on Delivery</Text>
                    {paymentMethod === 'COD' && <Ionicons name="checkmark-circle" size={24} color={GOLD} />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.paymentOption, paymentMethod === 'CARD' && styles.paymentOptionActive]}
                    onPress={() => setPaymentMethod('CARD')}
                >
                    <MaterialIcons name="credit-card" size={24} color={paymentMethod === 'CARD' ? GOLD : '#666'} />
                    <Text style={styles.paymentText}>Pay Online / UPI</Text>
                    {paymentMethod === 'CARD' && <Ionicons name="checkmark-circle" size={24} color={GOLD} />}
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={{ height: 100 }} />

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.confirmText}>Confirm Subscription</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
        color: '#333',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    planName: {
        fontSize: 18,
        fontWeight: '700',
        color: GOLD,
        marginBottom: 10,
    },
    rowText: {
        marginBottom: 6,
        color: '#555',
    },
    bold: {
        fontWeight: '600',
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '700',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: GOLD,
    },
    note: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
        fontStyle: 'italic',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    paymentOptionActive: {
        borderColor: GOLD,
        backgroundColor: '#FFFdf0',
    },
    paymentText: {
        flex: 1,
        marginLeft: 12,
        fontWeight: '600',
        fontSize: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    confirmBtn: {
        backgroundColor: GOLD,
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
})
