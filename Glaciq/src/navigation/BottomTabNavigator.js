import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome, AntDesign } from '@expo/vector-icons'

// screens (temporary placeholders)
import HomeStackNavigator from '../navigation/HomeStackNavigator';
import ProfileStackNavigator from '../navigation/ProfileStackNavigator';
import ShopStackNavigator from './ShopStackNavigator';
import OrderStackNavigator from './OrderStackNavigator';

const Tab = createBottomTabNavigator()

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#c5a330',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 6,
                    paddingTop: 6,
                },
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Home') {
                        return <FontAwesome name="home" size={22} color={color} />
                    }
                    if (route.name === 'Shop') {
                        return <AntDesign name="shop" size={22} color={color} />
                    }
                    if (route.name === 'Orders') {
                        return <FontAwesome name="list-ul" size={22} color={color} />
                    }
                    if (route.name === 'Profile') {
                        return <FontAwesome name="user-circle-o" size={22} color={color} />
                    }
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Shop" component={ShopStackNavigator} />
            <Tab.Screen name="Orders" component={OrderStackNavigator} />
            <Tab.Screen name="Profile" component={ProfileStackNavigator} />
        </Tab.Navigator>
    )
}

export default BottomTabNavigator

