import React, { useState, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const GOLD = '#B59A3A'

// Generate next 7 days for date selection
const getNextDays = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        days.push(date)
    }
    return days
}

export default function SubscriptionSetup({ route, navigation }) {
    // Default plan if not passed from params
    const plan = route.params?.plan || {
        id: 'default',
        name: 'Monthly Hydration Plan',
        price: 1499,
    }

    const [frequency, setFrequency] = useState('DAILY')
    const [quantity, setQuantity] = useState(1)
    const [startDate, setStartDate] = useState(new Date())
    const [deliverySlot, setDeliverySlot] = useState('MORNING')
    const [addressId, setAddressId] = useState(null)

    const availableDates = useMemo(() => getNextDays(), [])

    const deliveriesPerMonth = useMemo(() => {
        switch (frequency) {
            case 'DAILY':
                return 30
            case 'ALTERNATE':
                return 15
            case 'WEEKLY':
                return 4
            default:
                return 0
        }
    }, [frequency])

    const monthlyQuantity = deliveriesPerMonth * quantity

    const proceed = () => {
        if (!addressId) {
            alert('Please select a delivery address')
            return
        }

        navigation.navigate('SubscriptionCheckout', {
            subscription: {
                planId: plan.id,
                frequency,
                quantityPerDelivery: quantity,
                deliveriesPerMonth,
                monthlyQuantity,
                startDate: startDate.toISOString(), // Serialize date for navigation
                deliverySlot,
                addressId,
            },
        })
    }

    const formatDate = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Subscription Setup</Text>
            </View>

            {/* Plan */}
            <View style={styles.card}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>₹{plan.price}/month</Text>
            </View>

            {/* Frequency */}
            <Text style={styles.sectionTitle}>Delivery Frequency</Text>
            <View style={styles.row}>
                {['DAILY', 'ALTERNATE', 'WEEKLY'].map(item => (
                    <Option
                        key={item}
                        label={item}
                        active={frequency === item}
                        onPress={() => setFrequency(item)}
                    />
                ))}
            </View>

            {/* Quantity per delivery */}
            <Text style={styles.sectionTitle}>Bottles per delivery</Text>
            <View style={styles.counter}>
                <CounterBtn onPress={() => setQuantity(Math.max(1, quantity - 1))} />
                <Text style={styles.qty}>{quantity}</Text>
                <CounterBtn onPress={() => setQuantity(quantity + 1)} plus />
            </View>

            {/* Monthly Summary */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>
                    Deliveries / Month: <Text style={styles.bold}>{deliveriesPerMonth}</Text>
                </Text>
                <Text style={styles.summaryText}>
                    Total Bottles / Month:{' '}
                    <Text style={styles.bold}>{monthlyQuantity}</Text>
                </Text>
            </View>

            {/* Start Date */}
            <Text style={styles.sectionTitle}>Start Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
                {availableDates.map((date, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dateOption,
                            startDate.toDateString() === date.toDateString() && styles.dateOptionActive
                        ]}
                        onPress={() => setStartDate(date)}
                    >
                        <Text style={[
                            styles.dateText,
                            startDate.toDateString() === date.toDateString() && { color: '#fff' }
                        ]}>
                            {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : formatDate(date)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Slot */}
            <Text style={styles.sectionTitle}>Delivery Slot</Text>
            <View style={styles.row}>
                {['MORNING', 'EVENING'].map(slot => (
                    <Option
                        key={slot}
                        label={slot}
                        active={deliverySlot === slot}
                        onPress={() => setDeliverySlot(slot)}
                    />
                ))}
            </View>

            {/* Address */}
            <TouchableOpacity
                style={styles.addressBtn}
                onPress={() =>
                    navigation.navigate('AddressSelect', {
                        onSelect: id => setAddressId(id),
                    })
                }
            >
                <Text>
                    {addressId ? 'Address Selected' : 'Select Delivery Address'}
                </Text>
            </TouchableOpacity>

            {/* Proceed */}
            <TouchableOpacity style={styles.proceedBtn} onPress={proceed}>
                <Text style={styles.proceedText}>Proceed to Pay</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const Option = ({ label, active, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.option, active && styles.optionActive]}
    >
        <Text style={active && { color: '#fff' }}>{label}</Text>
    </TouchableOpacity>
)

const CounterBtn = ({ onPress, plus }) => (
    <TouchableOpacity onPress={onPress} style={styles.counterBtn}>
        <Text style={{ fontSize: 18 }}>{plus ? '+' : '-'}</Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: {
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
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 16,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    planName: {
        fontSize: 16,
        fontWeight: '700',
    },
    planPrice: {
        marginTop: 6,
        fontWeight: '600',
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    option: {
        borderWidth: 1,
        borderColor: GOLD,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    optionActive: {
        backgroundColor: GOLD,
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterBtn: {
        borderWidth: 1,
        borderRadius: 20,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qty: {
        marginHorizontal: 20,
        fontSize: 16,
        fontWeight: '600',
    },
    summaryCard: {
        backgroundColor: '#FFF8E1',
        borderRadius: 12,
        padding: 14,
        marginTop: 10,
    },
    summaryText: {
        fontSize: 14,
        marginBottom: 4,
    },
    bold: {
        fontWeight: '700',
    },
    dateScroll: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    dateOption: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        marginRight: 10,
        minWidth: 100,
        alignItems: 'center',
    },
    dateOptionActive: {
        backgroundColor: GOLD,
        borderColor: GOLD,
    },
    dateText: {
        fontWeight: '500',
        color: '#333',
    },
    addressBtn: {
        marginTop: 20,
        padding: 14,
        borderWidth: 1,
        borderRadius: 10,
    },
    proceedBtn: {
        backgroundColor: GOLD,
        padding: 16,
        borderRadius: 30,
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center',
    },
    proceedText: {
        color: '#fff',
        fontWeight: '700',
    },
})
