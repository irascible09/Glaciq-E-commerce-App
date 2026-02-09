import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import IntroNavigator from './IntroNavigator'

const AppEntry = ({ navigation }) => {


    return (
        <View style={styles.container}>
            {/* <Text>AppEntry</Text> */}
            < IntroNavigator navigation={navigation} />
        </View>
    )
}

export default AppEntry

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
})