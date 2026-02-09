import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';


const BusinessProfileFooter = ({ }) => {

    return (
        <View style={styles.footerRow}>

            <View style={styles.footerItem}>
                <AntDesign name="safety" size={24} color="#000" />
                <Text style={styles.footerText}>Advanced</Text>
                <Text style={styles.footerText}>Encryption</Text>
            </View>

            <View style={styles.footerItem}>
                <AntDesign name="safety" size={24} color="#000" />
                <Text style={styles.footerText}>FSSAI</Text>
                <Text style={styles.footerText}>Compliant</Text>
            </View>

            <View style={styles.footerItem}>
                <AntDesign name="safety" size={24} color="#000" />
                <Text style={styles.footerText}>Secure</Text>
                <Text style={styles.footerText}>Storage</Text>
            </View>

        </View>
    )
}

export default BusinessProfileFooter

const styles = StyleSheet.create({

    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },

    footerItem: {
        alignItems: 'center',
        width: '30%',
    },

    footerText: {
        fontSize: 11,
        textAlign: 'center',
    }
})