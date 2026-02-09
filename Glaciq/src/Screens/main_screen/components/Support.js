import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const SupportScreen = () => {
    const handleEmail = () => {
        Linking.openURL('mailto:support@yourapp.com')
    }

    const handleCall = () => {
        Linking.openURL('tel:+919876543210')
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Ionicons name="headset-outline" size={48} color="#B59A3A" />

                <Text style={styles.title}>Contact Us</Text>
                <Text style={styles.subtitle}>
                    Need help? Our support team is here for you.
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleEmail}>
                    <Ionicons name="mail-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Email Support</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.outline]}
                    onPress={handleCall}
                >
                    <Ionicons name="call-outline" size={20} color="#B59A3A" />
                    <Text style={[styles.buttonText, { color: '#B59A3A' }]}>
                        Call Support
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SupportScreen

const GOLD = '#B59A3A'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 14,
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: GOLD,
        paddingVertical: 14,
        width: '100%',
        borderRadius: 30,
        marginTop: 14,
    },
    outline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: GOLD,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
})

