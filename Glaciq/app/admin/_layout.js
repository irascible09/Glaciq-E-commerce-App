import { Drawer } from 'expo-router/drawer';
import { useEffect, useContext } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/authContext';

function CustomDrawerContent(props) {
    const { logout } = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/admin');
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Admin Panel</Text>
                </View>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <View style={styles.footer}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <MaterialIcons name="logout" size={22} color="#d32f2f" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function AdminLayout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: '#f8f9fb', elevation: 0, shadowOpacity: 0 },
                headerTintColor: '#c6a32f',
                headerTitleStyle: { fontWeight: 'bold' },
                drawerActiveBackgroundColor: '#c6a32f',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#646369',
                drawerStyle: { backgroundColor: '#f8f9fb' },
            }}
        >
            <Drawer.Screen
                name="index"
                options={{
                    drawerLabel: () => null,
                    title: null,
                    headerShown: false,
                    drawerItemStyle: { display: 'none' },
                    swipeEnabled: false,
                }}
            />
            <Drawer.Screen
                name="dashboard"
                options={{
                    drawerLabel: 'Dashboard',
                    title: 'Active Orders',
                    drawerIcon: ({ color }) => <MaterialIcons name="dashboard" size={22} color={color} />,
                }}
            />
            <Drawer.Screen
                name="orders"
                options={{
                    drawerLabel: 'All Orders',
                    title: 'Order History',
                    drawerIcon: ({ color }) => <MaterialIcons name="history" size={22} color={color} />,
                }}
            />
            <Drawer.Screen
                name="inventory"
                options={{
                    drawerLabel: 'Inventory',
                    title: 'Inventory',
                    drawerIcon: ({ color }) => <MaterialIcons name="inventory" size={22} color={color} />,
                }}
            />
            <Drawer.Screen
                name="delivery"
                options={{
                    drawerLabel: 'Partners',
                    title: 'Delivery Partners',
                    drawerIcon: ({ color }) => <MaterialIcons name="delivery-dining" size={22} color={color} />,
                }}
            />
            <Drawer.Screen
                name="admins"
                options={{
                    drawerLabel: 'Admins',
                    title: 'Manage Admins',
                    drawerIcon: ({ color }) => <MaterialIcons name="admin-panel-settings" size={22} color={color} />,
                }}
            />
            <Drawer.Screen
                name="discounts"
                options={{
                    drawerLabel: 'Discounts & Delivery',
                    title: 'Discounts & Charges',
                    drawerIcon: ({ color }) => <MaterialIcons name="local-offer" size={22} color={color} />,
                }}
            />
        </Drawer>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#c6a32f',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    logoutText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#d32f2f',
        fontWeight: '500',
    },
});
