import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Intro1 from '../Screens/intro_screens/Intro1'
import Intro2 from '../Screens/intro_screens/Intro2'
import Intro3 from '../Screens/intro_screens/Intro3'
import AuthNavigator from './AuthNavigator'
import { AuthContext } from '../../context/authContext'

const IntroNavigator = ({ navigation }) => {

    const [introscreen, setintroscreen] = useState(1)

    const { completeIntro } = useContext(AuthContext)

    useEffect(() => {
        if (introscreen === 4) {
            completeIntro()
        }
    }, [introscreen])

    return (


        <View style={styles.container}>

            {introscreen == 1 &&
                <Intro1 navigation={navigation} introscreen={introscreen} setintroscreen={setintroscreen} />}

            {introscreen == 2 &&
                <Intro2 navigation={navigation} introscreen={introscreen} setintroscreen={setintroscreen} />}

            {introscreen == 3 &&
                <Intro3 navigation={navigation} introscreen={introscreen} setintroscreen={setintroscreen} />}


        </View>

    )

}

export default IntroNavigator

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
})