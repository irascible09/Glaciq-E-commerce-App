import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useState, useContext, useEffect } from 'react'
import React from 'react'
import { useRouter, Link } from 'expo-router';
import api from '@/src/utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';

import { AuthContext } from '@/context/authContext'

const Login = ({ navigation }) => {

    //global state
    const { state, login } = useContext(AuthContext)
    const router = useRouter(); // Expo Router hook

    //states
    const [email, setemail] = useState('')
    const [isvalid, setisvalid] = useState(false)
    const [password, setpassword] = useState('')

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '256469136602-tfnuldt0jde955d1fpbac25t4gkdu8bt.apps.googleusercontent.com',
            offlineAccess: true,
            forceCodeForRefreshToken: true,
        });
    }, []);


    const onGoogleButtonPress = async () => {
        try {
            await GoogleSignin.hasPlayServices();

            // Sign out first to allow choosing a different account
            await GoogleSignin.signOut();

            // Sign in - get user profile
            const userInfo = await GoogleSignin.signIn();
            console.log('USER INFO:', userInfo);

            // get token
            const tokens = await GoogleSignin.getTokens();
            console.log('TOKENS:', tokens);

            const idToken = tokens.idToken;
            console.log('FINAL ID TOKEN:', idToken);

            // token to backend
            const { data } = await api.post(
                '/auth/google-login',
                { idToken }
            );

            console.log('SUCCESS:', data);
            alert(data.message);

            // after Google login success
            await AsyncStorage.setItem('hasSeenIntro', 'true');
            login(data.user, data.accessToken, data.refreshToken)

        } catch (error) {
            // Handle user cancellation - don't proceed with login
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled the login flow');
                return; // Exit early, don't log in
            }

            if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Sign in is in progress');
                return;
            }

            if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services not available');
                return;
            }

            console.log('AXIOS ERROR DATA:', error.response?.data);
            console.log('RAW ERROR:', error);
            Alert.alert('Error', 'Google sign in failed. Please try again.');
        }
    };

    const onAppleButtonPress = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            // identity token
            const idToken = credential.identityToken;

            if (!idToken) {
                throw new Error('Apple ID token missing');
            }

            const { data } = await api.post(
                '/auth/apple-login',
                { idToken }
            );

            // after Apple login success
            await AsyncStorage.setItem('hasSeenIntro', 'true');
            login(data.user, data.accessToken, data.refreshToken);

        } catch (error) {
            console.log('Apple login error:', error);
        }
    };


    const loginhandler = async () => {
        console.log(email);

        try {
            if (!isvalid && email.length > 0 && password) {
                // First step: validate email and show password field
                setisvalid(true)
                // Second step: submit login with both email and password
                console.log("Logging in with:", { email, password });
                const { data } = await api.post('/auth/login', { email, password });
                alert(data && data.message)
                await AsyncStorage.setItem('hasSeenIntro', 'true');

                // after email/password login success
                login(data.user, data.accessToken, data.refreshToken);
            }
            else {
                Alert.alert('Error', 'Please enter valid credentials')
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Login failed')
        }
    }

    //handle business account logic 
    const partnerbutton = () => {

        console.log('going to partner page')
        navigation.replace('BusinessStep1')
    }


    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fefefe' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* ===== IMAGE ===== */}
                <ImageBackground
                    source={require('../../../assets/images/login_image.png')}
                    style={styles.backgroundimage}
                    imageStyle={{ borderRadius: 10 }}
                >
                    <TouchableOpacity
                        style={styles.partnerButton}
                        onPress={() => navigation.replace('ComingSoon')}
                    >
                        <Text style={{ marginLeft: 250, marginTop: 50, textDecorationLine: 'underline', color: '#000000bf' }}>
                            Partner with us
                        </Text>
                    </TouchableOpacity>
                </ImageBackground>

                {/* ===== CONTENT ===== */}
                <View style={styles.content}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.headingText, { color: '#6b5d33' }]}>Get moving with </Text>
                        <Text style={[styles.headingText, { color: '#bda960' }]}>Glaciq</Text>
                    </View>

                    <TextInput
                        placeholder="Enter username or email"
                        placeholderTextColor="#646369"
                        style={styles.input}
                        value={email}
                        onChangeText={setemail}
                    />

                    <TextInput
                        placeholder="Enter your password"
                        placeholderTextColor="#646369"
                        style={styles.input}
                        value={password}
                        onChangeText={setpassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.nextbox} onPress={loginhandler}>
                        <Text style={{ fontSize: 17, color: 'white', fontWeight: '600' }}>
                            Submit
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15 }}>
                        <View style={styles.divider} />
                        <Text style={{ color: '#00000076' }}>Or continue with</Text>
                        <View style={styles.divider} />
                    </View>
                </View>

                {/* ===== SOCIAL ===== */}
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.googleButton} onPress={onGoogleButtonPress}>
                        <Text style={styles.googleButtonText}>Google</Text>
                    </TouchableOpacity>

                    {AppleAuthentication.isAvailableAsync() && (
                        <AppleAuthentication.AppleAuthenticationButton
                            style={styles.googleButton}
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                            cornerRadius={20}
                            onPress={onAppleButtonPress}
                        />
                    )}
                </View>

                {/* ===== REGISTER ===== */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                    <Text>New user? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{ color: '#c5a330', fontWeight: '500' }}>Register</Text>
                    </TouchableOpacity>
                </View>

                {/* TEMP ADMIN LINK */}
                <TouchableOpacity
                    onPress={() => {
                        console.log("Navigating to admin...");
                        try {
                            if (router) {
                                router.push('/admin');
                            } else {
                                Alert.alert("Error", "Router not initialized");
                            }
                        } catch (e) {
                            console.error("Navigation error:", e);
                            Alert.alert("Navigation Error", e.message);
                        }
                    }}
                    style={{ alignSelf: 'center', marginBottom: 30 }}
                >
                    <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Go to Admin Panel</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );

}

export default Login

const styles = StyleSheet.create({

    // container: {
    //     backgroundColor: '#f8f9fb',
    //     flex: 1,
    //     // justifyContent: 'space-between',
    //     // alignItems: 'center',

    // },

    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },

    input: {
        borderWidth: 0.25,
        borderColor: 'black',
        borderRadius: 20,
        padding: 10,
        margin: 0,
        width: 300,
        color: 'black',
        backgroundColor: '#e1e4eb',

    },

    headingText: {
        fontSize: 27,
        fontWeight: 500,
        color: '#6b5d33',
        marginBottom: 10,
    },

    nextbox: {

        borderWidth: 0.15,
        width: 300,
        padding: 6,
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#c6a32f',
        marginTop: 0,

        shadowColor: '#3c3204',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,

    },

    googleButton: {
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 20,
        width: 150,
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 20,
        marginHorizontal: 5,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    googleButtonText: {
        color: 'black',
        fontSize: 14,
        fontWeight: '700',
        textShadowRadius: 0.5,

    },
    backgroundimage: {
        height: 440,
        width: 350,
        alignSelf: 'center',
        marginBottom: 15,


    },

    divider: {

        height: 1.5,
        width: 120,
        backgroundColor: '#0000002d'


    }
})