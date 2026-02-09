import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Switch,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import api from '../../../utils/api'

const GOLD = '#B59A3A'

const AddAddressScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [line1, setLine1] = useState('')
    const [line2, setLine2] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [pincode, setPincode] = useState('')
    const [isDefault, setIsDefault] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        if (!name || !phone || !line1 || !city || !pincode) {
            Alert.alert('Error', 'Please fill all required fields')
            return
        }

        setLoading(true)
        try {
            await api.post('/address', {
                name,
                phone,
                line1,
                line2,
                city,
                state,
                pincode,
                isDefault,
            })
            Alert.alert('Success', 'Address added successfully')
            navigation.goBack()
        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Failed to add address')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Address</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter full name"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={10}
                />

                <Text style={styles.label}>Address Line 1 *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="House/Flat No., Building Name"
                    value={line1}
                    onChangeText={setLine1}
                />

                <Text style={styles.label}>Address Line 2</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Street, Area, Landmark"
                    value={line2}
                    onChangeText={setLine2}
                />

                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>City *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>State</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="State"
                            value={state}
                            onChangeText={setState}
                        />
                    </View>
                </View>

                <Text style={styles.label}>Pincode *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Pincode"
                    value={pincode}
                    onChangeText={setPincode}
                    keyboardType="number-pad"
                    maxLength={6}
                />

                <View style={styles.defaultRow}>
                    <Text style={styles.defaultLabel}>Set as default address</Text>
                    <Switch
                        value={isDefault}
                        onValueChange={setIsDefault}
                        trackColor={{ false: '#ddd', true: GOLD }}
                        thumbColor="#fff"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveText}>
                        {loading ? 'Saving...' : 'Save Address'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default AddAddressScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    form: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    defaultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 24,
        paddingVertical: 12,
    },
    defaultLabel: {
        fontSize: 16,
    },
    saveBtn: {
        backgroundColor: GOLD,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})