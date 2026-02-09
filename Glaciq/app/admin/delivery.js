import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView, Alert, Switch } from "react-native";
import { fetchPartners, addPartner, updatePartnerStatus, fetchSettings, updateSettings } from "../../src/api/admin/adminDeliveryApi";

export default function DeliveryManagement() {
    const [partners, setPartners] = useState([]);
    const [settings, setSettings] = useState({ deliveryCharge: 0, minFreeDeliveryAmount: 500 });

    // Form states
    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");

    const loadData = async () => {
        try {
            const pRes = await fetchPartners();
            setPartners(pRes.data);

            const sRes = await fetchSettings();
            if (sRes.data) setSettings(sRes.data);
        } catch (error) {
            console.error("Load error", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddPartner = async () => {
        if (!newName || !newPhone) return Alert.alert("Error", "All fields required");
        try {
            await addPartner({ name: newName, phone: newPhone });
            Alert.alert("Success", "Partner added");
            setNewName(""); setNewPhone("");
            loadData();
        } catch (e) {
            Alert.alert("Error", "Failed to add partner");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await updatePartnerStatus(id, newStatus);
            loadData();
        } catch (e) { Alert.alert("Error", "Failed to update status"); }
    };

    const saveSettings = async () => {
        try {
            await updateSettings(settings);
            Alert.alert("Success", "Settings saved");
        } catch (e) { Alert.alert("Error", "Failed to save settings"); }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Delivery Management</Text>

            {/* SETTINGS SECTION */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Global Settings</Text>
                <View style={styles.row}>
                    <Text>Delivery Charge (₹)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(settings.deliveryCharge)}
                        onChangeText={v => setSettings({ ...settings, deliveryCharge: Number(v) })}
                    />
                </View>
                <View style={styles.row}>
                    <Text>Free Delivery Above (₹)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(settings.minFreeDeliveryAmount)}
                        onChangeText={v => setSettings({ ...settings, minFreeDeliveryAmount: Number(v) })}
                    />
                </View>
                <TouchableOpacity style={styles.btn} onPress={saveSettings}>
                    <Text style={styles.btnText}>Update Settings</Text>
                </TouchableOpacity>
            </View>

            {/* PARTNERS SECTION */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delivery Partners</Text>

                {/* Add Partner Form */}
                <View style={styles.addForm}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Name"
                        value={newName}
                        onChangeText={setNewName}
                        placeholderTextColor={'black'}
                    />
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Phone"
                        keyboardType="phone-pad"
                        value={newPhone}
                        onChangeText={setNewPhone}
                        placeholderTextColor={'black'}
                    />
                    <TouchableOpacity style={[styles.btn, { marginTop: 0 }]} onPress={handleAddPartner}>
                        <Text style={styles.btnText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {/* List */}
                <View style={styles.list}>
                    {partners.map(p => (
                        <View key={p._id} style={styles.partnerRow}>
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>{p.name}</Text>
                                <Text style={{ color: '#666' }}>{p.phone}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={{ color: p.status === 'active' ? 'green' : 'red' }}>
                                    {p.status.toUpperCase()}
                                </Text>
                                <Switch
                                    value={p.status === 'active'}
                                    onValueChange={() => toggleStatus(p._id, p.status)}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fb' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },

    section: {
        backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#c6a32f' },

    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    input: { borderWidth: 1, borderColor: '#e0e0e0', padding: 10, borderRadius: 8, minWidth: 100, marginLeft: 10, backgroundColor: '#f9f9f9' },

    btn: { backgroundColor: '#c6a32f', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    addForm: { flexDirection: 'row', gap: 10, marginBottom: 20 },

    list: { marginTop: 10 },
    partnerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }
});
