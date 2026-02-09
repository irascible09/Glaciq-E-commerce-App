import React, { useCallback, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import api from '../../../utils/api'

const GOLD = '#B59A3A'

const SUBSCRIPTION_PLANS = [
    {
        id: '3',
        name: 'Healthy Hydration Plan',
        price: 1499,
        subscription: true,
        description: 'Perfect for daily hydration. Get premium water delivered to your door every month.',
        features: ['Daily Delivery', 'Free Delivery', 'Cancel Anytime'],
        image: require('../../../../assets/images/glass-bottle-with-silver-cap-realistic-plastic-bottle-for-water-on-a-white-background-3d-render-2H4F0CM.jpg'),
    },
    {
        id: '4',
        name: 'Monthly Hydration Plan',
        price: 1499,
        subscription: true,
        description: 'Our most popular plan. Ensure you never run out of fresh water.',
        features: ['Flexible Schedule', 'Priority Support', 'Monthly Billing'],
        image: require('../../../../assets/images/glass-bottle-with-silver-cap-realistic-plastic-bottle-for-water-on-a-white-background-3d-render-2H4F0CM.jpg'),
    },
]

export default function Subscriptions({ navigation }) {
    const [mySubscriptions, setMySubscriptions] = useState([])

    useFocusEffect(
        useCallback(() => {
            fetchSubscriptions()
        }, [])
    )

    const fetchSubscriptions = async () => {
        try {
            const { data } = await api.get('/subscription')
            setMySubscriptions(data)
        } catch (error) {
            console.log('Error fetching subscriptions:', error)
        }
    }

    const renderMySubscription = ({ item }) => (
        <View style={styles.activeSubCard}>
            <View style={styles.activeSubHeader}>
                <Text style={styles.activeSubTitle}>{item.plan.name}</Text>
                <View style={[styles.statusBadge, item.status === 'ACTIVE' ? styles.statusActive : styles.statusPaused]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
            <Text style={styles.activeSubInfo}>Next Delivery: {new Date(item.nextDeliveryDate).toDateString()}</Text>
            <Text style={styles.activeSubInfo}>{item.quantityPerDelivery} bottles • {item.frequency}</Text>
        </View>
    )

    const renderPlan = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SubscriptionSetupScreen', { plan: item })}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}<Text style={styles.period}>/month</Text></Text>

                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.features}>
                    {item.features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <Ionicons name="checkmark-circle" size={16} color={GOLD} />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.btn}>
                    <Text style={styles.btnText}>Choose Plan</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Subscription Plans</Text>
            </View>

            {mySubscriptions.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Subscriptions</Text>
                    <FlatList
                        data={mySubscriptions}
                        renderItem={renderMySubscription}
                        keyExtractor={item => item._id}
                        scrollEnabled={false}
                    />
                </View>
            )}

            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Stay Hydrated, Effortlessly</Text>
                <Text style={styles.heroSubtitle}>Choose a plan that works best for your lifestyle.</Text>
            </View>

            <FlatList
                data={SUBSCRIPTION_PLANS}
                renderItem={renderPlan}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    header: {
        marginTop: 50,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 16,
    },
    hero: {
        marginBottom: 30,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: GOLD,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 24,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 20,
    },
    image: {
        width: 100,
        height: 120,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    price: {
        fontSize: 24,
        fontWeight: '800',
        color: GOLD,
        marginBottom: 12,
    },
    period: {
        fontSize: 14,
        color: '#666',
        fontWeight: '400',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    features: {
        marginBottom: 20,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#444',
    },
    btn: {
        backgroundColor: GOLD,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#333',
    },
    activeSubCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: GOLD,
        marginBottom: 10,
        backgroundColor: '#FFFdf0',
    },
    activeSubHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    activeSubTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: GOLD,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusActive: {
        backgroundColor: '#E8F5E9',
    },
    statusPaused: {
        backgroundColor: '#FFF3E0',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
    },
    activeSubInfo: {
        color: '#666',
        fontSize: 14,
        marginBottom: 4,
    },
})
