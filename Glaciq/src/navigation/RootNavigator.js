import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import IntroNavigator from './IntroNavigator';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import Loading from '../Screens/Loading';
import { AuthContext } from '../../context/authContext';

const Stack = createNativeStackNavigator();


const RootNavigator = () => {
  const { state } = useContext(AuthContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  // loading simulation
  useEffect(() => {
    // If admin is logged in, redirect to dashboard immediately
    if (!state.loading && state.adminToken) {
      // Small delay to ensure navigation is ready/mounted
      setTimeout(() => {
        router.replace('/admin/dashboard');
      }, 100);
    }
    setTimeout(() => setIsLoading(false), 2000);
  }, [state.loading, state.adminToken]);

  if (isLoading || state.hasSeenIntro === undefined) {
    return <Loading />;
  }

  if (state.loading) {
    return null
  }

  if (state.adminToken) return null;


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!state.hasSeenIntro ? (
        <Stack.Screen name="IntroNavigator" component={IntroNavigator} />
      ) : state.accessToken ? (
        <Stack.Screen name="MainNavigator" component={MainNavigator} />
      ) : (
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      )}
    </Stack.Navigator>

    // <Stack.Navigator screenOptions={{ headerShown: false }}>
    //   {!state.token ? (
    //     <Stack.Screen name="IntroNavigator" component={IntroNavigator} />
    //   ) : (
    //     <Stack.Screen name="MainNavigator" component={MainNavigator} />
    //   )}
    // </Stack.Navigator>

  );
};

export default RootNavigator;
