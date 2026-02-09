import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SelectAddressScreen from '../Screens/main_screen/orderFlow/SelectAddressScreen'
import PaymentScreen from '../Screens/main_screen/orderFlow/PaymentScreen'
import OrderSuccess from '../Screens/main_screen/orderFlow/OrderSuccess'
import OrderDetailsScreen from '../Screens/main_screen/orderFlow/OrderDetailsScreen'
import Orders from '../Screens/main_screen/Orders'

const Stack = createNativeStackNavigator()

export default function OrderStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OrdersMain" component={Orders} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
            <Stack.Screen name="SelectAddress" component={SelectAddressScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
        </Stack.Navigator>
    )
}
