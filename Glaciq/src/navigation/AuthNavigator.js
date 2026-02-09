import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../Screens/auth_screens/Login'
import Register from '../Screens/auth_screens/Register'
import BusinessStep1 from '../Screens/business_account_screens/BusinessStep1'
import BusinessStep2 from '../Screens/business_account_screens/BusinessStep2'
import BusinessStep3 from '../Screens/business_account_screens/BusinessStep3'
import ComingSoon from '../Screens/business_account_screens/ComingSoon'
const AuthNavigator = () => {

    const Stack = createNativeStackNavigator();
    return (

        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="BusinessStep1" component={BusinessStep1} />
            <Stack.Screen name="BusinessStep2" component={BusinessStep2} />
            <Stack.Screen name="BusinessStep3" component={BusinessStep3} />
            <Stack.Screen name="ComingSoon" component={ComingSoon} />
        </Stack.Navigator>

    )
}

export default AuthNavigator

const styles = StyleSheet.create({})