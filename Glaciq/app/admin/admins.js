import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { fetchAdmins, createAdmin, deleteAdmin } from "../../src/api/admin/adminAuthApi";

export default function AdminsPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const loadAdmins = async () => {
        setLoading(true);
        try {
            const { data } = await fetchAdmins();
            if (data.success) setAdmins(data.admins);
        } catch (error) {
            console.error("Fetch admins failed", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    const handleAdd = async () => {
        if (!name || !email || !phone || !password) return Alert.alert("Error", "All fields required");
        try {
            await createAdmin({ name, email, phone, password });
            Alert.alert("Success", "Admin created");
            setName(""); setEmail(""); setPhone(""); setPassword("");
            loadAdmins();
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to create admin");
        }
    };

    const handleDelete = (id) => {
        Alert.alert("Confirm Delete", "Are you sure you want to remove this admin?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        const { data } = await deleteAdmin(id); // Capture response data
                        loadAdmins();
                    } catch (error) {
                        // Check if the error response exists and has a message
                        const errorMessage = error.response?.data?.message || "Failed to delete admin";
                        Alert.alert("Error", errorMessage);
                    }
                }
            }
        ]);
    };

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Manage Admins</Text>

            {/* Add Form */}
            <View style={styles.form}>
                <Text style={styles.subHeader}>Add New Admin</Text>
                <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} placeholderTextColor={'black'} />
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" placeholderTextColor={'black'} />
                <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={'black'} />
                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={'black'} />

                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                    <Text style={styles.btnText}>Create Admin</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={admins}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                            <Text style={styles.email}>{item.phone}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(item._id)}>
                            <Text style={styles.deleteText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fb' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    subHeader: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#c6a32f' },

    form: {
        backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    input: { borderWidth: 1, borderColor: '#e0e0e0', padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#f9f9f9' },

    addBtn: { backgroundColor: '#c6a32f', padding: 12, borderRadius: 10, alignItems: 'center', shadowColor: '#c6a32f', shadowOpacity: 0.3, shadowRadius: 5, elevation: 3 },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    card: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    email: { color: '#666', marginTop: 2 },
    deleteText: { color: '#c62828', fontWeight: 'bold' }
});
