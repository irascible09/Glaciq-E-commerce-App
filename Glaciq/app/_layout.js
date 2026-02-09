import { Slot } from 'expo-router';
import { AuthProvider } from '../context/authContext';
import { CartProvider } from '../context/CartContext';
import setupAllInterceptors from '../src/utils/axiosInterceptor';
import { useEffect } from 'react';

export default function RootLayout() {
    useEffect(() => {
        setupAllInterceptors();
    }, []);

    return (
        <CartProvider>
            <AuthProvider>
                <Slot />
            </AuthProvider>
        </CartProvider>
    );
}

