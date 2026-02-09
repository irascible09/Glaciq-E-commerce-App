import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import api from '../../../utils/api'

const GOLD = '#B59A3A'

const SelectAddressScreen = ({ route, navigation }) => {
    // Safely destructure params
    const { cartItems, onSelect } = route.params || {}
    const [addresses, setAddresses] = useState([])

    useFocusEffect(
        useCallback(() => {
            api.get('/address').then(res => setAddresses(res.data))
        }, [])
    )

    const handleSelect = (item) => {
        if (onSelect) {
            onSelect(item._id)
            navigation.goBack()
        } else {
            navigation.navigate('Payment', {
                cartItems,
                address: item,
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Address</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={addresses}
                keyExtractor={i => i._id}
                contentContainerStyle={{ paddingBottom: 80 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelect(item)}
                    >
                        <Text style={styles.line1}>{item.line1}</Text>
                        <Text style={styles.city}>{item.city}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No addresses found.</Text>
                }
            />

            <TouchableOpacity
                style={styles.addBtn}
                onPress={() => navigation.navigate('AddAddress')}
            >
                <Text style={styles.addBtnText}>+ Add New Address</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SelectAddressScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 40,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 2,
    },
    line1: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    city: {
        color: '#666',
        fontSize: 14,
    },
    addBtn: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: GOLD,
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 5,
    },
    addBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 50,
    },
})
