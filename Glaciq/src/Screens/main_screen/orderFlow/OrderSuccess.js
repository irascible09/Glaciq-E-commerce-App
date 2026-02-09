import React, { useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CommonActions } from '@react-navigation/native'

const GOLD = '#B59A3A'

const OrderSuccess = ({ route, navigation }) => {
    const { order } = route.params || {}

    const goToOrders = () => {
        // Reset navigation and go to Orders tab
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'MainTabs',
                        state: {
                            routes: [
                                { name: 'Home' },
                                { name: 'Shop' },
                                { name: 'Orders' },
                                { name: 'Profile' },
                            ],
                            index: 2, // Orders tab
                        },
                    },
                ],
            })
        )
    }

    const goToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'MainTabs',
                        state: {
                            routes: [
                                { name: 'Home' },
                                { name: 'Shop' },
                                { name: 'Orders' },
                                { name: 'Profile' },
                            ],
                            index: 0, // Home tab
                        },
                    },
                ],
            })
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={100} color={GOLD} />
                </View>

                <Text style={styles.title}>Order Placed!</Text>
                <Text style={styles.subtitle}>
                    Your order has been placed successfully
                </Text>

                {order && (
                    <View style={styles.orderInfo}>
                        <Text style={styles.orderNumber}>
                            Order #{order.orderNumber}
                        </Text>
                        <Text style={styles.orderAmount}>
                            Total: ₹{order.totalAmount}
                        </Text>
                    </View>
                )}

                <Text style={styles.message}>
                    You will receive a confirmation shortly.
                    Track your order in the Orders section.
                </Text>
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity style={styles.primaryBtn} onPress={goToOrders}>
                    <Ionicons name="receipt-outline" size={20} color="#fff" />
                    <Text style={styles.primaryBtnText}>View Orders</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryBtn} onPress={goToHome}>
                    <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OrderSuccess

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    orderInfo: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'center',
        width: '100%',
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: GOLD,
    },
    orderAmount: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 8,
    },
    message: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 22,
    },
    buttons: {
        padding: 20,
    },
    primaryBtn: {
        backgroundColor: GOLD,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 30,
        marginBottom: 12,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    secondaryBtn: {
        borderWidth: 1,
        borderColor: GOLD,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: GOLD,
        fontSize: 16,
        fontWeight: '600',
    },
})