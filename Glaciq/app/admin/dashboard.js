import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ActivityIndicator } from "react-native";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { fetchAllOrders, updateOrderStatus, assignDeliveryPartner } from "../../src/api/admin/adminOrderApi";
import { fetchPartners } from "../../src/api/admin/adminDeliveryApi";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [partners, setPartners] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const orderRes = await fetchAllOrders();
            const partnerRes = await fetchPartners();

            // Filter for ACTIVE orders only (PLACED or OUT_FOR_DELIVERY)
            const active = orderRes.data.filter(o =>
                ['PLACED', 'OUT_FOR_DELIVERY'].includes(o.orderStatus)
            );

            setOrders(active);
            setPartners(partnerRes.data);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAssign = async (partnerId) => {
        try {
            await assignDeliveryPartner(selectedOrder._id, partnerId);
            Alert.alert("Success", "Partner assigned successfully");
            setModalVisible(false);
            loadData();
        } catch (error) {
            Alert.alert("Error", "Failed to assign partner");
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            Alert.alert("Success", `Order updated to ${newStatus.replace(/_/g, ' ')}`);
            loadData();
        } catch (error) {
            Alert.alert("Error", "Failed to update status");
        }
    };

    // Helper to get partner name
    const getPartnerName = (id) => {
        const p = partners.find(p => p._id === id);
        return p ? p.name : 'Unassigned';
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#c6a32f" /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Active Orders</Text>
                <TouchableOpacity onPress={loadData} style={styles.refreshBtn}>
                    <MaterialIcons name="refresh" size={24} color="#646369" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<Text style={styles.emptyText}>No active orders</Text>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.orderId}>#{item.orderNumber || item._id.slice(-6).toUpperCase()}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: item.orderStatus === 'OUT_FOR_DELIVERY' ? '#e3f2fd' : '#fff3e0' }]}>
                                <Text style={[styles.statusText, { color: item.orderStatus === 'OUT_FOR_DELIVERY' ? '#1976d2' : '#f57c00' }]}>
                                    {item.orderStatus.replace(/_/g, ' ')}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.detailText}>Total: ₹{item.totalAmount}</Text>
                        <Text style={styles.detailText}>User: {item.userInfo?.name || 'Guest'}</Text>
                        <Text style={styles.detailText}>Delivery Partner: <Text style={{ fontWeight: 'bold' }}>{getPartnerName(item.deliveryPartner)}</Text></Text>

                        <View style={styles.actions}>
                            {/* Assign Partner Button - Show if no partner assigned OR if we want to change it */}
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.assignBtn]}
                                onPress={() => { setSelectedOrder(item); setModalVisible(true); }}
                            >
                                <Text style={styles.btnText}>{item.deliveryPartner ? 'Change Partner' : 'Assign Partner'}</Text>
                            </TouchableOpacity>

                            {/* Status Flow Buttons */}
                            {item.orderStatus === 'PLACED' && (
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.outBtn]}
                                    onPress={() => Alert.alert("Confirm", "Mark as Out for Delivery?", [
                                        { text: "Cancel" },
                                        { text: "Confirm", onPress: () => handleUpdateStatus(item._id, 'OUT_FOR_DELIVERY') }
                                    ])}
                                >
                                    <Text style={styles.btnText}>Mark Out for Delivery</Text>
                                </TouchableOpacity>
                            )}

                            {item.orderStatus === 'OUT_FOR_DELIVERY' && (
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.deliveredBtn]}
                                    onPress={() => Alert.alert("Confirm", "Mark as Delivered?", [
                                        { text: "Cancel" },
                                        { text: "Confirm", onPress: () => handleUpdateStatus(item._id, 'DELIVERED') }
                                    ])}
                                >
                                    <Text style={styles.btnText}>Mark Delivered</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            />

            {/* Partner Selection Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Delivery Partner</Text>
                        <FlatList
                            data={partners.filter(p => p.status === 'active')}
                            keyExtractor={item => item._id}
                            style={{ maxHeight: 300 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.partnerItem} onPress={() => handleAssign(item._id)}>
                                    <View>
                                        <Text style={styles.partnerName}>{item.name}</Text>
                                        <Text style={styles.partnerPhone}>{item.phone}</Text>
                                    </View>
                                    <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                            <Text style={styles.closeBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default AdminDashboard;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fb', padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    refreshBtn: { padding: 5 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },

    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#c6a32f' // Gold accent
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    detailText: { fontSize: 14, color: '#666', marginBottom: 4 },

    actions: { marginTop: 15, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 100, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: '600', fontSize: 12 },

    assignBtn: { backgroundColor: '#646369' }, // Dark Grey
    outBtn: { backgroundColor: '#c6a32f' }, // Gold
    deliveredBtn: { backgroundColor: '#2e7d32' }, // Green

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: 'white', borderRadius: 15, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    partnerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    partnerName: { fontSize: 16, fontWeight: '600', color: '#333' },
    partnerPhone: { fontSize: 14, color: '#999' },
    closeBtn: { marginTop: 15, padding: 12, alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 8 },
    closeBtnText: { color: '#666', fontWeight: 'bold' }
});
