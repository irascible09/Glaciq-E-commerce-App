import React, { useEffect, useState, useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import api from '../../../utils/api'

const GOLD = '#B59A3A'

const SavedAddressesScreen = ({ navigation }) => {
    const [addresses, setAddresses] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const loadAddresses = async () => {
        try {
            const { data } = await api.get('/address')
            setAddresses(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    // Reload addresses when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadAddresses()
        }, [])
    )

    const onRefresh = () => {
        setRefreshing(true)
        loadAddresses()
    }

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
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Addresses</Text>
                <View style={{ width: 24 }} />
            </View>

            {addresses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="location-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No saved addresses</Text>
                    <Text style={styles.emptySubtext}>
                        Add an address for faster checkout
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[GOLD]}
                        />
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate('EditAddress', { address: item })
                            }
                        >
                            <View style={styles.cardRow}>
                                <View style={styles.cardContent}>
                                    <View style={styles.nameRow}>
                                        <Text style={styles.name}>{item.name}</Text>
                                        {item.isDefault && (
                                            <View style={styles.defaultBadge}>
                                                <Text style={styles.defaultText}>Default</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.phone}>{item.phone}</Text>
                                    <Text style={styles.addressLine}>{item.line1}</Text>
                                    {item.line2 && (
                                        <Text style={styles.addressLine}>{item.line2}</Text>
                                    )}
                                    <Text style={styles.addressLine}>
                                        {item.city}{item.state ? `, ${item.state}` : ''} - {item.pincode}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#999"
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Add Address Button */}
            <TouchableOpacity
                style={styles.addBtn}
                onPress={() => navigation.navigate('AddAddress')}
            >
                <Ionicons name="add" size={24} color="#fff" />
                <Text style={styles.addText}>Add New Address</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SavedAddressesScreen

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
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    defaultBadge: {
        backgroundColor: GOLD,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    defaultText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    phone: {
        color: '#666',
        marginBottom: 6,
    },
    addressLine: {
        color: '#444',
        lineHeight: 20,
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
        textAlign: 'center',
    },
    addBtn: {
        flexDirection: 'row',
        backgroundColor: GOLD,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
    },
    addText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
})
