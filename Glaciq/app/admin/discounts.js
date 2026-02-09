import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { fetchSettings, updateSettings } from "../../src/api/admin/adminSettingsApi";
import { fetchInventory, updateDiscount } from "../../src/api/admin/adminProductApi";
import { MaterialIcons } from '@expo/vector-icons';

const DiscountsPage = () => {
    const [loading, setLoading] = useState(true);
    const [deliveryCharge, setDeliveryCharge] = useState("");
    const [minFreeDelivery, setMinFreeDelivery] = useState("");
    const [bulkRules, setBulkRules] = useState([]);

    // Product List for Discounts
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newDiscount, setNewDiscount] = useState("");

    const loadData = async () => {
        setLoading(true);
        try {
            const settingsRes = await fetchSettings();
            const productsRes = await fetchInventory();

            setDeliveryCharge(String(settingsRes.data.deliveryCharge || 0));
            setMinFreeDelivery(String(settingsRes.data.minFreeDeliveryAmount || 0));
            setBulkRules(settingsRes.data.bulkDiscounts || []);
            setProducts(productsRes.data);
        } catch (error) {
            console.error("Failed to load discount settings:", error);
            Alert.alert("Error", "Failed to load settings");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSaveSettings = async () => {
        try {
            await updateSettings({
                deliveryCharge: Number(deliveryCharge),
                minFreeDeliveryAmount: Number(minFreeDelivery),
                bulkDiscounts: bulkRules
            });
            Alert.alert("Success", "Settings updated successfully");
        } catch (error) {
            console.error("Failed to save settings:", error);
            Alert.alert("Error", "Failed to save settings");
        }
    };

    const addBulkRule = () => {
        setBulkRules([...bulkRules, { minOrderValue: 0, discountPercentage: 0 }]);
    };

    const updateBulkRule = (index, field, value) => {
        const newRules = [...bulkRules];
        newRules[index][field] = Number(value);
        setBulkRules(newRules);
    };

    const removeBulkRule = (index) => {
        const newRules = bulkRules.filter((_, i) => i !== index);
        setBulkRules(newRules);
    };

    const handleUpdateProductDiscount = async (id) => {
        try {
            await updateDiscount(id, Number(newDiscount));
            Alert.alert("Success", "Product discount updated");
            setEditingId(null);
            setNewDiscount("");
            loadData(); // Reload to refresh product list
        } catch (error) {
            Alert.alert("Error", "Failed to update product discount");
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#c6a32f" /></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.header}>Discounts & Delivery</Text>

            {/* Delivery Settings Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delivery Settings</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Base Delivery Charge (₹)</Text>
                    <TextInput
                        style={styles.input}
                        value={deliveryCharge}
                        onChangeText={setDeliveryCharge}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Free Delivery Above (₹)</Text>
                    <TextInput
                        style={styles.input}
                        value={minFreeDelivery}
                        onChangeText={setMinFreeDelivery}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity style={styles.saveMainBtn} onPress={handleSaveSettings}>
                    <Text style={styles.btnText}>Save Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Bulk Discounts Section */}
            <View style={styles.section}>
                <View style={styles.rowHeader}>
                    <Text style={styles.sectionTitle}>Bulk Order Discounts</Text>
                    <TouchableOpacity onPress={addBulkRule}>
                        <MaterialIcons name="add-circle" size={28} color="#2e7d32" />
                    </TouchableOpacity>
                </View>

                {bulkRules.map((rule, index) => (
                    <View key={index} style={styles.ruleRow}>
                        <View style={styles.ruleInputContainer}>
                            <Text style={styles.ruleLabel}>Above ₹</Text>
                            <TextInput
                                style={styles.ruleInput}
                                value={String(rule.minOrderValue)}
                                onChangeText={(val) => updateBulkRule(index, 'minOrderValue', val)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.ruleInputContainer}>
                            <Text style={styles.ruleLabel}>Get % Off</Text>
                            <TextInput
                                style={styles.ruleInput}
                                value={String(rule.discountPercentage)}
                                onChangeText={(val) => updateBulkRule(index, 'discountPercentage', val)}
                                keyboardType="numeric"
                            />
                        </View>
                        <TouchableOpacity onPress={() => removeBulkRule(index)}>
                            <MaterialIcons name="delete" size={24} color="#c62828" />
                        </TouchableOpacity>
                    </View>
                ))}
                {bulkRules.length === 0 && <Text style={styles.emptyText}>No bulk discount rules active.</Text>}

                <TouchableOpacity style={[styles.saveMainBtn, { marginTop: 15 }]} onPress={handleSaveSettings}>
                    <Text style={styles.btnText}>Save Rules</Text>
                </TouchableOpacity>
            </View>

            {/* Product Discounts Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Product Discounts</Text>
                {products.length === 0 ? <Text style={styles.emptyText}>No products found.</Text> :
                    products.map(item => (
                        <View key={item.id} style={styles.productRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productSub}>{item.size} • {item.discount || 0}% Off</Text>
                            </View>

                            {editingId === item.id ? (
                                <View style={styles.actionBox}>
                                    <TextInput
                                        style={styles.miniInput}
                                        placeholder="%"
                                        keyboardType="numeric"
                                        value={newDiscount}
                                        onChangeText={setNewDiscount}
                                        autoFocus
                                    />
                                    <TouchableOpacity onPress={() => handleUpdateProductDiscount(item.id)}>
                                        <MaterialIcons name="check" size={24} color="#2e7d32" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setEditingId(null)}>
                                        <MaterialIcons name="close" size={24} color="#c62828" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={() => { setEditingId(item.id); setNewDiscount(String(item.discount || 0)); }}>
                                    <Text style={styles.editLink}>Edit</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))
                }
            </View>
        </ScrollView>
    );
};

export default DiscountsPage;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fb' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },

    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#444', marginBottom: 15 },

    inputGroup: { marginBottom: 15 },
    label: { fontSize: 14, color: '#666', marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#f9f9f9' },

    saveMainBtn: { backgroundColor: '#c6a32f', padding: 12, borderRadius: 8, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Bulk Rules
    rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    ruleInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#f9f9f9' },
    ruleLabel: { color: '#888', marginRight: 5 },
    ruleInput: { flex: 1, paddingVertical: 10, fontSize: 16, color: '#333' },

    // Product List
    productRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    productName: { fontSize: 16, fontWeight: '600', color: '#333' },
    productSub: { fontSize: 13, color: '#888' },
    editLink: { color: '#c6a32f', fontWeight: 'bold' },

    actionBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    miniInput: { borderWidth: 1, borderColor: '#ddd', width: 60, padding: 5, borderRadius: 6, textAlign: 'center' },
    emptyText: { fontStyle: 'italic', color: '#999', marginTop: 5 }
});
