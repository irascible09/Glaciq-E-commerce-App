import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert, Modal, Switch, ScrollView } from "react-native";
import { fetchInventory, updateDiscount, addStock, reduceStock, toggleStatus, updatePrice, createProduct, toggleBestSeller } from "../../src/api/admin/adminProductApi";

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [newDiscount, setNewDiscount] = useState("");

    // Stock Management State
    const [stockModalVisible, setStockModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockAction, setStockAction] = useState(null); // 'ADD' or 'REDUCE'
    const [stockInput, setStockInput] = useState("");

    // Add Product State
    const [addProductModalVisible, setAddProductModalVisible] = useState(false);
    const [newProductData, setNewProductData] = useState({ name: "", size: "", packSize: "", price: "", packaging: "Bottle" });

    // Price Edit State
    const [editingPriceId, setEditingPriceId] = useState(null);
    const [newPrice, setNewPrice] = useState("");

    const loadInventory = async () => {
        setLoading(true);
        try {
            const { data } = await fetchInventory();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load inventory:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadInventory();
    }, []);

    const handleUpdateDiscount = async (id) => {
        try {
            await updateDiscount(id, Number(newDiscount));
            Alert.alert("Success", "Discount updated");
            setEditingId(null);
            setNewDiscount("");
            loadInventory();
        } catch (error) {
            Alert.alert("Error", "Failed to update discount");
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleStatus(id);
            // Optimistic update or reload
            loadInventory();
        } catch (error) {
            Alert.alert("Error", "Failed to update status");
        }
    };

    const handleToggleBestSeller = async (id) => {
        try {
            const product = products.find(p => p.id === id);
            if (product && !product.isActive) {
                Alert.alert("Error", "Product is not active");
                return;
            }

            await toggleBestSeller(id);
            loadInventory();
        } catch (error) {
            Alert.alert("Error", "Failed to update best seller status");
        }
    };

    const handleUpdatePrice = async (id) => {
        try {
            await updatePrice(id, Number(newPrice));
            Alert.alert("Success", "Price updated");
            setEditingPriceId(null);
            setNewPrice("");
            loadInventory();
        } catch (error) {
            Alert.alert("Error", "Failed to update price");
        }
    };

    const handleCreateProduct = async () => {
        try {
            await createProduct(newProductData);
            Alert.alert("Success", "Product created successfully");
            setAddProductModalVisible(false);
            setNewProductData({ name: "", size: "", packSize: "", price: "", packaging: "Bottle" });
            loadInventory();
        } catch (error) {
            Alert.alert("Error", "Failed to create product");
        }
    };

    const openStockModal = (product, action) => {
        setSelectedProduct(product);
        setStockAction(action);
        setStockInput("");
        setStockModalVisible(true);
    };

    const handleStockUpdate = async () => {
        if (!stockInput || isNaN(stockInput) || Number(stockInput) <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid number of bottles.");
            return;
        }

        const bottles = Number(stockInput);

        try {
            if (stockAction === 'ADD') {
                await addStock(selectedProduct.id, bottles);
                Alert.alert("Success", `Added ${bottles} bottles to stock.`);
            } else {
                await reduceStock(selectedProduct.id, bottles);
                Alert.alert("Success", `Reduced stock by ${bottles} bottles.`);
            }
            setStockModalVisible(false);
            loadInventory();
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to update stock");
        }
    };

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

    return (
        <View style={styles.container}>
            {/* <View style={styles.header}>
                <Text style={styles.title}>Inventory Management</Text>
                <TouchableOpacity style={styles.addProductBtn} onPress={() => setAddProductModalVisible(true)}>
                    <Text style={styles.addProductText}>+ Add Product</Text>
                </TouchableOpacity>
            </View> */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{item.name} ({item.size})</Text>

                            {/* Price Row */}
                            <View style={styles.priceRow}>
                                <Text style={styles.sub}>Price: ₹{item.price}</Text>
                                <TouchableOpacity onPress={() => { setEditingPriceId(item.id); setNewPrice(String(item.price)) }}>
                                    <Text style={styles.editLink}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                            {editingPriceId === item.id && (
                                <View style={styles.editRow}>
                                    <TextInput
                                        style={styles.input}
                                        value={newPrice}
                                        onChangeText={setNewPrice}
                                        keyboardType="numeric"
                                        placeholder="New Price"
                                    />
                                    <TouchableOpacity onPress={() => handleUpdatePrice(item.id)}>
                                        <Text style={styles.saveBtn}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setEditingPriceId(null)}>
                                        <Text style={styles.cancelBtn}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <Text style={styles.sub}>Stock: {item.packs} packs | {item.loose} loose</Text>
                            <Text style={styles.sub}>Current Discount: {item.discount || 0}%</Text>

                            {/* Stock Actions Row */}
                            <View style={[styles.stockActions, { padding: 8 }]}>
                                <TouchableOpacity
                                    style={[styles.stockBtn, styles.addBtn]}
                                    onPress={() => openStockModal(item, 'ADD')}
                                >
                                    <Text style={styles.stockBtnText}>+ Add Stock</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.stockBtn, styles.reduceBtn]}
                                    onPress={() => openStockModal(item, 'REDUCE')}
                                >
                                    <Text style={styles.stockBtnText}>- Reduce</Text>
                                </TouchableOpacity>

                                {/* Status Toggle */}
                                <View style={styles.statusToggle}>
                                    <Text style={[styles.statusLabel, !item.isActive && styles.inactiveLabel]}>
                                        {item.isActive ? 'Show' : 'Hide'}
                                    </Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={item.isActive ? "#1976d2" : "#f4f3f4"}
                                        onValueChange={() => handleToggleStatus(item.id)}
                                        value={item.isActive}
                                    />
                                </View>

                                {/* Best Seller Toggle */}
                                <TouchableOpacity onPress={() => handleToggleBestSeller(item.id)} style={styles.bestSellerToggle}>
                                    <Text style={[styles.bestSellerText, item.isBestSeller && styles.bestSellerActive]}>
                                        {item.isBestSeller ? '★ Best Seller' : '☆ Add to Top'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {editingId === item.id ? (
                            <View style={styles.actionBox}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="%"
                                    keyboardType="numeric"
                                    value={newDiscount}
                                    onChangeText={setNewDiscount}
                                />
                                <TouchableOpacity onPress={() => handleUpdateDiscount(item.id)}>
                                    <Text style={styles.saveBtn}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setEditingId(null)}>
                                    <Text style={styles.cancelBtn}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => { setEditingId(item.id); setNewDiscount(String(item.discount || 0)); }}>
                                <Text style={styles.editBtn}>Edit %</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />

            {/* Stock Modal */}
            <Modal
                transparent={true}
                visible={stockModalVisible}
                animationType="slide"
                onRequestClose={() => setStockModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {stockAction === 'ADD' ? 'Add Stock' : 'Reduce Stock'}
                        </Text>
                        <Text style={styles.modalSub}>
                            {selectedProduct?.name} ({selectedProduct?.size})
                        </Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter quantity (Bottles)"
                            keyboardType="numeric"
                            value={stockInput}
                            onChangeText={setStockInput}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setStockModalVisible(false)}>
                                <Text style={styles.modalBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalConfirm, stockAction === 'ADD' ? styles.addBtn : styles.reduceBtn]}
                                onPress={handleStockUpdate}
                            >
                                <Text style={[styles.modalBtnText, { color: 'white' }]}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Add Product Modal */}
            <Modal visible={addProductModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Product</Text>

                        <TextInput style={styles.modalInput} placeholder="Product Name (e.g. Cold Coffee)" placeholderTextColor={'#999'} value={newProductData.name} onChangeText={t => setNewProductData({ ...newProductData, name: t })} />
                        <TextInput style={styles.modalInput} placeholder="Size (e.g. 2L)" placeholderTextColor={'#999'} value={newProductData.size} onChangeText={t => setNewProductData({ ...newProductData, size: t })} />
                        <TextInput style={styles.modalInput} placeholder="Pack Size (e.g. 6)" keyboardType="numeric" placeholderTextColor={'#999'} value={newProductData.packSize} onChangeText={t => setNewProductData({ ...newProductData, packSize: t })} />
                        <TextInput style={styles.modalInput} placeholder="Price (₹)" keyboardType="numeric" placeholderTextColor={'#999'} value={newProductData.price} onChangeText={t => setNewProductData({ ...newProductData, price: t })} />
                        <TextInput style={styles.modalInput} placeholder="Packaging (Default: Bottle)" placeholderTextColor={'#999'} value={newProductData.packaging} onChangeText={t => setNewProductData({ ...newProductData, packaging: t })} />

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setAddProductModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleCreateProduct}>
                                <Text style={styles.buttonText}>Create Product</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.addProductBtn} onPress={() => setAddProductModalVisible(true)}>
                <Text style={styles.addProductText}>+ Add Product</Text>
            </TouchableOpacity>
        </View>
    );
};

