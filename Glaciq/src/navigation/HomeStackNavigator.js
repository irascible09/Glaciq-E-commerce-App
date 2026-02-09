import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../Screens/main_screen/Home'
import Shop from '../Screens/main_screen/Shop'
import Cart from '../Screens/main_screen/components/Cart'
import TrackOrder from '../Screens/main_screen/components/TrackOrder'
import Subscriptions from '../Screens/main_screen/components/Subscriptions'
import SubscriptionSetupScreen from '../Screens/main_screen/components/SubscriptionSetupScreen'
import SubscriptionCheckoutScreen from '../Screens/main_screen/components/SubscriptionCheckoutScreen'
import Support from '../Screens/main_screen/components/Support'
import OrderStackNavigator from './OrderStackNavigator'
import SelectAddressScreen from '../Screens/main_screen/orderFlow/SelectAddressScreen'
import AddAddressScreen from '../Screens/main_screen/profilecomponents/AddAddressScreen'
import OrderSuccess from '../Screens/main_screen/orderFlow/OrderSuccess'

const Stack = createNativeStackNavigator()

export default function HomeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={Home} />
            <Stack.Screen name="Shop" component={Shop} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="TrackOrder" component={TrackOrder} />
            <Stack.Screen name="Subscriptions" component={Subscriptions} />
            <Stack.Screen name="SubscriptionSetupScreen" component={SubscriptionSetupScreen} />
            <Stack.Screen name="SubscriptionCheckout" component={SubscriptionCheckoutScreen} />
            <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="OrderStackNavigator" component={OrderStackNavigator} />
            <Stack.Screen name="SelectAddress" component={SelectAddressScreen} />
            <Stack.Screen name="AddAddress" component={AddAddressScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccess} />



            {/* <Stack.Screen name="EditProfile" component={EditProfile} /> */}


        </Stack.Navigator>
    )
}
