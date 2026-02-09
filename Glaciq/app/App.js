import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RootNavigator from '../src/navigation/RootNavigator'
import { AuthProvider } from '../context/authContext';
import { CartProvider } from '../context/CartContext';
import setupAxiosInterceptor from '../src/utils/axiosInterceptor'
import { useEffect } from 'react'

const App = () => {

  return (
    <RootNavigator />
  )
}

export default App

const styles = StyleSheet.create({})