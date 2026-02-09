import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Profile from '../Screens/main_screen/Profile'
import Support from '../Screens/main_screen/components/Support'
import Subscriptions from '../Screens/main_screen/components/Subscriptions'
import SubscriptionSetupScreen from '../Screens/main_screen/components/SubscriptionSetupScreen'
import SubscriptionCheckoutScreen from '../Screens/main_screen/components/SubscriptionCheckoutScreen'
import SavedAddressesScreen from '../Screens/main_screen/profilecomponents/SavedAdressesScreen'
import EditAddressScreen from '../Screens/main_screen/profilecomponents/EditAddressScreen'
import AddAddressScreen from '../Screens/main_screen/profilecomponents/AddAddressScreen'
import SelectAddressScreen from '../Screens/main_screen/orderFlow/SelectAddressScreen'
import OrderSuccess from '../Screens/main_screen/orderFlow/OrderSuccess'

const Stack = createNativeStackNavigator()

export default function ProfileStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileMain" component={Profile} />
            <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="Subscriptions" component={Subscriptions} />
            <Stack.Screen name="SubscriptionSetupScreen" component={SubscriptionSetupScreen} />
            <Stack.Screen name="SubscriptionCheckout" component={SubscriptionCheckoutScreen} />
            <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
            <Stack.Screen name="EditAddress" component={EditAddressScreen} />
            <Stack.Screen name="AddAddress" component={AddAddressScreen} />
            <Stack.Screen name="SelectAddress" component={SelectAddressScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccess} />

            {/* <Stack.Screen name="EditProfile" component={EditProfile} /> */}
        </Stack.Navigator>
    )
}