export default InventoryPage;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fb' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },

    row: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'flex-start', // Changed to align top items
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    sub: { fontSize: 14, color: '#666', marginTop: 2 },

    stockActions: { flexDirection: 'row', gap: 5, marginTop: 10 },
    stockBtn: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6 },
    addBtn: { backgroundColor: '#2e7d32' },
    reduceBtn: { backgroundColor: '#c62828' },
    stockBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

    statusToggle: { flexDirection: 'row', alignItems: 'center', marginLeft: 10, gap: 5 },
    statusLabel: { fontSize: 12, fontWeight: '600', color: '#1976d2' },
    inactiveLabel: { color: '#757575' },

    editBtn: { color: '#c6a32f', fontWeight: 'bold', padding: 5, marginTop: 5 },

    actionBox: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 5 },
    input: { borderWidth: 1, borderColor: '#e0e0e0', width: 60, padding: 8, borderRadius: 8, textAlign: 'center', backgroundColor: '#f9f9f9' },
    saveBtn: { color: '#2e7d32', fontWeight: 'bold', padding: 5 },
    cancelBtn: { color: '#c62828', fontWeight: 'bold', padding: 5 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: 'white', borderRadius: 15, padding: 25, width: '85%', maxWidth: 400 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
    modalSub: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
    modalInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, width: '100%' },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    modalCancel: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#f0f0f0', alignItems: 'center' },
    modalConfirm: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
    modalBtnText: { fontWeight: 'bold', fontSize: 16 },

    // New Styles
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    addProductBtn: { backgroundColor: '#4caf50', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 8, justifyContent: 'flex-end', alignItems: 'center' },
    addProductText: { color: 'white', fontWeight: 'bold' },

    priceRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
    editLink: { color: '#1976d2', marginLeft: 10, fontWeight: 'bold', fontSize: 13 },
    editRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 10 },

    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
    cancelButton: { padding: 10 },
    confirmButton: { backgroundColor: '#1976d2', padding: 10, borderRadius: 6 },
    buttonText: { color: '#333', fontWeight: 'bold' },
    confirmButtonText: { color: 'white', fontWeight: 'bold' },

    bestSellerToggle: { marginTop: 5, padding: 5 },
    bestSellerText: { fontSize: 12, color: '#aaa' },
    bestSellerActive: { color: '#fbc02d', fontWeight: 'bold' } // Gold color
});
