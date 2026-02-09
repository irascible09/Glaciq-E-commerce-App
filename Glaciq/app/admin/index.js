import { useState, useContext } from 'react'; // Added useContext
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import axiosAdmin from '../../src/api/admin/axiosAdmin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/authContext'; // Import Context

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { setAdminLogin } = useContext(AuthContext); // Get helper

    const login = async () => {
        try {
            console.log("Attempting admin login...");
            setError('');
            const response = await axiosAdmin.post('/login', {
                email,
                password,
            });

            console.log("Admin API Response:", response.data);

            const { data } = response;

            await AsyncStorage.setItem('adminToken', data.token);
            await AsyncStorage.setItem('admin', JSON.stringify(data));

            // Update Context
            await setAdminLogin(data, data.token);

            console.log("Token stored, navigating to dashboard...");

            router.replace('/admin/dashboard');
        } catch (err) {
            console.log("Admin Login Error:", err);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fefefe' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.headerContainer}>
                    <Text style={[styles.headingText, { color: '#6b5d33' }]}>Glaciq </Text>
                    <Text style={[styles.headingText, { color: '#bda960' }]}>Admin</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.subHeading}>Welcome Back</Text>

                    <TextInput
                        placeholder="Admin Email"
                        placeholderTextColor="#646369"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        autoCapitalize="none"
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#646369"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity style={styles.loginButton} onPress={login}>
                        <Text style={styles.loginButtonText}>Login to Dashboard</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace('/')}
                >
                    <Text style={styles.backButtonText}>← Back to App</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fb',
    },
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 40,
    },
    headingText: {
        fontSize: 32,
        fontWeight: '700',
    },
    subHeading: {
        fontSize: 18,
        fontWeight: '600',
        color: '#646369',
        marginBottom: 20,
        alignSelf: 'flex-start',
        marginLeft: 10
    },
    card: {
        width: '100%',
        maxWidth: 350,
        alignItems: 'center',
        gap: 15,
    },
    input: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#ccc',
        borderRadius: 15,
        padding: 15,
        backgroundColor: '#e1e4eb',
        color: 'black',
        fontSize: 16,
    },
    loginButton: {
        width: '100%',
        padding: 15,
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#c6a32f',
        marginTop: 10,
        shadowColor: '#c6a32f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    backButton: {
        marginTop: 50,
        padding: 10,
    },
    backButtonText: {
        color: '#646369',
        fontSize: 16,
        fontWeight: '500',
    },
    error: {
        color: '#d32f2f',
        fontSize: 14,
        alignSelf: 'flex-start',
        marginLeft: 5,
    },
});
