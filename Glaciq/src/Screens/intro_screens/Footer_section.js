import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import React, { useState } from 'react'


const Footer_section = ({ introscreen, setintroscreen, navigation }) => {

    const nextscreenhandler = () => {
        if (introscreen == 1) {
            setintroscreen(2)

        }
        else if (introscreen == 2) {
            setintroscreen(3)

        }
        else if (introscreen == 3) {
            setintroscreen(4)
        }
    }

    return (
        <View style={styles.footercontainer}>
            <TouchableOpacity style={styles.next} onPress={nextscreenhandler}>
                <Text style={{ color: 'white', fontWeight: 600, fontSize: 18, }}>Next</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skip} onPress={() => { setintroscreen(4) }}>
                <Text style={{ color: '#736363c8', fontWeight: 600, fontSize: 17, }}>Skip</Text>
            </TouchableOpacity>


        </View>
    )
}

export default Footer_section

const styles = StyleSheet.create({

    next: {
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 20,
        width: 300,
        padding: 8,
        marginVertical: 30,
        backgroundColor: '#000000'

    },

    skip: {
        alignItems: 'center',


    },

    footercontainer: {

        alignItems: 'center',

    },
})